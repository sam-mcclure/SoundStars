const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const innerWidth = window.innerWidth;
const innerHeight = window.innerHeight;
canvas.width = innerWidth;
canvas.height = innerHeight - 60;

module.exports = canvas;