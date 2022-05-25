import style from "../../styles/gallery.module.scss"
import type { Processor } from "media-shop"
import { undo, redo } from "../../hooks/useHistoryImage"
import { useRangeInput } from "../../hooks/useRangeInput"
import { Action } from "../../share/dispatcher"

function ToolBar({ 
  setImage, 
  processor,
  pubScale,
  worker
}: { 
  setImage: React.Dispatch<React.SetStateAction<ArrayBuffer>>,
  processor: Processor,
  pubScale: (arg: any) => void,
  worker: Worker
}) {
  console.log("toolbar")
  const rotateLeft = () => {
    worker.postMessage({
      action: Action.ROTATE270
    })
    setImage(img => {
      const array = processor.rotate_anticlock(new Uint8Array(img))
      return array.buffer
    })
  }

  const rotateRight = () => {
    worker.postMessage({
      action: Action.ROTATE90
    })
    setImage(img => {
      const array = processor.rotate_clock(new Uint8Array(img))
      return array.buffer
    })
  }

  const handleUndo = () => {
    worker.postMessage({
      action: Action.UNDO
    })
    undo()
  }
  const handleRedo = () => {
    worker.postMessage({
      action: Action.REDO
    })
    redo()
  }

  const handleEnlarge = () => {
    pubScale(({ curScale }: { curScale: number }) => curScale + 0.1)
  }

  const handleNarrow = () => {
    pubScale(({ curScale }: { curScale: number }) => curScale - 0.1)
  }

  const horizontalFlip = () => {
    worker.postMessage({
      action: Action.HORIZONTALFLIP
    })
    setImage(img => {
      const array = processor.flip_horizontal(new Uint8Array(img))
      return array.buffer
    })
  }

  const verticalFlip = () => {
    worker.postMessage({
      action: Action.VERTICALFLIP
    })
    setImage(img => {
      const array = processor.flip_vertical(new Uint8Array(img))
      return array.buffer
    })
  }

  const handleGrayScale = () => {
    worker.postMessage({
      action: Action.GRAYSCALE
    })
    setImage(img => {
      const array = processor.grayscale(new Uint8Array(img))
      return array.buffer
    })
  }

  const handleBinarize = () => {
    worker.postMessage({
      action: Action.BINARIZE,
      data: 127
    })
    setImage(img => {
      const array = processor.binarize(new Uint8Array(img), 127)
      return array.buffer
    })
  }

  const handleInvert = () => {
    worker.postMessage({
      action: Action.INVERT
    })
    setImage(img => {
      const array = processor.invert(new Uint8Array(img))
      return array.buffer
    })
  }

  const DEFAULT_HUE_ICON = "icon-icon_effects_filters_type_hue_rotate"
  const OK_ICON = "icon-ic_ok"
  const [hueInputDisplay, hueIcon, hueRangeDom, baseHueHandler] = useRangeInput(DEFAULT_HUE_ICON, OK_ICON)
  const handleHueRotate = () => {
    const value = baseHueHandler()
    if(value) {
      worker.postMessage({
        action: Action.HUEROTATE,
        data: value
      })
      setImage(img => {
        const array = processor.hue_rotate(new Uint8Array(img), value)
        return array.buffer
      })
    }
  }

  const DEFAULT_BLUR_ICON = "icon-a-zhuangtaituxiangmohu"
  const [blurInputDisplay, blurIcon, blurRangeDom, baseBlurHandler] = useRangeInput(DEFAULT_BLUR_ICON, OK_ICON)
  const handleBlur = () => {
    const value = baseBlurHandler()
    if(value) {
      worker.postMessage({
        action: Action.BLUR,
        data: value
      })
      setImage(img => {
        const array = processor.blur(new Uint8Array(img), value)
        return array.buffer
      })
    }
  }

  const DEFAULT_BRIGHTEN_ICON = "icon-liangdu-"
  const [brightenInputDisplay, brightenIcon, brightenRangeDom, baseBrightenHandler] = useRangeInput(DEFAULT_BRIGHTEN_ICON, OK_ICON)
  const handleBrighten = () => {
    const value = baseBrightenHandler()
    if(value) {
      worker.postMessage({
        action: Action.BRIGHTEN,
        data: value
      })
      setImage(img => {
        const array = processor.brighten(new Uint8Array(img), value)
        return array.buffer
      })
    }
  }

  const DEFAULT_CONTRAST_ICON = "icon-shishishipin_duibidu"
  const [contrastInputDisplay, contrastIcon, contrastRangeDom, baseContrastHandler] = useRangeInput(DEFAULT_CONTRAST_ICON, OK_ICON)
  const handleContrast = () => {
    const value = baseContrastHandler()
    if(value) {
      worker.postMessage({
        action: Action.CONTRAST,
        data: value
      })
      setImage(img => {
        const array = processor.contrast(new Uint8Array(img), value)
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
     
      <i className={ `iconfont ${ hueIcon } ${style["toolbar-hue-icon"]}` } onClick={ handleHueRotate }>
        <input 
          ref={ hueRangeDom }
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
          ref={ blurRangeDom }
          type="range" 
          className={ style["range"] } 
          defaultValue="25"
          min="0" 
          max="50" 
          onClick={(e) => {e.stopPropagation()}} 
          style={ { display: blurInputDisplay } }
        ></input>
      </i>
      <i className={ `iconfont ${ brightenIcon } ${style["toolbar-brighten-icon"]}`} onClick={ handleBrighten }>
        <input 
          ref={ brightenRangeDom }
          type="range" 
          className={ style["range"] } 
          defaultValue="0"
          min="-200" 
          max="200" 
          onClick={(e) => {e.stopPropagation()}} 
          style={ { display: brightenInputDisplay } }
        ></input>
      </i>
      <i className={ `iconfont ${ contrastIcon } ${style["toolbar-contrast-icon"]}`} onClick={ handleContrast }>
        <input 
          ref={ contrastRangeDom }
          type="range" 
          className={ style["range"] } 
          defaultValue="0"
          min="-100" 
          max="100" 
          onClick={(e) => {e.stopPropagation()}} 
          style={ { display: contrastInputDisplay } }
        ></input>
      </i>
      <i className="iconfont icon-invert" onClick={ handleInvert }></i>
      <i className="iconfont icon-fengmian-tupianbianji-chehui" onClick={ handleUndo }></i>
      <i className="iconfont icon-zhongzuo" onClick={ handleRedo }></i>
    </div>
  )
}

export default ToolBar