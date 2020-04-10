function digitPredict(){

  // Create new image element to ensure image is read.
  const digitImage = document.getElementById('digit');
  addImageToLocalStorage(digitImage);

  const input = document.querySelector('input[type="file"]')

  input.addEventListener("change", function() {
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
  //const input = document.querySelector('input[type="file"]');
  let inputId;

  if (apiType === 'digit') {
    inputId = 'digit_img_upload';
  } else if (apiType === 'dog') {
    inputId = 'dogImgUpload';
  }
  //const input = document.getElementById('digit_img_upload');
  const input = document.getElementById(inputId);
  const file = input.files[0];
  return file;
}

function post(apiType){
  const file = getFile(apiType);

  // Create form object to send.
  const data = new FormData();
  data.append('image', file);
  console.log(data.get('image'));

  // Alter IP as needed
  const ip = '18.217.162.1';
  const socket = `http://${ip}:8888/`;
  let endPoint;

  if (apiType === 'digit'){
    endPoint = 'mnist';
  } else if (apiType === 'dog'){
    endPoint = 'dog-classifier';
  }

  const url = `${socket}${endPoint}`;
  //const url = `http://${ip}:8888/mnist`;
  console.log(url);

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
      resultDiv = document.getElementById('digit_result');
      const output = document.createElement('p');
      output.innerText = `Prediction: ${prediction}`;
      resultDiv.append(output);
    } else if (apiType === 'dog'){
      const breed = json['dog_breed'];
      const is_dog = json['is_dog'];
      const is_human = json['is_human'];
      let outputText;

      if(is_dog){
        outputText = `That looks like a ${breed}`;
      } else {
        if(is_human){
          outputText = `That person looks like a ${breed}`;
        } else {
          outputText = "I don't know what that is."
        }
      }
      resultDiv = document.getElementById('dog_result');
      const output = document.createElement('p');
      output.innerText = outputText;
      resultDiv.append(output);
    }

  })
  .catch(function(error){
    console.log(error);
  })
}

function dogPredict() {
  const dogInput = document.getElementById('dogImgUpload');
  console.log(dogInput);

  dogInput.addEventListener("change", function() {
    const apiType = 'dog'
    post(apiType);
  });
}

digitPredict();
dogPredict();