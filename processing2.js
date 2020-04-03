var sendToServer = function(img){
    var httpPost = new XMLHttpRequest(),
        path = "http://3.134.102.13:8888/mnist",
        data = {image: img};
    httpPost.onreadystatechange = function(err) {
            if (httpPost.readyState == 4 && httpPost.status == 200){
                console.log(httpPost.responseText);
            } else {
                console.log(err);
            }
        };
    // Set the content type of the request to json since that's what's being sent
    //httpPost.setHeader('Content-Type', 'image/jpeg');
    httpPost.open("POST", path, true);
    httpPost.send(data);
};

function myCanvas() {
  var c = document.getElementById('canvas');
  var ctx = c.getContext('2d');
  var img = document.getElementById('me')
  //var img = document.getElementById('me').style.filter="invert(100%)";
  img.width = 28;
  img.style.filter="invert(100%)";
  ctx.drawImage(img, 10, 10);
  sendToServer(img);
};
