import { CSSProperties, useCallback, useEffect, useRef, useState } from "react"
import style from "../../styles/gallery.module.scss"


const stageWidth = 600
const stageHeight = 500
const stageInlineStyle: CSSProperties = {
  width: `${ stageWidth.toString() }px`,
  height: `${ stageHeight.toString() }px`,
  overflow: "auto"
}

function Stage({
    image,
    subScale,
  }: { 
    image: ArrayBuffer,
    subScale: (handler: (arg: any) => any, extras?: { [key: string]: any } | undefined) => () => void
  }) {
  console.log("stage")
  const canvas = useRef(null)
  const [scale, setScale] = useState(1)
  const loadImage = (buffer: ArrayBuffer) => {
    const canvasElement = canvas.current as unknown as HTMLCanvasElement
    canvasElement.width = canvasElement.clientWidth
    canvasElement.height = canvasElement.clientHeight
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
    loadImage(image)
  }, [image])

  const scaleHandler = useCallback((value: number) => {
    setScale(value)
  }, [])

  useEffect(() => {
    subScale(scaleHandler, {
      curScale: scale
    })
  }, [scale]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={ style["stage-container"] } style={ stageInlineStyle }>
      <canvas ref={ canvas } className={ style["stage-canvas"] } style={ {transform: `scale(${scale})`} }>

      </canvas>
    </div>
  )
} 


export default Stage
