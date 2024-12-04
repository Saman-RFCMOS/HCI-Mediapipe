const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');

// Gesture Definitions (replace with your specific gestures)
const WAVE_GESTURE = { name: 'wave', keypoints: [8, 9, 10] }; // Example gesture using wrist, index finger tip, and middle finger tip keypoints
const FIST_GESTURE = { name: 'fist', keypoints: [0, 1, 2, 3, 4] }; // Example gesture using all finger base keypoints

// Define your actions for each gesture (replace with your desired actions)
const actions = {
  wave: () => console.log('User waved!'),
  fist: () => console.log('User made a fist!'),
};

// Initialize Gesture Recognizer
const gestureRecognizer = new GestureRecognizer({
  baseOptions: {
    modelAssetPath: `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/models/hand_landmark_lite.tflite`,
    maxHands: 1, // Only track one hand
    selfieMode: true, // Adjust for webcam orientation
    // Add other options for gesture recognition configuration
  },
  runtimeOptions: {
    // Add runtime options for performance optimization
  },
});

// Access the camera and start the video stream
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    videoElement.srcObject = stream;
  })
  .catch(error => {
    console.error('Error accessing camera:', error);
  });

// Continuously process video frames
videoElement.addEventListener('play', () => {
  const processVideoFrame = async () => {
    const videoFrame = await gestureRecognizer.process(videoElement);

    // Draw the video frame to the canvas (optional)
    canvasCtx.drawImage(videoFrame.image, 0, 0, canvasElement.width, canvasElement.height);

    if (videoFrame.detections.length > 0) {
      const handLandmarks = videoFrame.detections[0].landmarkList;

      // Check for gestures (replace with your logic)
      const detectedGesture = checkForGesture(handLandmarks);
      if (detectedGesture) {
        actions[detectedGesture.name](); // Perform action for the detected gesture
      }
    }

    // Request the next frame
    requestAnimationFrame(processVideoFrame);
  };

  processVideoFrame();
});

// Function to check for gestures based on keypoints 
function checkForGesture(handLandmarks) {
  // Implement your logic to check for specific gestures using keypoint positions and distances
  // You can use DrawingUtils.drawConnectors(canvasCtx, handLandmarks, hand_connections) to visualize keypoints for reference
  // Return the detected gesture object (name and keypoints) if a match is found, otherwise return null

  // Example logic (replace with your desired gestures):
  let detectedGesture = null;
  const wrist = handLandmarks[0];
  const indexTip = handLandmarks[8];
  const middleTip = handLandmarks[10];

  // Check for wave gesture
  if (Math.abs(wrist.y - indexTip.y) > 50 && Math.abs(wrist.y - middleTip.y) > 50) {
    detectedGesture = WAVE_GESTURE;
  }

  // Check for fist gesture
  const allFingerBasesClosed = handLandmarks.slice(0, 5).every(point => point.y > wrist.y);
  if (allFingerBasesClosed) {
    detectedGesture = FIST_GESTURE;
  }

  return detectedGesture;
}
