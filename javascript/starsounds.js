const Sky = require("./lib/sky");

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const sky = new Sky();
    sky.draw(ctx);
});