import { useEffect } from "react"

declare global {
  const cv: any
}

function Lab() {
  useEffect(() => {
    const video = document.getElementById("video") as HTMLVideoElement
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    }).then(stream => {
      video.srcObject = stream
      video.play()
    })

    return () => {
      console.log("off lab");
      (video.srcObject as MediaStream).getTracks().forEach(track => {
        track.stop()
      })
    }
  }, [])
  return (
    <div>
      <div>
        <video id="video" width="300" height="300">
        </video>
      </div>
      {/* <div>
        <canvas id="pregray" width="300" height="300"></canvas>
      </div>
      <div>
        <canvas id="nextgray" width="300" height="300"></canvas>
      </div> */}
      <div>
        <canvas id="output" width="300" height="300"></canvas>
      </div>
    </div>
  )
}

export default Lab