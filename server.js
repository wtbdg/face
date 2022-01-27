const video = document.getElementById('video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo);

function startVideo() {
    navigator.getUserMedia({ video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = {
        width: video.width,
        height: video.height
    }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async() => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            //console.log(detections);
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            // faceapi.draw.drawDetections(canvas, resizedDetections)
            // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        const happy = resizedDetections[0].expressions.happy;
        const neutral = resizedDetections[0].expressions.neutral;
        const angry = resizedDetections[0].expressions.angry;
        const surprised = resizedDetections[0].expressions.surprised;
        document.getElementById('message').classList = "state-happy"
        if (happy > angry && happy > neutral && happy > surprised && happy <= 0.9) {
            document.getElementById('message').classList = "state-superhappy"
        } else if (happy > angry && happy > neutral && happy > surprised && happy == 1) {
            document.getElementById('message').classList = "state-superhappy"
        } else {
            document.getElementById('message').classList = "state-happy"
        }

    }, 100)
})