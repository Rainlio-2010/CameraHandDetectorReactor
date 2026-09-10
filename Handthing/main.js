
const videoElement = document.getElementById("cam")
const canvasElement = document.getElementById("canv")
const canvasCtx = canvasElement.getContext("2d")

canvasElement.width = 640;
canvasElement.height = 360;

function onResult(results){
    

    canvasCtx.save()
    canvasCtx.clearRect(
        0,
        0,
        canvasElement.width, canvasElement.height
    )
    canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
    )
    if(results.multiHandLandmarks){
        for(const landmarks of results.multiHandLandmarks){
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                {color:'#00FF00', lineWidth:4}
            )
            drawLandmarks(canvasCtx, landmarks, {color:'#FF0000', lineWidth:1})
        }
    }
    canvasCtx.restore();
}
const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
}})
hands.onResults(onResult)

hands.setOptions({
    maxNumHands:2,
    modelComplexity:1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
})

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement})
    },
    width: 1280,
    height: 720
})
camera.start()