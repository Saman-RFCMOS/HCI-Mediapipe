import { GestureRecognizer, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

let gestureRecognizer;
let runningMode = "IMAGE";
let webcamRunning = false;

const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
        },
        runningMode: runningMode
    });
};

createGestureRecognizer();

const videoElement = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const gestureOutput = document.getElementById("gesture_output");
const enableWebcamButton = document.getElementById("open_survey");

function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (hasGetUserMedia()) {
    enableWebcamButton.addEventListener("click", enableCam);
} else {
    console.warn("getUserMedia() is not supported by your browser");
}

function enableCam() {
    if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    } else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }

    const constraints = { video: true };
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        videoElement.srcObject = stream;
        videoElement.addEventListener("loadeddata", predictWebcam);
    });
}

let lastVideoTime = -1;
let results;

// Function to count extended fingers
function countExtendedFingers(landmarks) {
    let extendedFingers = 0;

    // Check index finger (landmark 8 and 6 for index tip and base)
    if (landmarks[8].y < landmarks[6].y) {
        extendedFingers++;
    }

    // Check middle finger (landmark 12 and 10 for middle tip and base)
    if (landmarks[12].y < landmarks[10].y) {
        extendedFingers++;
    }

    // Check ring finger (landmark 16 and 14 for ring tip and base)
    if (landmarks[16].y < landmarks[14].y) {
        extendedFingers++;
    }

    // Check pinky finger (landmark 20 and 18 for pinky tip and base)
    if (landmarks[20].y < landmarks[18].y) {
        extendedFingers++;
    }

    return extendedFingers;
}

async function predictWebcam() {
    const webcamElement = document.getElementById("webcam");

    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }

    let nowInMs = Date.now();
    if (videoElement.currentTime !== lastVideoTime) {
        lastVideoTime = videoElement.currentTime;
        results = gestureRecognizer.recognizeForVideo(videoElement, nowInMs);
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    canvasElement.style.height = "360px";
    webcamElement.style.height = "360px";
    canvasElement.style.width = "480px";
    webcamElement.style.width = "480px";

    const drawingUtils = new DrawingUtils(canvasCtx);

    if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];
        drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
            color: "#00F00F",
            lineWidth: 3
        });
        drawingUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 1 });

        // Count the number of extended fingers
        const extendedFingers = countExtendedFingers(landmarks);
        let action;

        // Action based on the number of extended fingers
        if (extendedFingers === 3) {
            action = "Three Fingers Up";
        } else if (extendedFingers === 4) {
            action = "Four Fingers Up";
        } else {
            action = "Unknown gesture";
        }

        gestureOutput.innerText = `Action: ${action}\n Confidence: ${categoryScore}%\n Handedness: ${handedness}`;
    } else {
        gestureOutput.style.display = "none";
    }

    canvasCtx.restore();

    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}
