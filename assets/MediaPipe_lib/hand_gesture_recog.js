import { FilesetResolver, GestureRecognizer } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs';

async function initializeGestureRecognizer() {
  // Load MediaPipe vision task fileset
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  // Initialize the GestureRecognizer with options
  const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task"
    },
    numHands: 1
  });

  // Access webcam stream
  const videoElement = document.getElementById('video');
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true
  });
  videoElement.srcObject = stream;

  // Setup video stream and gesture recognition options
  gestureRecognizer.setOptions({
    runningMode: "video"
  });

  let lastVideoTime = -1;

  // Start frame processing loop
  function renderLoop() {
    const video = document.getElementById("video");

    // Ensure the video has enough data and process if current time is updated
    if (video.readyState === video.HAVE_ENOUGH_DATA && video.currentTime !== lastVideoTime) {
      const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(video);

      if (gestureRecognitionResult && gestureRecognitionResult.gestures && gestureRecognitionResult.gestures.length > 0) {
        processResult(gestureRecognitionResult);
      }

      lastVideoTime = video.currentTime;
    }

    // Continue requesting next frame
    requestAnimationFrame(renderLoop);
  }

  renderLoop(); // Start the loop
}

window.onload = initializeGestureRecognizer;

function processResult(result) {
  // Check if gestures are detected
  if (result.gestures && result.gestures.length > 0) {
    const gesture = result.gestures[0].categoryName;
    const gestureMsgElement = document.getElementById('gesture-msg');
    
    // Handle specific gestures
    if (gesture === 'Thumb_Up') {
      gestureMsgElement.style.display = 'block'; // Show message
      gestureMsgElement.innerText = 'Thumbs Up Detected!';
    } else {
      gestureMsgElement.style.display = 'block'; // Show message
      gestureMsgElement.innerText = 'Not Detect';
    }
  }
}
