const Star = require('./stars');
const canvas = require("./canvas");
const DIM_X = canvas.width;
const DIM_Y = canvas.height;
const NUM_STARS = 20;

class Sky {
    constructor(){
        this.stars = [];
        this.addStars();
    }
    
    getCursorPosition(canv, event) {
        let rect = canv.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        return {x, y};
    }

    checkClickedStar(canv, event){
        const cursorPos = this.getCursorPosition(canv, event);

        this.stars.forEach((star) => {
            let xPos = star.pos[0];
            let yPos = star.pos[1];
            let r = star.radius;
            if (cursorPos.x <= xPos + r && 
                cursorPos.x >= xPos - r &&
                cursorPos.y <= yPos + r &&
                cursorPos.y >= yPos - r){
                    star.selected = true;
                    console.log("selected star");
                }

        });
    }

    addStars(){
        for (let i = 0; i < NUM_STARS; i++ ){
            this.stars.push(new Star({
                pos: this.randomPosition()
            }));
        }
    }

    draw(ctx){
        console.log("stars", this.stars);
        ctx.clearRect(0, 0, DIM_X, DIM_Y);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, DIM_X, DIM_Y);
        this.stars.forEach((star) => {
            star.draw(ctx);
        });
    }

    randomPosition(){

        let xCoord = DIM_X * Math.random();
        let yCoord = DIM_Y * Math.random();

        if (xCoord < 50){
            xCoord += 50;
        } else if (xCoord >= DIM_X - 50){
            xCoord -= 50;
        }

        if (yCoord < 50) {
            yCoord += 50;
        } else if (yCoord >= DIM_Y - 50) {
            yCoord -= 50;
        }
        return [
            xCoord,
            yCoord
        ];
    }

}

module.exports = Sky;