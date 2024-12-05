import { HandGestureRecognition } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/hand_gesture_recognition.js';

        // Initialize the gesture recognizer
        const gestureRecognizer = new HandGestureRecognition.GestureRecognizer();

        // Initialize webcam
        const videoElement = document.getElementById('webcam');
        const gestureOutput = document.getElementById('gesture-output');

        async function setupWebcam() {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElement.srcObject = stream;
        }

        async function detectGestures(frame) {
            // Process the video frame for gesture recognition
            const gestures = await gestureRecognizer.recognize(frame);
            if (gestures.length > 0) {
                // Display the detected gesture
                gestureOutput.textContent = `Detected Gesture: ${gestures[0].name}`;
            } else {
                gestureOutput.textContent = 'No gesture detected';
            }
        }

        async function startDetection() {
            // Set up MediaPipe HandGestureRecognizer
            await gestureRecognizer.initialize();

            // Start webcam and detection loop
            const videoTrack = videoElement.srcObject.getVideoTracks()[0];
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            function processFrame() {
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                
                // Detect gestures on the captured frame
                detectGestures(canvas);

                // Continue processing the next frame
                requestAnimationFrame(processFrame);
            }

            // Start processing the video
            processFrame();
        }

        // Initialize the webcam and start gesture detection
        setupWebcam().then(startDetection);
