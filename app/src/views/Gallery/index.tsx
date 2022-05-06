import Stage from "./Stage"
import style from '../../styles/gallery.module.scss'
import ToolBar from "./ToolBar"
import { useLocation, useNavigate  } from "react-router-dom"
import React, { useEffect, useMemo, useRef } from "react"
import init, { Encoding, Processor } from 'media-shop'
import { useHistoryImage } from "../../utils"



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
 
  // const [image, setImage] = useState<ArrayBuffer>()
  const [image, setImage] = useHistoryImage()
  const processor = useRef<Processor | null>(null)


  useEffect(() => {
    if(!file) {
      navigate("/home")
      return
    }
    (async function() {
      await init()
      processor.current = new Processor(Encoding.PNG)
      const buffer = await file.arrayBuffer()
      setImage(buffer)
    })()
  }, [])  /* eslint-disable-line react-hooks/exhaustive-deps */

  // const processor = useRef<Processor | null>(null)
  // useEffect(() => {
  //   processor.current = new Processor(Encoding.PNG)
  // }, [])
 
  return (
    <div className={ style["gallery-container"] }>
      <div className={ style["gallery-main"] }>
        <Stage image={ image as ArrayBuffer }></Stage>
        {
          useMemo(() => (
            <ToolBar 
              setImage={ setImage as React.Dispatch<React.SetStateAction<ArrayBuffer>> } 
              processor={ processor as React.MutableRefObject<Processor> }
            ></ToolBar>
          ), [setImage])
        }
      </div>
    </div>
  )
}


export default Gallery