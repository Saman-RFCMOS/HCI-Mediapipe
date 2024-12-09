
function handleGestureAction() {

    const gestureOutput = document.getElementById('gesture_output').innerText;

    const actionMatch = gestureOutput.match(/Action: (.+?)\n/);
    const categoryScoreMatch = gestureOutput.match(/Confidence: (\d+)%\n/);

    if (actionMatch && categoryScoreMatch) {
        const action = actionMatch[1];
        const categoryScore = categoryScoreMatch[1];

        const mainGesture = document.getElementById('main_gesture');
        if (mainGesture && mainGesture.offsetParent !== null) {  

            // If the action is "Like", call showDiv('star_gesture')
            if (action === 'Like') {
                showDiv('star_gesture');
            }
            // If the action is "Dislike", call showDiv('voice_gesture')
            else if (action === 'Dislike') {
                showDiv('voice_gesture');
            }
        }
    }
}

handleGestureAction();
