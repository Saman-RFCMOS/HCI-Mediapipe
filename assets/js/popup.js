var modal = document.getElementById("survey_popup");

// Get the button that opens the modal
var btn = document.getElementById("open_survey");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("closex")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    const video = document.getElementById('video');
    video.srcObject = stream;
  })
  .catch(err => {
    console.error('Error accessing 1  webcam:', err);
  });
