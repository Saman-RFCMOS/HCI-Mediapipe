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

    // Scaling the video width and height to match canvas dimensions
    const videoWidth = videoElement.videoWidth;
    const videoHeight = videoElement.videoHeight;

    // Setting the canvas size to match the video element size
    canvasElement.width = videoWidth;
    canvasElement.height = videoHeight;
    canvasElement.style.width = `${videoWidth}px`;
    canvasElement.style.height = `${videoHeight}px`;
    videoElement.style.width = `${videoWidth}px`;
    videoElement.style.height = `${videoHeight}px`;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Log the raw results to debug landmarks
    if (results.landmarks && results.landmarks.length > 0) {
        console.log("Landmarks:", results.landmarks);  // Log the landmarks data

        const landmarks = results.landmarks[0];
        
        // Scaling landmarks to fit the canvas size
        const scaleX = canvasElement.width / videoWidth;
        const scaleY = canvasElement.height / videoHeight;

        // Apply scaling to landmarks
        const scaledLandmarks = landmarks.map(landmark => ({
            x: landmark.x * canvasElement.width,
            y: landmark.y * canvasElement.height,
            z: landmark.z
        }));

        const drawingUtils = new DrawingUtils(canvasCtx);

        // Draw connectors and landmarks only if landmarks are present
        drawingUtils.drawConnectors(scaledLandmarks, GestureRecognizer.HAND_CONNECTIONS, {
            color: "#00F00F",
            lineWidth: 3
        });
        drawingUtils.drawLandmarks(scaledLandmarks, { color: "#FF0000", lineWidth: 1 });
    } else {
        console.log("No landmarks detected!");
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
                action = "Unknown gesture";
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
