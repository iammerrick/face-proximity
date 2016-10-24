const mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
  getUserMedia: function(c) {
    return new Promise(function(y, n) {
      (navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia).call(navigator, c, y, n);
    });
  }
} : null);

if (!mediaDevices) {
  throw new Error("getUserMedia() not supported.");
}

export default mediaDevices;
