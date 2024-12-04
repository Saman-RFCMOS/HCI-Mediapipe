const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let camera_utils = new CameraUtils.CameraOutput(video);

const hands = new Hands({locateHandLandmarks: true});
const gestureRecognizer = new GestureRecognizer({maxNumHands: 1});

camera_utils.on('camera_frame', async (frame) => {
  // Convert video frame to webgl texture
  const image = cvMatFromMediaPipeImage(frame.getImage());

  // Perform hand detection
  const results = await hands.send({image});

  // Check if hand is detected
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const handLandmarks = results.multiHandLandmarks[0];

    // Call gesture recognition with hand landmarks
    const gestures = await gestureRecognizer.send({landmarks: handLandmarks});

    // Check for thumbs up and thumbs down gestures
    if (gestures.multiHandGestures) {
      const firstGesture = gestures.multiHandGestures[0];
      if (firstGesture.recognizedGestures[0].label === 'thumb_up') {
        console.log("Thumbs Up detected!");
        // Take action for thumbs up (e.g., display message, play sound)
      } else if (firstGesture.recognizedGestures[0].label === 'thumb_down') {
        console.log("Thumbs Down detected!");
        // Take action for thumbs down (e.g., display message, play sound)
      }
    }

    // Draw hand landmarks on canvas
    ctx.drawImage(frame.getImage(), 0, 0);
    hands.renderResults(canvas, results);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

// Helper function to convert MediaPipe image to OpenCV Mat
function cvMatFromMediaPipeImage(image) {
  const width = image.width;
  const height = image.height;
  const channels = image.depth === MediaPipe.ImageFormat.DEPTH_UNSIGNED_8 ? 4 : 1;
  const cvMat = new cv.Mat(height, width, cv.CV_8UC4);
  const data = new Uint8Array(image.data.buffer);
  cvMat.data.set(data);
  return cvMat;
}
