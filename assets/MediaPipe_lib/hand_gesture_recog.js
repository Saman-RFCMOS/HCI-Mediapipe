import { FilesetResolver, GestureRecognizer } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs';

async function initializeGestureRecognizer() {
  // Ensure the MediaPipe library is loaded globally
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  // Create Gesture Recognizer instance with model options
  const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task"
    },
    numHands: 1
  });

  // Initialize video stream (webcam)
  const videoElement = document.getElementById('video');
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true
  });
  videoElement.srcObject = stream;

  // Set up recognition in image mode (sync with video frames)
  gestureRecognizer.setOptions({
    runningMode: "video" // Change to "image" instead of "video" for better synchronization
  });

  let lastVideoTime = -1;
  function renderLoop() {
    const video = document.getElementById("video");

    // Check if the video is ready and its current time has changed
    if (video.readyState === video.HAVE_ENOUGH_DATA && video.currentTime !== lastVideoTime) {
      // Process video frame for gesture recognition
      const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(video);
      
      if (gestureRecognitionResult) {
        processResult(gestureRecognitionResult);
      }

      lastVideoTime = video.currentTime;
    }

    // Request the next frame for animation
    requestAnimationFrame(renderLoop);
  }

  // Start the render loop
  renderLoop();
}

// Start the process when the window loads
window.onload = initializeGestureRecognizer;

function processResult(result) {
  if (result.gestures && result.gestures.length > 0) {
    const gesture = result.gestures[0].categoryName;
    if (gesture === 'Thumb_Up') {
      window.alert("Thumbs Up Detected!");
    }
  }
}
