const webcamElement = document.getElementById('webcam');
    const gestureMsg = document.getElementById('gesture-msg');

    // Setup webcam access
    async function setupWebcam() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      webcamElement.srcObject = stream;
    }

    // Initialize MediaPipe Hands
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1630862022/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    // Start the webcam and detect gestures
    async function start() {
      await setupWebcam();

      const camera = new Camera(webcamElement, {
        onFrame: async () => {
          await hands.send({ image: webcamElement });
        },
        width: 640,
        height: 480
      });
      camera.start();
    }

    // Handle the results from MediaPipe Hands
    function onResults(results) {
      if (!results.multiHandLandmarks) {
        return;
      }

      // Detect the thumbs-up gesture
      results.multiHandLandmarks.forEach((handLandmarks) => {
        const thumbUpDetected = isThumbUp(handLandmarks);
        if (thumbUpDetected) {
          gestureMsg.style.display = 'block';
        } else {
          gestureMsg.style.display = 'none';
        }
      });
    }

    // Check if the gesture is a thumbs-up
    function isThumbUp(landmarks) {
      const thumbTip = landmarks[4]; // Tip of the thumb (landmark index 4)
      const thumbBase = landmarks[2]; // Base of the thumb (landmark index 2)
      const indexTip = landmarks[8]; // Tip of the index finger (landmark index 8)

      // Simple check: if the thumb is extended upwards and the index is pointing down
      return thumbTip.y < thumbBase.y && indexTip.y > thumbBase.y;
    }

    // Start the process
    start();
