let hasLiked = false; // Flag to track if "Like" action occurred
let hasDisliked = false; // Flag to track if "Dislike" action occurred

function delayForFiveSeconds() {
    let counttimer = 1;
    const timerInter = setInterval(() => {
        counttimer++;
        if (counttimer > 5) {
            clearInterval(timerInter); 
        }
    }, 1000); 
}

function checkGestureOutput() {
    const gestureOutput = document.getElementById("gesture_output");
    const mainGesture = document.getElementById("main_gesture");
    const thankGesture = document.getElementById("thank_you");
    const voiceGesture =document.getElementById("voice_gesture");
    const starGesture =document.getElementById("star_gesture");
    const modal = document.getElementById("survey_popup");
    const imageLike = document.getElementById('Likeimg');
    const imageDis = document.getElementById('dislikeimg');
    const imagesub = document.getElementById('OPsubmit');

if (gestureOutput && starGesture) {
    const currentText = gestureOutput.innerText.trim();
    const actionMatch = currentText.match(/Action: (\w+)/);

    // Initialize variables to track the gray state of each star
    let star1Gray = true;
    let star2Gray = true;
    let star3Gray = true;

    if (actionMatch && actionMatch[1]) {
        const action = actionMatch[1];

        if (starGesture.style.display !== 'none') {
            const star1 = document.getElementById('star1');
            const star2 = document.getElementById('star2');
            const star3 = document.getElementById('star3');
            const grayStar = "grayscale(100%)";
            const removeGray = "none";

            // Apply gray color initially to all stars
            star1.style.filter = grayStar;
            star2.style.filter = grayStar;
            star3.style.filter = grayStar;

            // Function to remove gray overlay from stars
            function removeGrayOverlay(starElement, starNum) {
                starElement.style.filter = removeGray;
                // Track that the star is no longer gray
                if (starNum === 1) star1Gray = false;
                if (starNum === 2) star2Gray = false;
                if (starNum === 3) star3Gray = false;
            }

            // Remove gray overlay based on the action
            if (action === "1") {
                removeGrayOverlay(star1, 1); // Remove gray from 1st star
            } else if (action === "2") {
                removeGrayOverlay(star1, 1); // Remove gray from 1st star
                removeGrayOverlay(star2, 2); // Remove gray from 2nd star
            } else if (action === "3") {
                removeGrayOverlay(star1, 1); // Remove gray from 1st star
                removeGrayOverlay(star2, 2); // Remove gray from 2nd star
                removeGrayOverlay(star3, 3); // Remove gray from 3rd star
            }

            // Handle the "Submit" action: Show "thank_you" if not all stars are gray
            if (action === "Submit") {
                // Check if all stars are gray
                if (!star1Gray || !star2Gray || !star3Gray) {
                    showDiv("thank_you");
                } else {
                    console.log("All stars are gray, cannot submit.");
                }
            }
        }
    }
}


    

    if (gestureOutput && thankGesture) {
        const currentText = gestureOutput.innerText.trim();
        const actionMatch = currentText.match(/Action: (\w+)/);
        if (actionMatch && actionMatch[1]) {
            const action = actionMatch[1]; 
            if (thankGesture.style.display !== 'none') {
                    if (action === "Close") {
                        delayForFiveSeconds();
                        modal.style.display = "none"; 
                        btn.disabled = true;
                        btn.style.backgroundColor = "#D3D3D3"
                        btn.style.cursor = "not-allowed";        
                    }
            }
        }
    }

if (gestureOutput && voiceGesture) {
    if (voiceGesture.style.display !== 'none') {
        const recoTimeDiv = document.getElementById('RecoTime');
        const micsub = document.getElementById('Micsubmit');
        let countdown = 5;
        const timerInterval = setInterval(() => {
            if (recoTimeDiv) {
                recoTimeDiv.innerText = `Recording: ${countdown} seconds`; 
            }
            countdown--;
            if (countdown < 0) {
                clearInterval(timerInterval); 
                if (recoTimeDiv) {
                    recoTimeDiv.innerText = ''; 
                }
                if (micsub) {
                    micsub.style.display = 'block';
                    micsub.style.opacity = '1';
                }
                const currentText = gestureOutput.innerText.trim();
                const actionMatch = currentText.match(/Action: (\w+)/);
                if (actionMatch && actionMatch[1]) {
                    const action = actionMatch[1];
                    if (action === "Submit") {
                        showDiv("thank_you");
                    }
                }
            }
        }, 1000); 
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
