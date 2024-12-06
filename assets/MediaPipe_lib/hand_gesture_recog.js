import { FilesetResolver, GestureRecognizer } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs';

async function initializeGestureRecognizer() {
  // Ensure the MediaPipe library is loaded globally
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });
  
  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  function countExtendedFingers(landmarks) {
    const wrist = landmarks[0]; // Wrist landmark
    const fingers = [
      { tip: 4, base: 3, isThumb: true }, // Thumb
      { tip: 8, base: 6, isThumb: false }, // Index finger
      { tip: 12, base: 10, isThumb: false }, // Middle finger
      { tip: 16, base: 14, isThumb: false }, // Ring finger
      { tip: 20, base: 18, isThumb: false }, // Pinky finger
    ];
  
    let extendedCount = 0;
  
    fingers.forEach((finger) => {
      const tip = landmarks[finger.tip];
      const base = landmarks[finger.base];
  
      if (finger.isThumb) {
        // Thumb-specific logic: Check distance from the wrist
        const tipToWristDistance = Math.sqrt(
          Math.pow(tip.x - wrist.x, 2) +
            Math.pow(tip.y - wrist.y, 2) +
            Math.pow(tip.z - wrist.z, 2)
        );
        const baseToWristDistance = Math.sqrt(
          Math.pow(base.x - wrist.x, 2) +
            Math.pow(base.y - wrist.y, 2) +
            Math.pow(base.z - wrist.z, 2)
        );
  
        if (tipToWristDistance > baseToWristDistance + 0.1) {
          extendedCount++;
        }
      } else {
        // Other fingers: Check if the tip is above the base in Y-axis
        if (tip.y < base.y) {
          extendedCount++;
        }
      }
    });
  
    return extendedCount;
  }

  // Handle results from Mediapipe Hands
  hands.onResults((results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      displayElement.innerHTML = ""; // Clear the output container
  
      results.multiHandLandmarks.forEach((landmarks, index) => {
        // Count fingers
        const fingerCount = countExtendedFingers(landmarks);
  
        // Update display
        const handInfo = `Hand ${index + 1}: ${fingerCount} fingers extended`;
        const handElement = document.getElementById("gesture-msg");
        handElement.innerText = handInfo;
      });
    } else {
      // No hands detected
      displayElement.innerText = "No hands detected";
    }
  });
  const videoElement = document.getElementById('video');
  // Initialize the camera
  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480,
  });
  
  camera.start().catch((err) => {
    console.error("Camera initialization error:", err);
    displayElement.innerText = "Error initializing camera.";
  });


  // Create Gesture Recognizer instance with model options
  const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task"
    },
    numHands: 1
  });

  // Initialize video stream (webcam)
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true
  });
  videoElement.srcObject = stream;

  // Wait until the video element is ready
  videoElement.addEventListener('loadeddata', () => {
    console.log('Video stream is ready');
    // Start the render loop
    renderLoop();
  });

  // Set up recognition in video mode
  gestureRecognizer.setOptions({
    runningMode: "video" // Real-time frame processing
  });

  let lastVideoTime = -1;

  // Render loop for real-time gesture recognition
  function renderLoop() {
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA && videoElement.currentTime !== lastVideoTime) {
      try {
        // Process the current video frame with timestamp
        const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(videoElement, videoElement.currentTime * 1000);

        if (gestureRecognitionResult) {
          processResult(gestureRecognitionResult);
        }

        // Update the last processed time
        lastVideoTime = videoElement.currentTime;
      } catch (error) {
        console.error("Error during gesture recognition:", error);
      }
    }

    // Request the next frame
    requestAnimationFrame(renderLoop);
  }
}

// Process the recognition result
function processResult(result) {
  if (result.gestures && result.gestures.length > 0) {
    const gesture = result.gestures[0].categoryName;
    console.log("Detected Gesture:", gesture);

    if (gesture === 'Thumb_Up') {
      // Alert when a "Thumbs Up" gesture is detected
      window.alert("Thumbs Up Detected!");
    }
  }
}

// Start the gesture recognizer when the window loads
window.onload = initializeGestureRecognizer;
