async function initializeGestureRecognizer() {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task"
      },
      numHands: 1
    });

    const videoElement = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });
    videoElement.srcObject = stream;

    gestureRecognizer.setOptions({
      runningMode: "video"
    });

    let lastVideoTime = -1;

    function renderLoop() {
      const video = document.getElementById("video");

      // Ensure the video is ready and has a new frame to process
      if (video.readyState === video.HAVE_ENOUGH_DATA && video.currentTime !== lastVideoTime) {
        // Check if the video has a valid frame
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(video);

          if (gestureRecognitionResult) {
            processResult(gestureRecognitionResult);
          }
        }

        lastVideoTime = video.currentTime;
      }

      requestAnimationFrame(renderLoop);
    }

    renderLoop();

  } catch (error) {
    console.error("Error initializing Gesture Recognizer:", error);
  }
}
