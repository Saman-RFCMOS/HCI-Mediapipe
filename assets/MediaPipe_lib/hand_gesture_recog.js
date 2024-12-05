import { FilesetResolver, GestureRecognizer } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs';

async function initializeGestureRecognizer() {
  // Ensure the MediaPipe library is loaded globally
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  // Create Gesture Recognizer instance with model options
  const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task"
    },
    numHands: 1
  });

  // Initialize video stream (webcam)
  const videoElement = document.getElementById('video');
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true
  });
  videoElement.srcObject = stream;

  // Set up recognition in video mode (ensure frames are processed in sync with the video)
  gestureRecognizer.setOptions({
    runningMode: "video"  // Continue with "video" mode for real-time frame processing
  });

  let lastVideoTime = -1;

  // Start the render loop
  function renderLoop() {
    const video = document.getElementById("video");

    // Ensure the video has enough data and its time has changed to avoid duplicate frames
    if (video.readyState === video.HAVE_ENOUGH_DATA && video.currentTime !== lastVideoTime) {
      // Process video frame for gesture recognition
      const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(video);

      // Process recognition result if available
      if (gestureRecognitionResult) {
        processResult(gestureRecognitionResult);
      }

      // Update the last processed time to avoid reprocessing the same frame
      lastVideoTime = video.currentTime;
    }

    // Request the next frame for animation
    requestAnimationFrame(renderLoop);
  }

  // Start the render loop to continuously process frames
  renderLoop();
}

// Start the process when the window loads
window.onload = initializeGestureRecognizer;

function processResult(result) {
  // Ensure we have gesture data and process it
  if (result.gestures && result.gestures.length > 0) {
    const gesture = result.gestures[0].categoryName;
    if (gesture === 'Thumb_Up') {
      // Alert when a "Thumbs Up" gesture is detected
      window.alert("Thumbs Up Detected!");
    }
  }
}
