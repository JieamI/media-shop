import { useRef, useState } from "react"


const traceEditMode: [React.Dispatch<React.SetStateAction<string>>, string][] = []

export function useRangeInput(
  DEFAULT_ICON: string,
  OK_ICON: string
): [string, string, React.MutableRefObject<HTMLInputElement | null>, () => number | undefined] {
  const [inputDisplay, setInputDisplay] = useState("none")
  const [icon, setIcon] = useState(DEFAULT_ICON)
  const rangeDom = useRef<HTMLInputElement>(null)
  
  const baseHandler = () => {
    let value = undefined 
    const isEditMode = inputDisplay === "none"
    if(isEditMode) {
      // 开始编辑模式
      // 关闭其他图标的编辑模式
      traceEditMode.forEach(([setter, args]) => {
        setter(args)
      })
      traceEditMode.splice(0, traceEditMode.length)
      setInputDisplay("initial")
      setIcon(OK_ICON)
      traceEditMode.push([setInputDisplay, "none"], [setIcon, DEFAULT_ICON])
    }else {
      // 完成编辑
      setInputDisplay("none")
      setIcon(DEFAULT_ICON);
      value = parseInt((rangeDom.current as unknown as HTMLInputElement).value)
    }
    return value
  }
  return [
    inputDisplay,
    icon,
    rangeDom,
    baseHandler
  ]
}


