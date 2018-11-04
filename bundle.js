/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./javascript/starsounds.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./javascript/lib/canvas.js":
/*!**********************************!*\
  !*** ./javascript/lib/canvas.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
// const innerWidth = window.innerWidth;
// const innerHeight = window.innerHeight;
canvas.width = 1200;
canvas.height = 450;
canvas.dragging = false;

module.exports = canvas;

/***/ }),

/***/ "./javascript/lib/sky.js":
/*!*******************************!*\
  !*** ./javascript/lib/sky.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Star = __webpack_require__(/*! ./stars */ "./javascript/lib/stars.js");
const canvas = __webpack_require__(/*! ./canvas */ "./javascript/lib/canvas.js");
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

/***/ }),

/***/ "./javascript/lib/stars.js":
/*!*********************************!*\
  !*** ./javascript/lib/stars.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

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

/***/ }),

/***/ "./javascript/starsounds.js":
/*!**********************************!*\
  !*** ./javascript/starsounds.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Sky = __webpack_require__(/*! ./lib/sky */ "./javascript/lib/sky.js");

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

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map