const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
  }

  startVideo()


  video.addEventListener('play' ,() => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaysize = {width: video.width, height:video.height}
    faceapi.matchDimensions(canvas,displaysize)
    console.log("pls pls")
    setInterval(async (params) => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.tinyFaceDetector()).withFaceLandmarks()
      console.log("pls work pls i geg u ")
      const resized= faceapi.resizeResults(detections,displaysize)
      canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
      faceapi.draw.drawDetections(canvas, resized)
    },100)
  })