let img;
let mic;
let snowballs = [];
let soundDetected = false; 
let positionX = 290;
let positionY = 60;
let radius = 50;
let currentAngle = 0;
let lines = []; // Store past lines

// Load the background with 'snowman.jpeg' and create the canvas with the size same as image's. 
function setup() {
  img = loadImage("snowman.jpeg");
  img.resize(350, 500);
  createCanvas(img.width, img.height);
  
  mic = new p5.AudioIn();
  mic.start();
  
  // Set up the angle mode - Degree(Radians default)
  angleMode(DEGREES);
}


function draw() {

  background(img);
  let micLevel = mic.getLevel();
  // Set the threshold of miclevel
  let threshold = 0.05;

  // Generate a snowball when sound is detected and over the threshold
  if (micLevel > threshold && !soundDetected) {
    let radius = map(micLevel, 0, 1, 50, 200);
    let newSnowball = {
      x: random(width - 100),
      y: 0,
      speed: random(1, 3),
      radius: radius,
    };
    snowballs.push(newSnowball);
    soundDetected = true; // Update sound detecting situations
  }

  // Reset sound detection when the mic level is low
  if (micLevel < threshold) {
    soundDetected = false;
  }

  // Draw all snowballs and let them fall down by update the position on y-axis
  for (let i = 0; i < snowballs.length; i++) {
    let s = snowballs[i];
    fill(255);
    stroke(204, 255, 255);
    ellipse(s.x, s.y, s.radius, s.radius);
    s.y += s.speed;
    if (s.y > height) s.y = height;
  }

  // Draw radial graph:
  // Prompt:https://nishanc.medium.com/audio-visualization-in-javascript-with-p5-js-cf3bc7f1be07
  let lineLength = micLevel * 100; 

  let xStart = positionX + radius * cos(currentAngle);
  let yStart = positionY + radius * sin(currentAngle);
  let xEnd = positionX + (radius + lineLength) * cos(currentAngle);
  let yEnd = positionY + (radius + lineLength) * sin(currentAngle);

  // Store line data to lines - arrays
  lines.push({ xStart, yStart, xEnd, yEnd });

  // Keep only the last 360 lines
  if (lines.length > 360) {
    lines.shift(); // Remove oldest line
  }

  // Draw all stored radial lines
  stroke(255,128,0);
  for (let l of lines) {
    line(l.xStart, l.yStart, l.xEnd, l.yEnd);
  }

  // Update and move to the next angle.
  // If the angle goes over 360 degree, then start from the begining.
  currentAngle += 5;
  if (currentAngle >= 360) {
    currentAngle = 0;
  }
}
