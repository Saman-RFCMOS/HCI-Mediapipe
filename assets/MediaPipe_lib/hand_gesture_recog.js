let gestureRecognizer;
    let webcamElement = document.getElementById('webcam');
    let gestureMsg = document.getElementById('gesture-msg');
    
    // Set up the webcam feed
    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        webcamElement.srcObject = stream;
      } catch (error) {
        console.error("Error accessing webcam: ", error);
      }
    }

    // Initialize Gesture Recognizer
    async function initializeGestureRecognizer() {
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
      gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task"
        },
        numHands: 2
      });
      gestureRecognizer.setOptions({
        runningMode: "video",
        minHandDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        minHandPresenceConfidence: 0.5
      });
    }

    // Function to process the gesture recognition results
    function processResult(gestureRecognitionResult) {
      const gestures = gestureRecognitionResult.gestures;
      
      if (gestures && gestures.length > 0) {
        const gesture = gestures[0].categoryName; // The recognized gesture
        if (gesture === "Thumb_Up") {
          gestureMsg.style.display = 'block'; // Show thumbs-up message
        } else {
          gestureMsg.style.display = 'none'; // Hide message for other gestures
        }
      }
    }

    // Video render loop to process each frame
    let lastVideoTime = -1;
    function renderLoop() {
      const video = document.getElementById("webcam");

      if (video.currentTime !== lastVideoTime) {
        const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(video);
        processResult(gestureRecognitionResult);
        lastVideoTime = video.currentTime;
      }

      requestAnimationFrame(renderLoop);
    }

    // Start the video and gesture recognition process
    async function start() {
      await setupWebcam(); // Setup webcam
      await initializeGestureRecognizer(); // Initialize Gesture Recognizer
      renderLoop(); // Start rendering and processing
    }

    // Start the app
    start();
