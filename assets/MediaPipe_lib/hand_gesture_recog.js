const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Define 1  custom hand landmarks for thumbs up and down detection
const THUMBS_UP_LANDMARKS = [
  { index: 4, name: 'thumbTip' },  // Tip of the thumb
  { index: 8, name: 'wrist' },     // Wrist
];

const THUMBS_DOWN_LANDMARKS = [
  { index: 4, name: 'thumbTip' },
  { index: 2, name: 'indexTip' },  // Tip of the index finger
];

const hands = new Hands({ video: video });
hands.onResults(onHandsDetected);

function onHandsDetected(results) {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  const hands = results.multiHandLandmarks;
  if (hands) {
    for (const hand of hands) {
      const thumbTip = hand.landmarks[THUMBS_UP_LANDMARKS[0].index];
      const wrist = hand.landmarks[THUMBS_UP_LANDMARKS[1].index];

      // Check for thumbs up gesture
      const isThumbsUp = thumbTip.y < wrist.y;
      if (isThumbsUp) {
        console.log("Thumbs Up detected!");
        // Add visual feedback here, e.g.,
        ctx.fillStyle = 'green';
        ctx.fillText('Thumbs Up!', 10, 30);
        closeFunction();  // Replace with your desired function call
      }

      const indexTip = hand.landmarks[THUMBS_DOWN_LANDMARKS[1].index];
      // Check for thumbs down gesture
      const isThumbsDown = thumbTip.y > indexTip.y && thumbTip.x < indexTip.x;
      if (isThumbsDown) {
        console.log("Thumbs Down detected!");
        // Add visual feedback here, e.g.,
        ctx.fillStyle = 'red';
        ctx.fillText('Thumbs Down!', 10, 30);
        // Add your function call for thumbs down here
      }
    }
  }
}

// Replace this with your actual close function implementation
function closeFunction() {
  console.log("Closing something...");
  // Your function logic here
}

// Start the video capture
video.play();
