// import React from "react"
// import { useRef, useState } from "react"
// import ReactDOM from "react-dom"
import ReactDom from 'react-dom/client'
import style from '../styles/common.module.scss'

function showLoading() {
  const div = document.createElement("div")
  document.body.appendChild(div)
  const root = ReactDom.createRoot(div)

  root.render(
    <div className={ style["loading-container"] }>
      <i className="iconfont icon-jiazaizhong"></i>
    </div>
  )
  return () => {
    root.unmount()
    document.body.removeChild(div)
  }
}

export default showLoading

// function useLoading() {
//   let setShowing: React.MutableRefObject<React.Dispatch<React.SetStateAction<boolean>> | undefined> = useRef()
//   const showLoading = () => {
//     if(!setShowing.current) throw new Error("必须将Loading组件放置于组件树中")
//     setShowing.current(true)
//   }
//   const cancelLoading = () => {
//     if(!setShowing.current) throw new Error("必须将Loading组件放置于组件树中")
//     setShowing.current(false)
//   }
//   const Loading = React.memo(() => {
//     const [isShowing, setIsShowing] = useState(false)    
//     setShowing.current = setIsShowing
    
//     return ReactDOM.createPortal(
//       (
//         <div className={ style["loading-container"] } style={ !isShowing? { display: "none" }: {}}>
//           <i className="iconfont icon-jiazaizhong"></i>
//         </div>
//       ),
//       document.getElementById("root") as HTMLElement
//     )
//   })

  // return { showLoading, cancelLoading, Loading }
// }
// export default useLoading


