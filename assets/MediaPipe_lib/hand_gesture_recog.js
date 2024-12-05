import { FilesetResolver, GestureRecognizer } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs';

    async function initializeGestureRecognizer() {
      // Ensure the MediaPipe library is loaded globally
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/"
      );

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

      // Set up recognition in video mode
      gestureRecognizer.setOptions({
        runningMode: "video"
      });

      let lastVideoTime = -1;
      function renderLoop() {
        const video = document.getElementById("video");

        if (video.currentTime !== lastVideoTime) {
          const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(video);
          processResult(gestureRecognitionResult);
          lastVideoTime = video.currentTime;
        }

        requestAnimationFrame(renderLoop);
      }

      renderLoop();
    }

    // Start the process when the window loads
    window.onload = initializeGestureRecognizer;

    function processResult(result) {
      if (result.gestures && result.gestures.length > 0) {
        const gesture = result.gestures[0].categoryName;
        if (gesture === 'Thumb_Up') {
          console.log("Thumbs Up Detected!");
        }
      }
    }
