let hasLiked = false; // Flag to track if "Like" action occurred
let hasDisliked = false; // Flag to track if "Dislike" action occurred

function checkGestureOutput() {
    const gestureOutput = document.getElementById("gesture_output");
    const mainGesture = document.getElementById("main_gesture");
    const voiceGesture=document.getElementByID("voice_gesture");
    const modal = document.getElementById("survey_popup");
    const imageLike = document.getElementById('Likeimg');
    const imageDis = document.getElementById('dislikeimg');
    const imagesub = document.getElementById('OPsubmit');

    if (gestureOutput && mainGesture) {
        const currentText = gestureOutput.innerText.trim();
        const actionMatch = currentText.match(/Action: (\w+)/);
        if (actionMatch && actionMatch[1]) {
            const action = actionMatch[1]; 
            if (mainGesture.style.display !== 'none') {
                if (action === "Like") {
                    hasLiked = true; // Set flag to true when user "Likes"
                    hasDisliked = false; // Reset "Dislike" flag
                    imageLike.style.filter = 'sepia(1) hue-rotate(180deg)';
                    imageDis.style.filter = '';
                    imagesub.style.display = 'block'; // Change from 'none' to 'block'
                    imagesub.style.opacity = '1';
                } else if (action === "Dislike") {
                    hasDisliked = true; // Set flag to true when user "Dislikes"
                    hasLiked = false; // Reset "Like" flag
                    imageDis.style.filter = 'sepia(1) hue-rotate(180deg)';
                    imageLike.style.filter = '';
                    imagesub.style.display = 'block'; // Change from 'none' to 'block'
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
