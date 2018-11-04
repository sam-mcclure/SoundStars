const Sky = require("./lib/sky");

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const newSky = document.getElementById('new-sky');
    const sequence = document.getElementById('sequence');
    const clearSky = document.getElementById('clear-sky');
    const tempo = document.getElementById('tempo');

    const sky = new Sky();
    sky.draw(ctx);

    canvas.addEventListener('mousedown', () => 
        sky.lineStart(canvas,event), false);
    canvas.addEventListener('mousemove', () =>
        sky.lineDrag(canvas, event), false);
    canvas.addEventListener("mouseup", () => 
        sky.lineEnd(canvas, event), false);
    newSky.addEventListener('click', () => 
        location.reload(), false);
    sequence.addEventListener("click", () => 
        sky.playSequence(), false);
    clearSky.addEventListener('click', () => 
        sky.clear(), false);
    tempo.addEventListener('change', ()=> 
        sky.changeTempo(event), false);
});