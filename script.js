let classifier;

window.onload = () => {
  classifier = ml5.imageClassifier('MobileNet', () => {
    console.log("Model geladen");
    classifyExamples();
  });
};

function classifyExamples() {
  ['correct1', 'correct2', 'correct3'].forEach((id, idx) => {
    classifySingle(id, 'correctChart' + (idx + 1));
  });
  ['wrong1', 'wrong2', 'wrong3'].forEach((id, idx) => {
    classifySingle(id, 'wrongChart' + (idx + 1));
  });
}

function classifySingle(imageId, canvasId) {
  const img = document.getElementById(imageId);
  classifier.classify(img, (err, results) => {
    if (err) return console.error(err);
    const labels = results.map(r => r.label);
    const data = results.map(r => (r.confidence * 100).toFixed(2));
    drawChart(canvasId, labels, data);
  });
}

function drawChart(chartId, labels, data) {
  new Chart(document.getElementById(chartId), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Confidence (%)',
        data: data,
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

function classifyUserImage() {
  const img = document.getElementById('userImage');
  classifier.classify(img, (err, results) => {
    if (err) return console.error(err);
    const labels = results.map(r => r.label);
    const data = results.map(r => (r.confidence * 100).toFixed(2));
    drawChart('userChart', labels, data);
    document.getElementById("discussionText").innerText =
      `Das Bild wurde als "${results[0].label}" erkannt mit einer Confidence von ${data[0]}%.`;
  });
}

document.getElementById('upload').addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById('userImage').src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});
