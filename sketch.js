var factor = newFactor = lastFactor = 0, spin = newSpin = lastSpin = 0, xo = .0,
  yo = .0,
  r = lastr = .0,
  rr = .0,
  minDiam, newDiam, initDiam,
  splitr = 360;
//TODO
var drawLines = true;
var opq = 7;
var sinRad60;

var _red, _ylw;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  background(0);

  //strokeWeight(.5);
  //stroke(255,63,0,opq);


  sinRad60 = sin(radians(60));

  //////
  randomize(true);
  factor = newFactor;
  spin = newSpin;
  randomize(true);

  minDiam = newDiam = 50;
  initDiam = 250;
}

function randomize(update) {
  /*drawLines = random(0,1) > .33;
  if(drawLines) opq = 2;
  else          opq = 31;
  */

  if (update) {
    //new seed
    
    var _factor = random(0, 1) < .5 ? random(-.25, -.1) : random(.1, .55); //.141258;
    var _spin = random(0, 1) < .5 ? random(-.5, -.01) : random(.01, .5); //-.52421;
    //var _minDiam = floor(random(5, 25));

    newFactor = _factor;
    newSpin = _spin;
    //newDiam = _minDiam;

    lastr = frameCount;
    lastFactor = factor;
    lastSpin = spin;

  if (getFrameRate() < 24) //use ma?
    minDiam++;
  else if(getFrameRate() > 33 && minDiam  > 5)
    minDiam--;

    println(`NEWFACTOR:${newFactor}`);
    println(`NWESPIN:${newSpin}`);
  } else {
    var split = (frameCount%splitr) / splitr;
    var lf = lastFactor * (1-split);
    var nf = newFactor * split;
    //println(`lf: ${lf}, nf: ${nf}`);
    factor = lf + nf;//lastFactor * (1-split) + newFactor * split;
    spin = lastSpin * (1-split) + newSpin * split;

    //minDiam = minDiam * (1-split) + newDiam * split;
  //println(`split:${(split)} : ${frameCount%splitr}`);
  }  

  //println(`factor:${factor}`);
  //println(`spin:${spin}`);
  //println(minDiam);
  //println(opq);
}

function resize() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  r = rr = xo = yo = 0;
  randomize();
}

function update() {
  r = r + spin;
  rr = (radians(r));
  xo = yo = (sin(rr));
  randomize(frameCount % splitr === lastr % splitr);
}

function draw() {
  //println(frameCount);
  if (frameCount % 60 == 0) background(22, 0, 0, opq);
  if (random(1) > .5) background(22, 0, 0, max(2, floor(opq / 3)));
  if (width != windowWidth || height != windowHeight)
    resize();
  //println(getFrameRate());

  var cx = width / 2;
  var cy = height / 2;
  var diam = min(cx, cy);

  //background(0);

  push();
  translate(cx, cy);
  ////////////////////////
  var bkopq = 1/255;
  var depth = 22;
  background(0, 0, 0, 255 * bkopq);
  //drawStrand(depth, cx / diam, 0, cy / depth, abs(rr));

  /////////////////
  drawTri(0, 0, diam, rr);

  pop();


  /////////////
  update();

  //noLoop();
}

function mouseClicked() {
  println("clickd");
  loop();
}

function drawStrand(depth, cx, cy, diam, angle) {
  if (depth < 1) return;
  var drat = 1 - min(1,pow(diam, 1 / depth));
  //println("depth: " + depth + ", drat: " + drat);
  stroke(255 - 255 * drat, 255 - 255 * drat, 255, 255 * drat);
  //line(0, 0, cx, cy);
  point(0,0);
  push();
  translate(cx, cy);
  rotate((angle));

  drawStrand(depth - 1, sin(angle - noise(rr / r)) * diam, cy + diam, diam / 2, (angle + r) * factor - ((noise(r / rr))));

  pop();
}

function drawTri(cx, cy, diam, angle) {
  var d2, h, h3, r2, w2, xf, yf;

  d2 = diam / 2.0;
  w2 = diam + d2;
  r2 = w2 / 2.0;
  h = sinRad60 * diam;
  h3 = h / 3.0;

  var nn = noise(r/rr);

  xf = cx * factor - nn;
  yf = cy * factor - nn;

  //color t = _red * abs(rr) + _ylw * (1-abs(rr));
  //stroke(t)
  //stroke(_red);
  if (diam < min(width / 4, height / 4)) {
    //println(r);
    stroke(255, 63 + 192 * min(1, abs(1 - minDiam / diam)), 0, opq);
    if (drawLines)
      line(0, 0, xf, yf);
    else
      point(0, 0);

  }


  push();
  translate(xf, yf);
  rotate(angle);

  if (diam > minDiam) {
    var rf = (angle + r) * factor - nn;
    var xx = (cx * (1 - factor) + xo * xf);
    var yy = (cy * (1 - factor) + yo * yf);
    drawTri(xx - d2, yy + h3, d2, rf);
    drawTri(xx, yy + h3 - h, d2, rf);
    drawTri(xx + d2, yy + h3, d2, rf);
  }

  pop();

}