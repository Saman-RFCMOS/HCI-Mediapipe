
function checkGestureOutput() {
    const gestureOutput = document.getElementById("gesture_output");
    const mainGesture = document.getElementById("main_gesture");
    const modal = document.getElementById("survey_popup");

    if (gestureOutput && mainGesture) {
        const currentText = gestureOutput.innerText.trim();
        const actionMatch = currentText.match(/Action: (\w+)/);
        if (actionMatch && actionMatch[1]) {
            const action = actionMatch[1]; 
            if (mainGesture.style.display !== 'none') {
                if (action === "Like") {
                    showDiv('star_gesture');
                }
                else if (action === "Dislike") {
                    showDiv('voice_gesture');
                }
            }
            if (action === "Close" && modal) {
                modal.style.display = "none";
            }
        }
    }
}

setInterval(checkGestureOutput, 1000);

function showDiv(divId) {
    const divs = ['main_gesture', 'star_gesture', 'voice_gesture', 'thank_you'];
    divs.forEach(id => {
        const div = document.getElementById(id);
        if (id === divId) {
            div.style.display = 'block';
        } else {
            div.style.display = 'none';
        }
    });
}
