async function setupWebcam() {
  const videoElement = document.getElementById('webcam');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        resolve(videoElement);
      };
    });
  } catch (err) {
    console.error("Error accessing webcam:", err);
    alert("Please allow access to the webcam.");
  }
}

async function setupHandpose() {
  const handpose = await handpose.load();
  return handpose;
}

async function detectGesture(videoElement, model) {
  const predictions = await model.estimateHands(videoElement);

  const resultElement = document.getElementById('gestureResult');
  
  if (predictions.length > 0) {
    // Access keypoints to detect thumb gestures
    const thumbTip = predictions[0].landmarks[4];  // Thumb tip
    const indexTip = predictions[0].landmarks[8];  // Index tip

    // Draw hand landmarks
    const ctx = videoElement.getContext('2d');
    ctx.clearRect(0, 0, videoElement.width, videoElement.height);

    predictions.forEach(prediction => {
      for (let i = 0; i < prediction.landmarks.length; i++) {
        const [x, y, z] = prediction.landmarks[i];
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }
    });

    // "Thumbs up" gesture
    const isThumbUp = thumbTip[1] < indexTip[1]; // Thumb higher than index -> thumbs up

    if (isThumbUp) {
      resultElement.textContent = 'Thumbs Up!';
    } else {
      resultElement.textContent = 'No Thumbs Up Detected!';
    }
  } else {
    resultElement.textContent = 'No hands detected.';
  }
}

async function main() {
  const videoElement = await setupWebcam();
  const handpose = await setupHandpose();
  
  // Set the canvas to the same size as the video
  videoElement.width = 640;
  videoElement.height = 480;
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.width;
  canvas.height = videoElement.height;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  // Overlay the video and canvas on top of each other
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;

  const processFrame = () => {
    detectGesture(videoElement, handpose);
    requestAnimationFrame(processFrame);
  };

  processFrame();
}

// Run the main function
main();
