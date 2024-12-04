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
          videoElement.onloadedmetadata = () => {
            resolve(videoElement);
          };
        });
      } catch (err) {
        console.error("Error accessing webcam:", err);
        alert("Please allow access to the webcam.");
      }
    }

    async function setupHandpose() {
      // Load the handpose model from Mediapipe
      const handpose = await handpose.load();

      return handpose;
    }

    async function detectGesture(videoElement, model) {
      const predictions = await model.estimateHands(videoElement);

      const resultElement = document.getElementById('gestureResult');

      if (predictions.length > 0) {
        // Accessing keypoints to detect thumb gestures
        const thumbTip = predictions[0].landmarks[4]; // Thumb tip (index 4)
        const indexTip = predictions[0].landmarks[8]; // Index finger tip (index 8)

        // Example logic to check for a "thumbs up" gesture
        const isThumbUp = thumbTip[1] < indexTip[1]; // Check if thumb is up relative to index finger
        
        if (isThumbUp) {
          resultElement.textContent = 'Thumbs Up!';
        } else {
          resultElement.textContent = 'No Thumbs Up Detected!';
        }
      } else {
        resultElement.textContent = 'No hands detected.';
      }
    }

    async function main() {
      const videoElement = await setupWebcam();
      const handpose = await setupHandpose();

      // Continuously process the webcam frames for gesture recognition
      const processFrame = () => {
        detectGesture(videoElement, handpose);
        requestAnimationFrame(processFrame);
      };

      processFrame();
    }

    // Start the main program
    main();
