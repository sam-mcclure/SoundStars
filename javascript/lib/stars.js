class Star {
    constructor(values) {
        this.pos = values.pos;
        this.radius = Math.floor(Math.random() * 7) + 3; 
        this.color = "white";
        this.clicked = false;
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.shadowColor = "white";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc( this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
        ctx.fill();
    }
}

module.exports = Star;