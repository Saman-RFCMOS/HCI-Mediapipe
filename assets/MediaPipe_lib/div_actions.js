
function getGestureFromDiv() {
    const gestureOutputDiv = document.getElementById('gesture_output');
    const gestureOutputText = gestureOutputDiv.innerText; 
    const actionMatch = gestureOutputText.match(/Action:\s*(\w+)/);
    return actionMatch ? actionMatch[1] : null;
}

function handleGesture(gesture) {
    switch (gesture) {
        case 'dislike':
            console.log("Performing Dislike action");
            break;
        case 'star':
            console.log("Performing Star action");
            break;
        case 'voice':
            console.log("Performing Voice action");
            break;
        case 'thank_you':
            console.log("Performing Thank You action");
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
