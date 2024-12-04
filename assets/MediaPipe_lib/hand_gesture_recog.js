async function setupWebcam() {
      const videoElement = document.getElementById('webcam');
      
      // Request the webcam stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      videoElement.srcObject = stream;
      return new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          resolve(videoElement);
        };
      });
    }

    async function setupGestureDetection() {
      // Load MediaPipe Hand Gesture model
      const hands = await new Tasks.HandGestureClassifier({
        baseOptions: {
          modelAssetPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/hand_gesture_model.tflite',
        }
      });

      return hands;
    }

    async function detectGesture(frame, hands) {
      const canvasElement = document.createElement('canvas');
      const canvasCtx = canvasElement.getContext('2d');
      
      // Get video frame from webcam
      canvasElement.width = frame.width;
      canvasElement.height = frame.height;
      canvasCtx.drawImage(frame, 0, 0, frame.width, frame.height);

      const gestures = await hands.classify(canvasElement);

      if (gestures.length > 0) {
        const gesture = gestures[0].categoryName;
        const resultElement = document.getElementById('gestureResult');

        if (gesture === 'Thumbs Up') {
          resultElement.textContent = 'Thumbs Up!';
        } else if (gesture === 'Thumbs Down') {
          resultElement.textContent = 'Thumbs Down!';
        } else {
          resultElement.textContent = 'No gesture detected';
        }
      }
    }

    async function main() {
      const videoElement = await setupWebcam();
      const hands = await setupGestureDetection();

      // Continuously process webcam frames for gesture recognition
      const processFrame = () => {
        detectGesture(videoElement, hands);
        requestAnimationFrame(processFrame);
      };

      processFrame();
    }

    // Start the main program
    main();
