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
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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
  for (var i = 0; i < 6 - hex.length; i++) {
    color += '0';
  }
  color += hex;
  console.log(color)
  return color;
}

// write a function to wrap text within a box in canvas
function wrapText(ctx, text, x, y, maxWidth, lineHeight, hashNumSum = 0) {
  var words = text.split(' ');
  var line = '';
  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = ctx.measureText(testLine);
    var boxWidth = metrics.width;

    // console.log(createColor(n))

    ctx.fillStyle = `${createColor((n*hashNumSum))}`;

    if ( boxWidth > maxWidth && n > 0 ) {
      ctx.fillText(line, x, y);
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
function getLineCount(ctx, text, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';
  var lines = 0;
  var y = 0;
  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = ctx.measureText(testLine);
    var boxWidth = metrics.width;
    if ( boxWidth > maxWidth && n > 0 ) {
      ctx.fillText(line, 0, y);
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
                .replace(/,/g, ' ');
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

  var lineH = (canvas.height*1.2)/hashNumSum;
  var fontSize = lineH;

  ctx.font = fontSize+"px Impact";
  ctx.textAlign = "center";

  // set box width & height
  var boxW = canvas.width / 3;
  var lineCount = getLineCount(ctx, hashText, boxW, lineH);
  var boxH = lineCount * lineH;

  // get exact center
  var centerX = (canvas.width / 2) ;
  var centerY = (canvas.height / 2) - (boxH / 2);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  wrapText(ctx, hashText, centerX, centerY, boxW, lineH, hashNumSum);
}

// On page resize
window.onresize = function() {
  init();
  draw();
}

// START
init();
draw();