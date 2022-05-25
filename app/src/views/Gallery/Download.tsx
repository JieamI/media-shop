import { Encoding } from "media-shop"
import { BaseSyntheticEvent, useEffect, useState } from "react"
import showError from "../../hooks/useError"
import showLoading from "../../hooks/useLoading"
import { Action } from "../../share/dispatcher"
import style from '../../styles/gallery.module.scss'

function Download({
  worker,
  originMeta
}: {
  worker: Worker,
  originMeta: { width: number, height: number, ratio: number } | undefined
}) {
  console.log("download")

  const [width, setWidth] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [format, setFormat] = useState<string>("PNG")
  const [isLock, setIsLock] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  useEffect(() => {
    if(!originMeta) return
    setWidth(originMeta.width.toFixed())
    setHeight(originMeta.height.toFixed())
  }, [originMeta])
  
  const setEditMode = () => {
    setIsEditMode(!isEditMode)
  }
  const setLock = () => {
    if(!isLock && originMeta) {
      setWidth(originMeta.width.toFixed())
      setHeight(originMeta.height.toFixed())
    }
    setIsLock(!isLock)
  }

  const onWidthChange = (e: BaseSyntheticEvent) => {
    const value: string = e.currentTarget.value
    setWidth(value)
    if(!isLock || !originMeta) return

    const ratio = originMeta.ratio
    setHeight((parseInt(value) / ratio).toFixed())
    
  }

  const onHeightChange = (e: BaseSyntheticEvent) => {
    const value: string = e.currentTarget.value
    setHeight(value)
    if(!isLock || !originMeta) return
    
    const ratio = originMeta.ratio
    setWidth((ratio * parseInt(value)).toFixed())
  }

  const onFormatChange = (e: BaseSyntheticEvent) => {
    setFormat(e.currentTarget.value)
  }

  const handleDownload = () => {
    worker.postMessage({
      action: Action.DOWNLOAD
    })
    showLoading(async () => {
      const promise = new Promise<ArrayBuffer>((resolve, _) => {
        worker.onmessage = (e: MessageEvent) => {
          resolve(e.data)
        }
      })
      // 预处理
      // let buffer: ArrayBuffer = image as ArrayBuffer
      const curWidth = parseInt(width)
      const curHeight = parseInt(height)
      const originWidth = (originMeta as { width: number, height: number }).width
      const originHeight = (originMeta as { width: number, height: number }).height
      if(curWidth !== originWidth || curHeight !== originHeight) {
        // buffer = processor.resize(new Uint8Array(buffer), curWidth, curHeight)
        worker.postMessage({
          action: Action.RESIZE,
          data: { width: curWidth, height: curHeight }
        })
      }
      if(format !== "PNG") {
        let encoding: Encoding
        switch(format) {
          case "PNG": encoding = Encoding.PNG;break;
          case "JPEG": encoding = Encoding.JPEG;break;
          case "BMP": encoding = Encoding.BMP;break;
          case "ICO": encoding = Encoding.ICO;break;
          default: encoding = Encoding.PNG;
        }
        if(encoding === Encoding.ICO && (curWidth > 256 || curHeight > 256)) {
          showError("ICON文件宽高均不得超过256px!", 3000)
          return
        }
        // buffer = processor.convert_format(new Uint8Array(buffer), encoding)
        worker.postMessage({
          action: Action.CVTFMT,
          data: encoding
        })
      }
      worker.postMessage({
        action: Action.RETRIEVE
      })
      const buffer = await promise
      console.log(buffer)
      const el = document.createElement("a")
      const blob = new Blob([buffer])
      el.href = URL.createObjectURL(blob)
      el.download = `picture_by_ms.${format.toLowerCase()}`
      el.click() 
    })
  }
  return (
    <div className={ style["download-container"] }>
      <div className={ style["download-button"] } onClick={ setEditMode }>
        <i className="iconfont icon-a-fengmianxiazaizhutixiazaibeijingxiazaisuopingxiazai"></i>
      </div>
      <div className={ style["download-form"] } style={ !isEditMode? { opacity: 0 }: { opacity: 1 } }>
        <div className={ style["download-item"] }>
          <input type="number" value={ width } id="width-input" placeholder="宽度" onChange={ onWidthChange }></input>
        </div>

        <i className="iconfont icon-suoding" style={ isLock? { color: "#1296db" }: { color: "gray" }} onClick={ setLock }></i>

        <div className={ style["download-item"] }>
          <input type="number" value={ height } id="height-input" placeholder="高度" onChange={ onHeightChange }></input>
        </div>
        <div className={ style["download-item"] }>
          <select id="format-select" value={ format } onChange={ onFormatChange }>
            <option>PNG</option>
            <option>JPEG</option>
            <option>BMP</option>
            <option>ICO</option>
          </select>
        </div>
        <div className={ style["download-item"] }>
          <button onClick={ handleDownload }>下载</button>
        </div>
      </div>
    </div>
  )
}

export default Download