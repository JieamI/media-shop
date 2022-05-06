import React, { useState } from "react"


const MAX_STACK_LENGTH: number = 10

if(MAX_STACK_LENGTH < 2) throw new Error("MAX_STACK_LENGTH 必须大于1！")
// const historyStack: ArrayBuffer[] = new Array(MAX_STACK_LENGTH)
// const redoStack: ArrayBuffer[] = new Array(MAX_STACK_LENGTH)
// const flags = {
//   shouldStack: true
// }
type historyNode = {
  pre: historyNode | null,
  next: historyNode | null,
  image: ArrayBuffer | undefined,
}
let currentHistory: historyNode = {
  next: null,
  pre: null,
  image: undefined
}
let historyHead = currentHistory // historyHead永远指向链表头部
let historyNodeLength = 0

// 引用 react 的原生 setStateAction 供 redo 和 undo 使用，避免使用 setImageWrapper 造成的副作用
let pureSetImage: React.Dispatch<React.SetStateAction<ArrayBuffer | undefined>>

function logHistory() {
  let cur = historyHead
  let num = 0
  while(cur.next) {
    cur = cur.next
    num = num + 1
    console.log(cur)
  }
  console.log("current is", currentHistory)
  console.log("historyNodeLength = ", historyNodeLength, "actually", num)
}

export function useHistoryImage(): [ArrayBuffer | undefined, React.Dispatch<React.SetStateAction<ArrayBuffer | undefined>>] {
  const [image, setImage] = useState<ArrayBuffer>()
  // console.log(image)
  
  pureSetImage = setImage // 更新 pureSetImage
  const setImageWrapper = (state: React.SetStateAction<ArrayBuffer | undefined>) => {
    let nextState = typeof state === "function"? state(image): state
    setImage(nextState)
    // if(!flags.shouldStack) return
    // if(historyStack.length === MAX_STACK_LENGTH) {
    //   historyStack.shift()
    // }
    if(historyNodeLength === MAX_STACK_LENGTH) {
      console.log("up to max!!!!!!!!")
      // 移除第一个节点，即 historyHead.next
      const firstNode = historyHead.next as historyNode // 在MAX_STACK_LENGTH > 1 的前提下可以作此断言
      const secondNode = firstNode.next as historyNode
      firstNode.next = null
      firstNode.pre = null  
      historyHead.next = secondNode
      secondNode.pre = null
    }
    if(currentHistory.next) {
      currentHistory.next.pre = null
      currentHistory.next = null
    }
    currentHistory.next = {
      image: nextState,
      next: null,
      pre: currentHistory === historyHead? null: currentHistory,
    }
    currentHistory = currentHistory.next

    !(historyNodeLength === MAX_STACK_LENGTH) && 
    (historyNodeLength = historyNodeLength + 1)
    console.log("setImageWrapper")
    logHistory()
  }
  return [image, setImageWrapper]
}

export function undo() {
  if(!currentHistory.pre) return
  currentHistory = currentHistory.pre
  pureSetImage(currentHistory.image)
  historyNodeLength = historyNodeLength - 1

  console.log("undo")
  logHistory()
}

export function redo() {
  if(!currentHistory.next) return
  currentHistory = currentHistory.next
  pureSetImage(currentHistory.image)

  console.log("redo")
  logHistory()
}