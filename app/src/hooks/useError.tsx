// import React, { useRef } from "react";
// import { useEffect, useState } from "react"
// import ReactDOM from "react-dom"
import ReactDom from 'react-dom/client'
import style from "../styles/common.module.scss";

function showError(message: string, duration: number) {
  const div = document.createElement("div")
  document.body.appendChild(div)
  const root = ReactDom.createRoot(div)

  setTimeout(() => {
    root.unmount()
    document.body.removeChild(div)
  }, duration)
  root.render(
    <div className={ style["error-container"] }>
      <i className="iconfont icon-cuowu"></i>
      <span>{ message }</span>
    </div>
  )
}

export default showError

// function useError(message: string, duration: number) {
//   let setShowing: React.MutableRefObject<React.Dispatch<React.SetStateAction<boolean>> | undefined> = useRef()
//   const showError = () => {
//     if(!setShowing.current) throw new Error("必须将Error组件放置于组件树中")
//     setShowing.current(true)
//   }
//   const ErrorComponent = useRef(React.memo(() => {
//     console.log("error")
//     const [isShowing, setIsShowing] = useState(false)
//     setShowing.current = setIsShowing
//     useEffect(() => {
//       if(isShowing) {
//         setTimeout(() => {
//           setIsShowing(false)
//         }, duration)
//       }
//     }, [isShowing])
    
//     return ReactDOM.createPortal((
//       <div className={ style["error-container"] } style={ !isShowing? { display: "none" }: {}}>
//         <i className="iconfont icon-cuowu"></i>
//         <span>{ message }</span>
//       </div>
//     ), document.getElementById("root") as HTMLElement)
    
//   }))
//   return { showError, ErrorComponent: ErrorComponent.current }
// }
// export default useError