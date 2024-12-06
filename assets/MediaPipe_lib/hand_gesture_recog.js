const video = document.getElementById('video');
const gestureMsg = document.getElementById('gesture-msg');

// Replace with actual model path based on your setup
const gestureRecognizerModelPath = 'https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task';

async function setupGestureRecognizer() {
  // Load MediaPipe Hands solution
  const hands = new Hands({locateFace: false});

  // Create Gesture Recognizer task
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: gestureRecognizerModelPath,
    },
    numHands: 2, // Maximum number of hands to detect
  });

  // Process video frames
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      hands.onResults(onHandsResults);
      return hands.process(video);
    })
    .catch(err => {
      console.error('Error accessing camera:', err);
    });

  function onHandsResults(results) {
    gestureMsg.textContent = ''; // Clear previous message
    if (results.multiHandLandmarks) {
      for (const handLandmarks of results.multiHandLandmarks) {
        const gestures = results.multiHandLandmarks[0].gestures; // Assuming first hand
        if (gestures) {
          const highestScoreGesture = gestures.reduce((best, current) => 
            current.score > best.score ? current : best);
          gestureMsg.textContent = `Gesture: ${highestScoreGesture.categoryName}`;
        }
      }
    }
  }
}

setupGestureRecognizer();
