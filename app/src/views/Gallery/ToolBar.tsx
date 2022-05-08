import style from "../../styles/gallery.module.scss"
import type { Processor } from "media-shop"
import { undo, redo } from "../../utils/useHistoryImage"
import { metaData } from "../../utils/useImageMeta"

function ToolBar({ 
  setImage, 
  processor 
}: { 
  setImage: React.Dispatch<React.SetStateAction<ArrayBuffer>>,
  processor: React.MutableRefObject<Processor>
}) {
  console.log("toolbar")
  const rotateLeft = () => {
    setImage(img => {
      const array = processor.current.rotate_anticlock(new Uint8Array(img))
      return array.buffer
    })
  }
  const rotateRight = () => {
    setImage(img => {
      const array = processor.current.rotate_clock(new Uint8Array(img))
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
    const currentWidth = metaData.width as number
    const currentHeight = metaData.height as number
    setImage(img => {
      const array = processor.current.resize(new Uint8Array(img), currentWidth * 2, currentHeight * 2)
      return array.buffer
    })
  }

  const handleNarrow = () => {
    const currentWidth = metaData.width as number
    const currentHeight = metaData.height as number
    setImage(img => {
      const array = processor.current.resize(new Uint8Array(img), currentWidth * 0.5, currentHeight * 0.5)
      return array.buffer
    })
  }

  const horizontalFlip = () => {
    setImage(img => {
      const array = processor.current.flip_horizontal(new Uint8Array(img))
      return array.buffer
    })
  }

  const verticalFlip = () => {
    setImage(img => {
      const array = processor.current.flip_vertical(new Uint8Array(img))
      return array.buffer
    })
  }

  const handleGrayScale = () => {
    setImage(img => {
      const array = processor.current.grayscale(new Uint8Array(img))
      return array.buffer
    })
  }

  const handleBinarize = () => {
    setImage(img => {
      const array = processor.current.binarize(new Uint8Array(img), 127)
      return array.buffer
    })
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

      <i className="iconfont icon-fengmian-tupianbianji-chehui" onClick={ handleUndo }></i>
      <i className="iconfont icon-zhongzuo" onClick={ handleRedo }></i>
    </div>
  )
}

export default ToolBar