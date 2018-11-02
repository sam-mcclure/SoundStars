const Star = require('./stars');
const canvas = require("./canvas");
const context = canvas.getContext("2d");
const DIM_X = canvas.width;
const DIM_Y = canvas.height;
const NUM_STARS = 17;

class Sky {
  constructor() {
    this.stars = [];
    this.addStars();
    this.firstStar = null;
    this.secondStar = null;
    this.dragStart = null;
    this.sequence = [];
    this.lines = [];
    this.playing = false;
  }

  addStars() {
    for (let i = 0; i < NUM_STARS; i++) {
      this.stars.push(
        new Star({
          pos: this.randomPosition(),
          idx: i
        })
      );
    }
  }

  clear(){
      this.sequence = [];
      this.lines = [];
      this.draw(context, true);  
  }

  playSequence() {
    let sequence = this.sequence;
    let draw = this.draw;
    let that = this;

    if (this.playing === false){
        this.playing = true;
        this.asyncLoop({
            length: sequence.length,
            functionToLoop: function (loop, i) {
                setTimeout(function () {
                    let star = sequence[i];
                    star.drawSelected(context);
                    sequence[i].playSound();
                    loop();
                }, 1000);
            },
        });
    }
    

  }

  //https://stackoverflow.com/questions/4288759/asynchronous-for-cycle-in-javascript

  asyncLoop(o) {
    let i = -1;
    let that = this;

    let loop = function() {
      i++;
        setTimeout(function () {
            that.draw(context);
        }, 1000);

      if (i === o.length) {
          that.playing = false;
        return;
      }
      o.functionToLoop(loop, i);
      
    };
    loop();
  }

  draw(ctx, clear) {
    ctx.clearRect(0, 0, DIM_X, DIM_Y);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, DIM_X, DIM_Y);
    this.stars.forEach(star => {
      star.draw(ctx);
    });


    this.lines.forEach((line) => {
        this.dragStart = line[0].pos;
        this.drawLine(line[1].pos);
    });

    this.dragStart = null;

  }

  drawLine(pos) {
    context.beginPath();
    context.moveTo(this.dragStart[0], this.dragStart[1]);
    context.lineTo(pos[0], pos[1]);
    context.strokeStyle = "white";
    context.lineWidth = 2;
    context.stroke();
  }

  randomPosition() {
    let xCoord = DIM_X * Math.random();
    let yCoord = DIM_Y * Math.random();

    this.stars.forEach((star) => {
        if ((xCoord <= star.pos[0] + star.radius + 10 &&
            xCoord >= star.pos[0] - star.radius + 10)) {
            xCoord += 40;
        }

        if ((yCoord <= star.pos[1] + star.radius + 10 &&
            yCoord >= star.pos[1] - star.radius + 10)) {
            yCoord += 40;
        }
    });

    if (xCoord < 50) {
      xCoord += 50;
    } else if (xCoord >= DIM_X - 50) {
      xCoord -= 50;
    }

    if (yCoord < 50) {
      yCoord += 50;
    } else if (yCoord >= DIM_Y - 50) {
      yCoord -= 50;
    }
    return [xCoord, yCoord];
  }

  getCursorPosition(canv, event) {
    let rect = canv.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return { x, y };
  }

  checkClickedStar(canv, event) {
    const cursorPos = this.getCursorPosition(canv, event);

    this.stars.forEach(star => {
      let xPos = star.pos[0];
      let yPos = star.pos[1];
      let r = star.radius;
      if (
        cursorPos.x <= xPos + r &&
        cursorPos.x >= xPos - r &&
        cursorPos.y <= yPos + r &&
        cursorPos.y >= yPos - r
      ) {
        if (this.firstStar === null) {
          this.firstStar = star;
          star.playSound();
        } else if (star !== this.firstStar) {
          this.secondStar = star;
          star.playSound();
        }
      }
    });
  }

  lineStart(canv, event) {
    const cursorPos = this.getCursorPosition(canv, event);
    this.checkClickedStar(canv, event);
    let star = this.firstStar;
    if (star) {
      canvas.dragging = true;
      this.dragStart = [this.firstStar.pos[0], this.firstStar.pos[1]];
    }
  }

  lineDrag(canv, event) {
    if (canvas.dragging === true) {
      const cursorPos = this.getCursorPosition(canv, event);
      this.drawLine(cursorPos);
    }
  }

  lineEnd(canv, event) {
    const cursorPos = this.getCursorPosition(canv, event);
    canvas.dragging = false;

    if (this.firstStar) {
      this.checkClickedStar(canv, event);
      let nextStar = this.secondStar;

      if (nextStar) {
        this.drawLine([nextStar.pos[0], nextStar.pos[1]]);
        this.lines.push([this.firstStar, nextStar]);

        if (this.sequence[this.sequence.length - 1] !== this.firstStar) {
          this.sequence.push(this.firstStar);
        }
        this.sequence.push(this.secondStar);
      }
    }

    this.dragStart = null;
    this.firstStar = null;
    this.secondStar = null;
  }
}

module.exports = Sky;