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
    this.tempo = 1100;
    this.snapshot = null;
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

  takeSnapshot(){
    this.snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
  }

  restoreSnapshot(){
    context.putImageData(this.snapshot, 0, 0);
  }

  clear(){
      this.sequence = [];
      this.lines = [];
      this.playing = false;
      this.draw(context);  
  }

  changeTempo(event){
    this.tempo = event.target.value;
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
                    if (that.playing === false){
                      return;
                    }
                    let star = sequence[i];
                    star.drawSelected(context);
                    sequence[i].playSound();
                    loop();
                }, that.tempo);
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
        }, that.tempo);

      if (i === o.length) {
          that.playing = false;
        return;
      }
      o.functionToLoop(loop, i);
      
    };
    loop();
  }

  draw(ctx) {
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

  checkOverlapStars(xCoord, yCoord){
    this.stars.forEach((star) => {
      if ((xCoord <= star.pos[0] + star.radius + 15 &&
        xCoord >= star.pos[0] - star.radius - 15)) {
        xCoord += 50;
      }

      if ((yCoord <= star.pos[1] + star.radius + 15 &&
        yCoord >= star.pos[1] - star.radius - 15)) {
        yCoord += 50;
      }
    });

    return [xCoord, yCoord];
  }

  randomPosition() {
    let xCoord = DIM_X * Math.random();
    let yCoord = DIM_Y * Math.random();

    let noOverlap = false;

    while (noOverlap === false) {

      let changedCoords = this.checkOverlapStars(xCoord, yCoord);
      xCoord = changedCoords[0];
      yCoord = changedCoords[1];

      if (xCoord < 50 || xCoord >= DIM_X - 50) {
        xCoord = DIM_X * Math.random();
      } else if (yCoord < 50 || yCoord >= DIM_Y - 50) {
        yCoord = DIM_Y * Math.random();
      } else {
        noOverlap = true;
      }
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
      this.takeSnapshot();
    }
  }

  lineDrag(canv, event) {
    if (canvas.dragging === true) {
      this.restoreSnapshot();
      const cursorPos = this.getCursorPosition(canv, event);
      const pos = [cursorPos.x, cursorPos.y];
      this.drawLine(pos);
    }
  }

  lineEnd(canv, event) {
    const cursorPos = this.getCursorPosition(canv, event);
    canvas.dragging = false;

    if (this.firstStar) {
      this.restoreSnapshot();
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
    this.snapshot = null;
  }
}

module.exports = Sky;