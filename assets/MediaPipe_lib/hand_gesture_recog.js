const video = document.getElementById('video');
const gestureMsg = document.getElementById('gesture-msg');

// Define landmark positions for thumbs-up gesture
const thumbIndex = 4;
const indexTipX = 'landmarkX'; // Replace with actual landmark property name (e.g., 'wristX')
const indexTipY = 'landmarkY'; // Replace with actual landmark property name (e.g., 'wristY')
const thumbTipX = 'landmarkX'; // Replace with actual landmark property name (e.g., 'thumbTipX')
const thumbTipY = 'landmarkY'; // Replace with actual landmark property name (e.g., 'thumbTipY')

// Load MediaPipe Hands solution
const hands = new Hands({locateFace: false});
hands.onResults(onHandsResults);

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    return hands.process(video);
  })
  .catch(err => {
    console.error('Error accessing camera:', err);
  });

function onHandsResults(results) {
  gestureMsg.style.display = 'none';
  if (results.multiHandLandmarks) {
    for (const handLandmarks of results.multiHandLandmarks) {
      // Check if hand is open and thumb is up
      if (isHandOpen(handLandmarks) && isThumbUp(handLandmarks)) {
        gestureMsg.textContent = 'Thumbs Up!';
        gestureMsg.style.display = 'block';
        break;
      }
    }
  }
}

function isHandOpen(handLandmarks) {
  // Check if all fingers except thumb are closed (modify logic based on your landmark data)
  for (let i = 5; i < 21; i++) { // Assuming fingers start at index 5 (modify based on your data)
    const fingerTipX = handLandmarks[i][indexTipX];
    const fingerTipY = handLandmarks[i][indexTipY];
    // Check if finger tip is close to palm (modify logic based on your data)
    if (/* condition for finger tip close to palm */) {
      return false;
    }
  }
  return true;
}

function isThumbUp(handLandmarks) {
  const thumbTipX = handLandmarks[thumbIndex][thumbTipX];
  const thumbTipY = handLandmarks[thumbIndex][thumbTipY];
  const indexTipX = handLandmarks[indexIndex][indexTipX]; // Assuming index finger is at index 8 (modify based on your data)
  const indexTipY = handLandmarks[indexIndex][indexTipY]; // Assuming index finger is at index 8 (modify based on your data)
  // Check if thumb tip is above index tip and to the right (modify logic for left hand)
  return thumbTipY < indexTipY && thumbTipX > indexTipX;
}
