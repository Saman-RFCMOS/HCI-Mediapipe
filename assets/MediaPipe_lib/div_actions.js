let hasLiked = false; // Flag to track if "Like" action occurred
let hasDisliked = false; // Flag to track if "Dislike" action occurred

function checkGestureOutput() {
    const gestureOutput = document.getElementById("gesture_output");
    const mainGesture = document.getElementById("main_gesture");
    const voiceGesture =document.getElementById("voice_gesture");
    const modal = document.getElementById("survey_popup");
    const imageLike = document.getElementById('Likeimg');
    const imageDis = document.getElementById('dislikeimg');
    const Micsub = document.getElementById('Micsubmit');

if (gestureOutput && voiceGesture) {
    const currentText = gestureOutput.innerText.trim();
    const actionMatch = currentText.match(/Action: (\w+)/);

    if (actionMatch && actionMatch[1]) {
        const action = actionMatch[1];

        if (voiceGesture.style.display !== 'none') {
            // Show the image or feedback while waiting
            Micsub.style.display = 'block';
            Micsub.style.opacity = '1';

            // Ensure the timer runs only once
            let timerStarted = false;

            if (!timerStarted) {
                timerStarted = true;

                const recoTimeDiv = document.getElementById('RecoTime'); // Reference to the RecoTime div
                let countdown = 5; // Start from 5 seconds

                // Update the timer every second
                const timerInterval = setInterval(() => {
                    if (recoTimeDiv) {
                        recoTimeDiv.innerText = `Time remaining: ${countdown} seconds`;
                    }
                    countdown--;

                    // When the countdown ends
                    if (countdown < 0) {
                        clearInterval(timerInterval); // Stop the interval
                        if (action === "Submit") {
                            showDiv("thank_you");
                        }
                        if (recoTimeDiv) {
                            recoTimeDiv.innerText = ''; // Clear the timer display
                        }
                        timerStarted = false; // Reset the flag
                    }
                }, 1000); // Update every 1 second
            }
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
            //if (action === "Close") {
            //    showDiv('main_gesture'); // Show 'main_gesture' when "Close" action occurs
            //    hasLiked = false; // Reset both flags
            //    hasDisliked = false;
                //if (modal) {
                //    modal.style.display = "none"; // Hide modal if it's open
                //}
            //}
        }
    } 
}//MainGesture Function

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
