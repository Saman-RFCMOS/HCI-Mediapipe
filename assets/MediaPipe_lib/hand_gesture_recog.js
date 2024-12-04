const video = document.getElementById('video');
const message = document.getElementById('message');

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.10.3/dist/mediapipe_web/${file}`;
}});

hands.setOptions({
  maxNumHands: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

hands.onResults(onResults);

function onResults(results) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (results.multiHandLandmarks) {
    for (const handLandmarks of results.multiHandLandmarks) {
      // Draw hand connections
      drawHand(context, handLandmarks);

      // Check for Thumbs Up/Down gestures
      const thumbTip = handLandmarks[4]; // Index of thumb tip landmark
      const wrist = handLandmarks[0]; // Index of wrist landmark

      // Calculate angle between thumb and wrist
      const dx = wrist.x - thumbTip.x;
      const dy = wrist.y - thumbTip.y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      if (angle > 45 && angle < 135) {
        message.textContent = "Thumbs Up!";
        // You can take action here based on thumbs up gesture (e.g., play a sound)
      } else if (angle < -45 && angle > -135) {
        message.textContent = "Thumbs Down!";
        // You can take action here based on thumbs down gesture (e.g., display message)
      } else {
        message.textContent = "";
      }
    }
  }
}

function drawHand(context, handLandmarks) {
  // Draw lines connecting hand landmarks
  const connections = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19, 20],
    [0, 5],
    [0, 17],
    [5, 9],
    [9, 13],
    [13, 17],
  ];
  context.beginPath();
  connections.forEach((connection) => {
    const landmark = handLandmarks[connection[0]];
    context.moveTo(landmark.x, landmark.y);
    connection.slice(1).forEach((index) => {
      const landmark = handLandmarks[index];
      context.lineTo(landmark.x, landmark.y);
    });
  });
  context.lineWidth = 2;
  context.stroke();
}

const camera = new Camera(video);
camera.start();
