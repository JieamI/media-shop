import { CSSProperties, useEffect, useRef } from "react"
import style from "../../styles/gallery.module.scss"


const stageWidth = 500
const stageHeight = 500
const stageInlineStyle: CSSProperties = {
  width: `${ stageWidth.toString() }px`,
  height: `${ stageHeight.toString() }px`,
}

function Stage({ image }: { image: ArrayBuffer }) {
  console.log("stage")
  const canvas = useRef(null)
  const loadImage = (buffer: ArrayBuffer) => {
    const img = new Image()
    const ctx = (canvas.current as unknown as HTMLCanvasElement).getContext("2d")
    img.onload = () => {
      const max = Math.max(img.naturalHeight, img.naturalWidth)
      const ratio = Math.min(stageWidth, stageHeight) / max
      const offsetY = 0.5 * (stageHeight - img.naturalHeight * ratio)
      const offsetX = 0.5 * (stageWidth - img.naturalWidth * ratio)
      ctx?.save()
      ctx?.scale(ratio, ratio)
      ctx?.drawImage(img, offsetX / ratio, offsetY / ratio) // 此时处于scale上下文中，需要除以ratio以得到实际偏移像素
      ctx?.restore()
    }
    const blob = new Blob([buffer])
    img.src = URL.createObjectURL(blob)
  }
  
  useEffect(() => {
    const canvasElement = canvas.current as unknown as HTMLCanvasElement
    canvasElement.width = canvasElement.clientWidth
    canvasElement.height = canvasElement.clientHeight
    loadImage(image)
  }, [image])

  return (
    <div className={ style["stage-container"] } style={ stageInlineStyle }>
      <canvas ref={ canvas } className={ style["stage-canvas"] }>

      </canvas>
    </div>
  )
} 

export default Stage
