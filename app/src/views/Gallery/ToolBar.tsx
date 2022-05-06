import style from "../../styles/gallery.module.scss"
import type { Processor } from "media-shop"

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

  return (
    <div className={ style["toolbar-container"] }>
      <i className="iconfont icon-xiangzuoxuanzhuan" onClick={ rotateLeft }></i>
      <i className="iconfont icon-xiangyouxuanzhuan" onClick={ rotateRight }></i>
      <i className="iconfont icon-fengmian-tupianbianji-chehui"></i>
      <i className="iconfont icon-zhongzuo"></i>
    </div>
  )
}

export default ToolBar