async function initializeGestureRecognizer() {
  try {
    // Initialize the vision tasks with the correct path to the model
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    // Initialize the Gesture Recognizer
    const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task"
      },
      numHands: 1
    });

    // Assuming you have an image element in your HTML (or any static image data)
    const imageElement = document.getElementById('staticImage'); // Replace with your actual image element ID

    // Ensure the image is loaded and ready for processing
    imageElement.onload = async () => {
      // Process the image for gesture recognition
      const gestureRecognitionResult = await gestureRecognizer.recognizeForImage(imageElement);
      processResult(gestureRecognitionResult);  // Handle the result as you need
    };

    // Trigger image loading
    imageElement.src = 'path_to_your_image.jpg'; // Replace with your image path or source URL
  } catch (error) {
    console.error("Error initializing Gesture Recognizer:", error);
  }
}

function processResult(result) {
  if (result && result.gestures) {
    // Process and display recognized gestures
    console.log("Gestures detected:", result.gestures);
  } else {
    console.log("No gestures detected.");
  }
}
