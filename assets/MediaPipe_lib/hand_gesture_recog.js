 let gestureRecognizer;
    const webcamElement = document.getElementById('webcam');
    const gestureMsg = document.getElementById('gesture-msg');
    
    // Setup webcam
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
      // Ensure FilesetResolver is loaded before GestureRecognizer
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/");
      
      // Load the Gesture Recognizer task
      gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task"
        },
        numHands: 2
      });

      // Configure the recognizer options
      gestureRecognizer.setOptions({
        runningMode: "video",
        minHandDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        minHandPresenceConfidence: 0.5
      });
    }

    // Process and display results
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

    // Rendering and gesture detection loop
    let lastVideoTime = -1;
    function renderLoop() {
      const video = webcamElement;

      if (video.currentTime !== lastVideoTime) {
        // Perform gesture recognition for each frame
        gestureRecognizer.recognizeForVideo(video).then((gestureRecognitionResult) => {
          processResult(gestureRecognitionResult);
        });

        lastVideoTime = video.currentTime;
      }

      requestAnimationFrame(renderLoop);
    }

    // Start the webcam and gesture recognition
    async function start() {
      await setupWebcam(); // Set up the webcam
      await initializeGestureRecognizer(); // Initialize Gesture Recognizer
      renderLoop(); // Start the loop to process video frames
    }

    start(); // Initialize the app
