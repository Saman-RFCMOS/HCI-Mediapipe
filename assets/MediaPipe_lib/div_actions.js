let hasLiked = false; // Flag to track if "Like" action occurred
let hasDisliked = false; // Flag to track if "Dislike" action occurred
let timerStarted = false; // Flag to track if the timer is already running

function checkGestureOutput() {
    const gestureOutput = document.getElementById("gesture_output");
    const mainGesture = document.getElementById("main_gesture");
    const voiceGesture = document.getElementById("voice_gesture");
    const modal = document.getElementById("survey_popup");
    const imageLike = document.getElementById('Likeimg');
    const imageDis = document.getElementById('dislikeimg');
    const micsub = document.getElementById('Micsubmit');
    const imagesub = document.getElementById('OPsubmit');

    if (gestureOutput && voiceGesture) {
        const currentText = gestureOutput.innerText.trim();
        const actionMatch = currentText.match(/Action: (\w+)/);
        if (actionMatch && actionMatch[1]) {
            const action = actionMatch[1];
            if (voiceGesture.style.display !== 'none' && !timerStarted) {
                timerStarted = true; // Prevent re-initialization of the timer
                const recoTimeDiv = document.getElementById('RecoTime');
                let countdown = 5;

                const timerInterval = setInterval(() => {
                    if (recoTimeDiv) {
                        recoTimeDiv.innerText = `Recording: ${countdown} seconds`;
                    }
                    countdown--;
                    if (countdown === 0) {
                        clearInterval(timerInterval); 
                        micsub.style.display = 'block';
                        micsub.style.opacity = '1';
                        if (action === "Submit") {
                            showDiv("thank_you");
                        }
                        if (recoTimeDiv) {
                            recoTimeDiv.innerText = ''; // Clear the timer display
                        }
                    }
                }, 1000);
            }
        }
    }

    if (gestureOutput && mainGesture) {
        const currentText = gestureOutput.innerText.trim();
        const actionMatch = currentText.match(/Action: (\w+)/);
        if (actionMatch && actionMatch[1]) {
            const action = actionMatch[1];
            if (mainGesture.style.display !== 'none') {
                if (action === "Like") {
                    hasLiked = true;
                    hasDisliked = false;
                    imageLike.style.filter = 'sepia(1) hue-rotate(180deg)';
                    imageDis.style.filter = '';
                    imagesub.style.display = 'block';
                    imagesub.style.opacity = '1';
                } else if (action === "Dislike") {
                    hasDisliked = true;
                    hasLiked = false;
                    imageDis.style.filter = 'sepia(1) hue-rotate(180deg)';
                    imageLike.style.filter = '';
                    imagesub.style.display = 'block';
                    imagesub.style.opacity = '1';
                }
            }
            if (action === "Submit" && hasLiked) {
                showDiv('star_gesture');
                hasLiked = false;
            }
            if (action === "Submit" && hasDisliked) {
                showDiv('voice_gesture');
                hasDisliked = false;
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
