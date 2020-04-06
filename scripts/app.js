function digit_predict(){

  // Create new image element to ensure image is read.
  const digitImage = document.getElementById('digit');
  addImageToLocalStorage(digitImage);

  var input = document.querySelector('input[type="file"]')

  input.addEventListener("change", function() {
    post();
  });
}

function addImageToLocalStorage(digitImage) {

  // Take action when the image has loaded
  window.addEventListener("load", function () {
    const imgCanvas = document.createElement("canvas");
    const imgContext = imgCanvas.getContext("2d");

    // Make sure canvas is as big as the picture
    imgCanvas.width = digitImage.width;
    imgCanvas.height = digitImage.height;

    // Draw image into canvas element
    imgContext.drawImage(digitImage, 0, 0, digitImage.width, digitImage.height);

      // Get canvas contents as a data URL
      var imgAsDataURL = imgCanvas.toDataURL("image/jpeg");

      // Save image into localStorage
      try {
          localStorage.setItem("image", imgAsDataURL);
      }
      catch (e) {
          console.log("Storage failed: " + e);
      }
    }, false);  
}

function getFile(){
  const input = document.querySelector('input[type="file"]');
  const file = input.files[0];
  return file;
}

function post(){
  const file = getFile();

  // Create form object to send.
  const data = new FormData();
  data.append('image', file);
  console.log(data.get('image'));

  // Alter IP as needed
  const ip = '18.188.117.189';
  const url = `http://${ip}:8888/mnist`;

  fetch(url, {
    method: 'POST',
    body: data
  })
  .then(function(response){
    console.log(response);
    return response.json();
  })
  .then(function(json) {
    console.log(json);
  })
  .catch(function(error){
    console.log(error);
  })
}

digit_predict();