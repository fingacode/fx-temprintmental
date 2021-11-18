// these are the variables you can use as inputs to your algorithms
console.log(fxhash)   // the 64 chars hex number fed to your algorithm
// console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//
// window.$fxhashFeatures = {
//   "Background": "Black",
//   "Number of lines": 10,
//   "Inverted": true
// }

// this code writes the values to the DOM as an example
// const container = document.createElement("div")
// container.innerText = `
//   random hash: ${fxhash}\n
//   some pseudo random values: [ ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()},... ]\n
// `
// document.body.prepend(container)

// init canvas
var canvas = document.createElement('canvas');

function init() {
  canvas.width = 800//window.innerHeight;
  canvas.height = 900//window.innerHeight;
  document.body.appendChild(canvas);
}

function splitString(str) {
  var arr = [];
  for (var i = 0; i < str.length; i++) {
    arr.push(str[i]);
  }
  return arr;
}

// Add up all the numbers in the hash
function hashNumber(hash) {
  return {
    sum: hash.match(/\d+/g).reduce(
          (x, y) => parseInt(x) + parseInt(y),
          0
        ),
    values: hash.match(/\d+/g)
  }
}

/* function to creates a colour given number input */
function createColor(number) {
  var color = '#';
  var hex = number.toString(16);
  for (var i = 0; i < 5 - hex.length; i++) {
    color += 'ff';
  }
  color += hex;
  return color;
}

function isOdd(number) {
  return number % 2 === 1;
}

// write a function to wrap text within a box in canvas
function wrapText(ctx, text, x, y, maxWidth, lineHeight, hashNumSum = 0) {
  var words = text.split(' ');
  var line = '';
  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = ctx.measureText(testLine);
    var boxWidth = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);

    ctx.fillStyle = `${createColor( n*hashNumSum*words.length)}`;

    if ( boxWidth > maxWidth && n > 0 ) {

      if(isOdd(hashNumSum)) {

        ctx.fillText(line, x, y);

      } else {

        ctx.strokeStyle = `${createColor((n*hashNumSum*words.length))}`;
        ctx.strokeText(line, x, y);

      }

      line = words[n] + ' ';
      y += lineHeight;

    } else {

      line = testLine;

    }

  }

  ctx.fillText(line, x, y);

}

// this functions writes text to the canvas & measures its height.
// this value is then used to center the block of text vertically
function getLineCount(ctx, text, maxWidth, lineHeight, hashNumSum = 0) {
  var words = text.split(' ');
  var line = '';
  var lines = 1;
  var y = 0;
  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = ctx.measureText(testLine);
    var boxWidth = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
    if ( boxWidth > maxWidth && n > 0 ) {
      if(isOdd(hashNumSum)) {

        ctx.fillText(line, 0, y);

      } else {

        ctx.strokeStyle = `${createColor((n*hashNumSum*words.length))}`;
        ctx.stroke
        ctx.strokeText(line, 0, y);

      }
      line = words[n] + ' ';
      y += lineHeight;
      lines += 1;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 0, y);
  return lines;
}

var fullHash = splitString(fxhash)
                .toString()
                .replace(/,/g, ' ')
                .toUpperCase();
console.log('fullHash ', fullHash);

var hashText = splitString(fxhash)
                .toString()
                .replace(/\d+,/g, '')
                .replace(/,/g,' ')
                .toUpperCase();
console.log('hashText ', hashText);

var hashNumbers = hashNumber(fullHash).values;
console.log('hashNumbers ', hashNumbers);

var hashNumSum = hashNumber(fullHash).sum;
console.log('hashNumSum ', hashNumSum);

// draw
function draw() {
  var ctx = canvas.getContext('2d');

  var lineH = (canvas.height*4)/hashNumSum;
  var fontSize = lineH;

  console.log('fontSize', fontSize);

  ctx.font = fontSize+"px Impact, sans-serif";
  ctx.textAlign = "center";

  // set box width & height
  var boxW = canvas.width - 200;
  var lineCount = getLineCount(ctx, fullHash, boxW, lineH);
  var boxH = lineCount * lineH;

  console.log('boxH ',boxH)

  // get exact center
  var centerX = (canvas.width / 2);
  var centerY = (canvas.height / 2) - (boxH / 2);

  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if(isOdd(lineCount * lineH)) {

    wrapText(ctx, fullHash, centerX, centerY, boxW, lineH, hashNumSum);

  } else {
    
    hashNumbers.forEach((element,i) => {

      var newCenterY = (lineH * element);
      wrapText(ctx, fullHash, centerX, newCenterY, boxW, lineH, hashNumSum);

    });

  }

}

// On page resize
window.onresize = function() {
  init();
  draw();
}

// START
init();
draw();