function digitPredict(){

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
  //const input = document.querySelector('input[type="file"]');
  const input = document.getElementById('digit_img_upload');
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
  const ip = '18.219.145.57';
  const url = `http://${ip}:8888/mnist`;
  //console.log(url);

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
    const prediction = json['prediction'];
    resultDiv = document.getElementById('digit_result');
    const output = document.createElement('p');
    output.innerText = `Prediction: ${prediction}`;
    resultDiv.append(output);
  })
  .catch(function(error){
    console.log(error);
  })
}

function dogPredict() {
  const dogInput = document.getElementById('dogImgUpload');
  console.log(dogInput);

  // input.addEventListener("change", function() {
  //   post();
  // });
}

digitPredict();
dogPredict();