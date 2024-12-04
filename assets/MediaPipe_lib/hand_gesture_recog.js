// Function to set up the webcam and get the video stream
    async function setupWebcam() {
      const videoElement = document.getElementById('webcam');
      
      try {
        // Request the webcam stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });

        // Attach the webcam stream to the video element
        videoElement.srcObject = stream;

        return new Promise((resolve) => {
          // Resolve the promise once the video metadata is loaded
          videoElement.onloadedmetadata = () => {
            resolve(videoElement);
          };
        });
      } catch (err) {
        console.error("Error accessing webcam:", err);
        alert("Please allow access to the webcam.");
      }
    }

    // Load MediaPipe Gesture Model
    async function setupGestureDetection() {
      // Now using correct import for HandGestureClassifier
      const hands = await HandGestureClassifier.createFromModelPath(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/hand_gesture_model.tflite'
      );

      return hands;
    }

    // Function to detect gestures from the video stream
    async function detectGesture(frame, hands) {
      const canvasElement = document.createElement('canvas');
      const canvasCtx = canvasElement.getContext('2d');
      
      // Draw the video frame to the canvas
      canvasElement.width = frame.width;
      canvasElement.height = frame.height;
      canvasCtx.drawImage(frame, 0, 0, frame.width, frame.height);

      try {
        const gestures = await hands.classify(canvasElement);

        console.log('Detected Gestures:', gestures);  // Log gestures to the console

        if (gestures.length > 0) {
          const gesture = gestures[0].categoryName;  // Get gesture category name
          const resultElement = document.getElementById('gestureResult');

          if (gesture === 'Thumbs Up') {
            resultElement.textContent = 'Thumbs Up!';
          } else if (gesture === 'Thumbs Down') {
            resultElement.textContent = 'Thumbs Down!';
          } else {
            resultElement.textContent = 'No gesture detected: ' + gesture;
          }
        }
      } catch (error) {
        console.error("Error detecting gestures:", error);
      }
    }

    // Main function to run the webcam and gesture detection
    async function main() {
      const videoElement = await setupWebcam();
      const hands = await setupGestureDetection();

      // Continuously process the webcam frames for gesture recognition
      const processFrame = () => {
        detectGesture(videoElement, hands);
        requestAnimationFrame(processFrame);
      };

      processFrame();
    }

    // Start the main program
    main();
