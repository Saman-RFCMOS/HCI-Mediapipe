let hasLiked = false; // Flag to track if "Like" action occurred
let hasDisliked = false; // Flag to track if "Dislike" action occurred

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
                    hasLiked = true; // Set flag to true when user "Likes"
                    hasDisliked = false; // Reset "Dislike" flag
                    const imageLike = document.getElementById('Likeimg');
                    imageLike.style.filter = 'sepia(1) hue-rotate(180deg)';
                    const imagesub = document.getElementById('OPsubmit');
                    imagesub.style.display = 'block'; // Change from 'none' to 'block'
                    imagesub.style.opacity = '1';
                } else if (action === "Dislike") {
                    hasDisliked = true; // Set flag to true when user "Dislikes"
                    hasLiked = false; // Reset "Like" flag
                    const imageDis = document.getElementById('dislikeimg');
                    imageDis.style.filter = 'sepia(1) hue-rotate(180deg)';
                    const imagesub = document.getElementById('OPsubmit');
                    imagesub.style.display = 'block'; // Change from 'none' to 'block'
                    imagesub.style.opacity = '1';
                }
            }

            // Check if "Submit" happens after "Like"
            if (action === "Submit" && hasLiked) {
                showDiv('star_gesture'); // Show 'star_gesture' if previously liked
                hasLiked = false; // Reset the "Like" flag
            }

            // Check if "Submit" happens after "Dislike"
            if (action === "Submit" && hasDisliked) {
                showDiv('voice_gesture'); // Show 'voice_gesture' if previously disliked
                hasDisliked = false; // Reset the "Dislike" flag
            }

            // Handle "Close" action
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
