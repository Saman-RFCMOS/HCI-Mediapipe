var modal = document.getElementById("survey_popup");

// Get the button that opens the modal
var btn = document.getElementById("open_survey");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("closex")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modalx.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modalx.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalx) {
    modalx.style.display = "none";
  }
}
