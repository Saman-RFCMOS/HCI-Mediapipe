import {
    GestureRecognizer,
    FilesetResolver,
    DrawingUtils
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

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

async function predictWebcam() {
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
    videoElement.style.height = "360px";
    canvasElement.style.width = "480px";
    videoElement.style.width = "480px";

    const drawingUtils = new DrawingUtils(canvasCtx);

    if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];
        drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
            color: "#00F00F",
            lineWidth: 3
        });
        drawingUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 1 });
    }

    if (results.gestures.length > 0) {
        gestureOutput.style.display = "block";
        const categoryName = results.gestures[0][0].categoryName;
        const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
        const handedness = results.handednesses[0][0].displayName;

        let action;

        // Detect gestures using the provided categoryName or manual landmark analysis
        switch (categoryName) {
            case "Pointing_Up":
                action = "1 Finger";
                break;
            case "Victory":
                action = "2 Fingers";
                break;
            case "Thumb_Up":
                action = "Like";
                break;
            case "Thumb_Down":
                action = "Dislike";
                break;
            case "Closed_Fist":
                action = "Close";
                break;
            case "Open_Palm":
                action = "Submit";
                break;
            default:
                // Custom gesture detection for 3 and 4 fingers
                const landmarks = results.landmarks[0];

                const isFingerExtended = (fingerIndex) => {
                    const tip = landmarks[fingerIndex * 4];
                    const pip = landmarks[fingerIndex * 4 - 1];
                    return tip.y < pip.y; // Tip is above PIP for a typical "up" hand orientation
                };

                const extendedFingers = [
                    isFingerExtended(1), // Index
                    isFingerExtended(2), // Middle
                    isFingerExtended(3), // Ring
                    isFingerExtended(4), // Pinky
                ];

                const extendedCount = extendedFingers.filter(Boolean).length;

                if (extendedCount === 3) {
                    action = "3 Fingers";
                } else if (extendedCount === 4) {
                    action = "3 Fingers";
                } else {
                    action = "Unknown gesture";
                }
        }

        gestureOutput.innerText = `Action: ${action}\n Confidence: ${categoryScore}%\n`;
    } else {
        gestureOutput.style.display = "none";
    }

    canvasCtx.restore();

    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}
