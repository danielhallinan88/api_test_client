function digitPredict(){

  // Create new image element to ensure image is read.
  //const digitImage = document.getElementById('digit');
  //addImageToLocalStorage(digitImage);

  const digitInput = document.getElementById('digitImgUpload');
  const digitImgOutput = document.getElementById('digitImgOutput');

  digitInput.addEventListener("change", function() {
    digitImgOutput.src = URL.createObjectURL(event.target.files[0]);
    const apiType = 'digit';
    post(apiType, 'none');
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

function post(apiType, thisFile){
  let file
  if (thisFile === 'none') {
    file = getFile(apiType);
  } else {
    file = thisFile;
  }
  
  //console.log(file);

  // Create form object to send.
  const data = new FormData();
  data.append('image', file);
  //console.log(data.get('image'));

  // Alter IP as needed
  const ip = '18.220.159.11';
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
    post(apiType, 'none');
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

function clearCanvas(ctx, canvas){
  clearBtn = document.getElementById('clearBtn');
  clearBtn.addEventListener('click', function (e){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  });
}

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
  }

function canvasToImg(canvas){
  const dataUrl = canvas.toDataURL("image/jpeg");

  const file = dataURLtoFile(dataUrl, 'canvas_digit.jpg');
  console.log(file);
  post('digit', file);
}

function submitCanvas(canvas){
  submitBtn = document.getElementById('submitBtn');
  submitBtn.addEventListener('click', function (e){
    canvasToImg(canvas);
  });
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

clearCanvas(ctx, canvas);
submitCanvas(canvas);
