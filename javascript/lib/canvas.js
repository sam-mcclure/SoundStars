const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
// const innerWidth = window.innerWidth;
// const innerHeight = window.innerHeight;
canvas.width = 1200;
canvas.height = 500;
canvas.dragging = false;

module.exports = canvas;