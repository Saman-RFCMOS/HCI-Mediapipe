function getGestureFromDiv() {
    const gestureOutputDiv = document.getElementById('gesture_output');
    const gestureOutputText = gestureOutputDiv.innerText; 
    const actionMatch = gestureOutputText.match(/Action:\s*(\w+)/);
    return actionMatch ? actionMatch[1] : null; 
}

function handleGesture(gesture) {
    switch (gesture) {
        case 'dislike':
            showDiv('main_gesture'); // Show Main Gesture div
            break;
        case 'star':
            showDiv('star_gesture'); // Show Star Gesture div
            break;
        case 'voice':
            showDiv('voice_gesture'); // Show Voice Feedback div
            break;
        case 'thank_you':
            showDiv('thank_you'); // Show Thank You div
            break;
        default:
            console.log("Unknown gesture");
    }
}


const extractedGesture = getGestureFromDiv();
if (extractedGesture) {
    console.log(`Extracted Gesture: ${extractedGesture}`);
    handleGesture(extractedGesture); 
} else {
    console.log("No gesture detected.");
}
