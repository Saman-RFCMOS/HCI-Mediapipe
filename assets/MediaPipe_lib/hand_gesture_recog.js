// Function to set up the webcam
    async function setupWebcam() {
      const videoElement = document.getElementById('webcam');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

    // Function to set up the handpose model
    async function setupHandpose() {
      const handpose = await handpose.load();
      return handpose;
    }

    // Function to detect gestures
    async function detectGesture(videoElement, model) {
      const predictions = await model.estimateHands(videoElement);

      const resultElement = document.getElementById('gestureResult');
      
      if (predictions.length > 0) {
        // Access keypoints to detect thumb gestures
        const thumbTip = predictions[0].landmarks[4]; // Thumb tip (index 4)
        const indexTip = predictions[0].landmarks[8]; // Index tip (index 8)

        // Example gesture detection: "Thumbs up" gesture
        const isThumbUp = thumbTip[1] < indexTip[1]; // Thumb higher than index -> thumbs up

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
      
      const processFrame = () => {
        detectGesture(videoElement, handpose);
        requestAnimationFrame(processFrame);
      };

      processFrame();
    }

    // Run the main function
    main();
