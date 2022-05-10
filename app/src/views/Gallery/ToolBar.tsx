import style from "../../styles/gallery.module.scss"
import type { Processor } from "media-shop"
import { undo, redo } from "../../utils/useHistoryImage"
import { useRef, useState } from "react"

function ToolBar({ 
  setImage, 
  processor,
  pubScale,
}: { 
  setImage: React.Dispatch<React.SetStateAction<ArrayBuffer>>,
  processor: Processor,
  pubScale: (arg: any) => void,
}) {
  console.log("toolbar")
  const rotateLeft = () => {
    setImage(img => {
      const array = processor.rotate_anticlock(new Uint8Array(img))
      return array.buffer
    })
  }
  const rotateRight = () => {
    setImage(img => {
      const array = processor.rotate_clock(new Uint8Array(img))
      return array.buffer
    })
  }

  const handleUndo = () => {
    undo()
  }
  const handleRedo = () => {
    redo()
  }

  const handleEnlarge = () => {
    // const currentWidth = metaData.width as number
    // const currentHeight = metaData.height as number
    // setImage(img => {
    //   console.log(currentWidth * 4, currentHeight * 4)
    //   console.time("enlarge")
    //   const array = processor.current.resize(new Uint8Array(img), currentWidth * 4, currentHeight * 4)
    //   console.timeEnd("enlarge")
    //   return array.buffer
    // })
    pubScale(({ curScale }: { curScale: number }) => curScale + 0.1)
  }

  const handleNarrow = () => {
    pubScale(({ curScale }: { curScale: number }) => curScale - 0.1)
  }

  const horizontalFlip = () => {
    setImage(img => {
      const array = processor.flip_horizontal(new Uint8Array(img))
      return array.buffer
    })
  }

  const verticalFlip = () => {
    setImage(img => {
      const array = processor.flip_vertical(new Uint8Array(img))
      return array.buffer
    })
  }

  const handleGrayScale = () => {
    setImage(img => {
      const array = processor.grayscale(new Uint8Array(img))
      return array.buffer
    })
  }

  const handleBinarize = () => {
    setImage(img => {
      const array = processor.binarize(new Uint8Array(img), 127)
      return array.buffer
    })
  }

  const handleInvert = () => {
    setImage(img => {
      const array = processor.invert(new Uint8Array(img))
      return array.buffer
    })
  }

  const DEFAULT_HUE_ICON = "icon-icon_effects_filters_type_hue_rotate"
  const OK_ICON = "icon-ic_ok"
  const [hueInputDisplay, setHueInputDisplay] = useState("none")
  const [hueIcon, setHueIcon] = useState(DEFAULT_HUE_ICON)
  const hueRange = useRef(null)
  const handleHueRotate = () => {
    const isEditMode = hueInputDisplay === "none"
    if(isEditMode) {
      // 开始编辑模式
      setBlurInputDisplay("none")
      setBlurIcon(DEFAULT_BLUR_ICON)
      setHueInputDisplay("initial")
      setHueIcon(OK_ICON)
      
    }else {
      // 完成编辑
      setHueInputDisplay("none")
      setHueIcon(DEFAULT_HUE_ICON);
      const value = parseInt((hueRange.current as unknown as HTMLInputElement).value)
      console.log(value)
      setImage(img => {
        const array = processor.hue_rotate(new Uint8Array(img), value)
        return array.buffer
      })
    }
  }

  const DEFAULT_BLUR_ICON = "icon-tuxiangmohu"
  const [blurInputDisplay, setBlurInputDisplay] = useState("none")
  const [blurIcon, setBlurIcon] = useState(DEFAULT_BLUR_ICON)
  const blurRange = useRef(null)
  const handleBlur = () => {
    const isEditMode = blurInputDisplay === "none"
    if(isEditMode) {
      // 开始编辑模式
      setHueInputDisplay("none")
      setHueIcon(DEFAULT_HUE_ICON)
      setBlurInputDisplay("initial")
      setBlurIcon(OK_ICON)
      
    }else {
      // 完成编辑
      setBlurInputDisplay("none")
      setBlurIcon(DEFAULT_BLUR_ICON);
      const value = parseInt((blurRange.current as unknown as HTMLInputElement).value)
      console.log(value)
      setImage(img => {
        const array = processor.blur(new Uint8Array(img), value)
        return array.buffer
      })
    }
  }

  return (
    <div className={ style["toolbar-container"] }>
      <i className="iconfont icon-xiangzuoxuanzhuan" onClick={ rotateLeft }></i>
      <i className="iconfont icon-xiangyouxuanzhuan" onClick={ rotateRight }></i>
      <i className="iconfont icon-tuxiangfangda" onClick={ handleEnlarge }></i>
      <i className="iconfont icon-tuxiangsuoxiao" onClick={ handleNarrow }></i>
      <i className="iconfont icon-shuipingfanzhuan" onClick={ horizontalFlip }></i>
      <i className="iconfont icon-chuizhifanzhuan" onClick={ verticalFlip }></i>
      <i className="iconfont icon-huidu-01" onClick={ handleGrayScale }></i>
      <i className="iconfont icon-biaoqianerzhihua" onClick={ handleBinarize }></i>
      <i className="iconfont icon-invert" onClick={ handleInvert }></i>
      <i className={ `iconfont ${ hueIcon } ${style["toolbar-hue-icon"]}` } onClick={ handleHueRotate }>
        <input 
          ref={ hueRange }
          type="range" 
          className={ style["range"] } 
          defaultValue="180"
          min="0" 
          max="360" 
          onClick={(e) => {e.stopPropagation()}} 
          style={ { display: hueInputDisplay } }
        ></input>
      </i>
      <i className={ `iconfont ${ blurIcon } ${style["toolbar-blur-icon"]}`} onClick={ handleBlur }>
        <input 
          ref={ blurRange }
          type="range" 
          className={ style["range"] } 
          defaultValue="25"
          min="0" 
          max="50" 
          onClick={(e) => {e.stopPropagation()}} 
          style={ { display: blurInputDisplay } }
        ></input>
      </i>

      <i className="iconfont icon-fengmian-tupianbianji-chehui" onClick={ handleUndo }></i>
      <i className="iconfont icon-zhongzuo" onClick={ handleRedo }></i>
    </div>
  )
}

export default ToolBar