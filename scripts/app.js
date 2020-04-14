function digitPredict(){

  // Create new image element to ensure image is read.
  //const digitImage = document.getElementById('digit');
  //addImageToLocalStorage(digitImage);

  const digitInput = document.getElementById('digitImgUpload');
  const digitImgOutput = document.getElementById('digitImgOutput');

  digitInput.addEventListener("change", function() {
    digitImgOutput.src = URL.createObjectURL(event.target.files[0]);
    const apiType = 'digit';
    post(apiType);
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

function getFile(apiType){
  let inputId;

  if (apiType === 'digit') {
    inputId = 'digitImgUpload';
  } else if (apiType === 'dog') {
    inputId = 'dogImgUpload';
  }

  const input = document.getElementById(inputId);
  const file = input.files[0];
  return file;
}

function stringToBool(str){
  return (str) === 'True' ? true : false;
}

function post(apiType){
  const file = getFile(apiType);

  // Create form object to send.
  const data = new FormData();
  data.append('image', file);
  console.log(data.get('image'));

  // Alter IP as needed
  const ip = '3.134.80.51';
  const socket = `http://${ip}:8888/`;
  let endPoint;
  let resultDivId;

  if (apiType === 'digit'){
    endPoint = 'mnist';
    resultDivId = 'digit_result';
  } else if (apiType === 'dog'){
    endPoint = 'dog-classifier';
    resultDivId = 'dog_result';
  }

  const url = `${socket}${endPoint}`;
  console.log(url);

  resultDiv = document.getElementById(resultDivId);
  resultDiv.innerText = 'Retrieving Prediction';

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

    if (apiType === 'digit'){
      const prediction = json['prediction'];
      resultDiv.innerText = `Prediction: ${prediction}`;

    } else if (apiType === 'dog'){
      const breed = json['dog_breed'];
      const is_dog = stringToBool(json['is_dog']);
      const is_human = stringToBool(json['is_human']);
      let outputText;

      if(is_dog){
        outputText = `That looks like a ${breed}`;
      } else {
        if(is_human){
          outputText = `That person looks like a ${breed}`;
        } else {
          outputText = `I don't know what that is, but looks kind of like a ${breed}`
        }
      }

      resultDiv.innerText = outputText;
    }

  })
  .catch(function(error){
    console.log(error);
  })
}

function dogPredict() {
  const dogInput = document.getElementById('dogImgUpload');
  const dogImgOutput = document.getElementById('dogImgOutput');

  dogInput.addEventListener("change", function() {
    dogImgOutput.src = URL.createObjectURL(event.target.files[0]);
    const apiType = 'dog'
    post(apiType);
  });
}

// new position from mouse event
function setPosition(e) {
  pos.x = e.offsetX;
  pos.y = e.offsetY;
}

function draw(e) {
  // mouse left button must be pressed
  if (e.buttons !== 1) return;

  ctx.beginPath(); // begin

  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#FFFFFF';

  ctx.moveTo(pos.x, pos.y); // from
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); // to

  ctx.stroke(); // draw it!
}

digitPredict();
dogPredict();

// Draw a number on the canvas and send to MNIST API.
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const pos = { x: 0, y: 0 };

document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

