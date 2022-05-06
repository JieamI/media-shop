import style from "../../styles/gallery.module.scss"
import type { Processor } from "media-shop"
import { undo, redo } from "../../utils"

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

  return (
    <div className={ style["toolbar-container"] }>
      <i className="iconfont icon-xiangzuoxuanzhuan" onClick={ rotateLeft }></i>
      <i className="iconfont icon-xiangyouxuanzhuan" onClick={ rotateRight }></i>
      <i className="iconfont icon-fengmian-tupianbianji-chehui" onClick={ handleUndo }></i>
      <i className="iconfont icon-zhongzuo" onClick={ handleRedo }></i>
    </div>
  )
}

export default ToolBar