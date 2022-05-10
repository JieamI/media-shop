import Stage from "./Stage"
import style from '../../styles/gallery.module.scss'
import ToolBar from "./ToolBar"
import { useLocation, useNavigate  } from "react-router-dom"
import React, { useEffect, useRef } from "react"
import init, { Processor } from 'media-shop'
import { useHistoryImage } from "../../hooks/useHistoryImage"
import { usePubSub } from "../../hooks/usePubSub"



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
      setImage(buffer)
    })()
  }, [])  /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <div className={ style["gallery-container"] }>
      <div className={ style["gallery-main"] }>
        <Stage 
          image={ image as ArrayBuffer } 
          subScale={ subScale } 
        ></Stage>
       
        <ToolBar 
          setImage={ setImage as React.Dispatch<React.SetStateAction<ArrayBuffer>> } 
          processor={ processor.current as Processor }
          pubScale={ pubScale }
        ></ToolBar>
         
       
      </div>
    </div>
  )
}


export default Gallery