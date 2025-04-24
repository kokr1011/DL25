let classifier;
let img;
let label = "";
let confidence = "";

let img2;
let label2 = "";
let confidence2 = "";

function gotResult(results) {
  console.log(results);
  fill(255);
  stroke(0);
  textSize(18);
  label = "Label: " + results[0].label;
  confidence = "Confidence: " + nf(results[0].confidence, 0, 2);
  text(label, 10, 360);
  text(confidence, 10, 380);
}

function preload() {
  classifier = ml5.imageClassifier("MobileNet");
  img = loadImage("images/bird.jpg");
  img2 = loadImage("images/bike.jpg");
}

function setup() {
  createCanvas(900, 900);
  classifier.classify(img, gotResult);
  image(img, 0, 0, 200, 200);
  classifier.classify(img2, gotResult);
  image(img2, 0, 300, 200, 200);
}

