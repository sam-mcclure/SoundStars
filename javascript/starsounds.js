const Sky = require("./lib/sky");

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const reset = document.getElementById('reset');
    const sequence = document.getElementById('sequence');

    const sky = new Sky();
    sky.draw(ctx);

    // canvas.addEventListener('click', () =>
    //     sky.checkClickedStar(canvas, event), false);
    canvas.addEventListener('mousedown', () => 
        sky.lineStart(canvas,event), false);
    canvas.addEventListener('mousemove', () =>
        sky.lineDrag(canvas, event), false);
    canvas.addEventListener("mouseup", () => 
        sky.lineEnd(canvas, event), false);
    reset.addEventListener('click', () => 
        location.reload(), false);
    sequence.addEventListener("click", () => 
        sky.playSequence(), false);


});