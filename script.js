let classifier;
window.onload = () => {
  classifier = ml5.imageClassifier('MobileNet', () => console.log("Model geladen"));
  loadExamples();
};

function loadExamples() {
  const correct = ['correct1.jpg', 'correct2.jpg', 'correct3.jpg'];
  const wrong = ['wrong1.jpg', 'wrong2.jpg', 'wrong3.jpg'];

  classifyGroup(correct, 'correctImages', 'correctChart');
  classifyGroup(wrong, 'wrongImages', 'wrongChart');
}

function classifyGroup(imageList, containerId, chartId) {
  const container = document.getElementById(containerId);
  const labels = [];
  const confidences = [];

  imageList.forEach((imgName, i) => {
    const img = new Image();
    img.src = 'images/' + imgName;
    img.onload = () => {
      container.appendChild(img);
      classifier.classify(img, (err, results) => {
        if (err) return console.error(err);
        labels.push(results[0].label);
        confidences.push((results[0].confidence * 100).toFixed(2));
        if (labels.length === imageList.length) {
          drawChart(chartId, labels, confidences);
        }
      });
    };
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
        backgroundColor: 'rgba(100, 149, 237, 0.6)'
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
    document.getElementById("discussionText").innerText = `Das Bild wurde als "${results[0].label}" erkannt mit einer Confidence von ${data[0]}%.`;
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
