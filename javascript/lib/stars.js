const SOUNDS = [
  "audio/11072__angstrom__a-2.wav",
  "audio/11073__angstrom__a2.wav",
  "audio/11074__angstrom__b2.wav",
  "audio/11075__angstrom__c-1.wav",
  "audio/11076__angstrom__c-2.wav",
  "audio/11077__angstrom__c1.wav",
  "audio/11078__angstrom__c2.wav",
  "audio/11079__angstrom__d-1.wav",
  "audio/11080__angstrom__d-2.wav",
  "audio/11083__angstrom__e1.wav",
  "audio/11084__angstrom__e2.wav",
  "audio/11085__angstrom__f-1.wav",
  "audio/11086__angstrom__f1.wav",
  "audio/11087__angstrom__g-1.wav",
  "audio/11088__angstrom__g1.wav",
  "audio/11081__angstrom__d1.wav",
  "audio/11082__angstrom__d2.wav"
];

class Star {
    constructor(values) {
        this.pos = values.pos;
        this.radius = Math.floor(Math.random() * 7) + 4; 
        this.color = "white";

        let audio = document.createElement('audio');
        audio.setAttribute("src", SOUNDS[values.idx]);
        document.body.appendChild(audio);

        this.audio = audio;
    }

    playSound(){
        this.audio.currentTime = 0;
        this.audio.play();
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc( this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();
    }

    drawSelected(ctx){
        ctx.fillStyle = this.color;
        ctx.shadowColor = "yellow";
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
        ctx.fill();
    }

}

module.exports = Star;