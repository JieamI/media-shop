import Stage, { stageHeight, stageWidth } from "./Stage"
import style from '../../styles/gallery.module.scss'
import ToolBar from "./ToolBar"
import { useLocation, useNavigate  } from "react-router-dom"
import React, { useEffect, useRef } from "react"
import init, { Processor } from 'media-shop'
import { useHistoryImage } from "../../hooks/useHistoryImage"
import { usePubSub } from "../../hooks/usePubSub"
import Download from "./Download"
import { Action } from '../../share/dispatcher'

const minimizeBuffer = (buffer: ArrayBuffer): Promise<ArrayBuffer | undefined> => {
  const canvas = document.createElement("canvas")
  const img = new Image()
  const ctx = canvas.getContext("2d")
  const promise: Promise<ArrayBuffer | undefined> = new Promise((resolve, _) => {
    img.onload = () => {
      const max = Math.max(img.naturalHeight, img.naturalWidth)
      const ratio = Math.min(stageWidth, stageHeight) / max
      canvas.width = img.naturalWidth * ratio
      canvas.height = img.naturalHeight * ratio
      ctx?.save()
      ctx?.scale(ratio, ratio)
      ctx?.drawImage(img, 0, 0) // 此时处于scale上下文中，需要除以ratio以得到实际偏移像素
      ctx?.restore()
      canvas.toBlob(async (blob) => {
        const buffer = await blob?.arrayBuffer()
        resolve(buffer)
      })
    }
  })
  const blob = new Blob([buffer])
  img.src = URL.createObjectURL(blob)
  return promise
}

function Gallery() {
  console.log("gallery")
  const location = useLocation()
  const navigate = useNavigate()
  let file: File | null;
  try {
    file = (location.state as { file: File }).file
  }catch {
    file = null
  }
 
  const [image, setImage] = useHistoryImage()
  const processor = useRef<Processor>()
  const worker = useRef<Worker>()
  const originMeta = useRef<{ width: number, height: number, ratio: number}>()
  const [subScale, pubScale] = usePubSub<{[key: string]: any}>()

  useEffect(() => {
    if(!file) {
      navigate("/home")
      return
    }
    (async function() {
      await init()
      processor.current = new Processor()
      const buffer = await file.arrayBuffer()
      const bitImage = await createImageBitmap(new Blob([buffer]))
      originMeta.current = {
        width: bitImage.width,
        height: bitImage.height,
        ratio: bitImage.width / bitImage.height
      }
      const miniBuffer = await minimizeBuffer(buffer)
      setImage(miniBuffer)

      worker.current = new Worker(new URL("../../worker", import.meta.url))
      worker.current.onerror = (e) => {
        console.log(e)
      }
      worker.current.postMessage({
        action: Action.INIT,
        data: buffer
      }, [buffer])
    })()
  }, [])  /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <div className={ style["gallery-container"] }>
      <div className={ style["gallery-main"] }>
        <Stage 
          image={ image } 
          subScale={ subScale } 
        ></Stage>
       
        <ToolBar 
          setImage={ setImage as React.Dispatch<React.SetStateAction<ArrayBuffer>> } 
          processor={ processor.current as Processor }
          pubScale={ pubScale }
          worker={ worker.current as Worker }
        ></ToolBar>
         
        <Download 
          originMeta={ originMeta.current }
          worker={ worker.current as Worker }
        ></Download>
      </div>
    </div>
  )
}


export default Gallery