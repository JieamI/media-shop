import React, { useState } from "react"

// 引用 react 的原生 setStateAction 供 redo 和 undo 使用，避免使用 setImageWrapper 造成的副作用
let pureSetImage: React.Dispatch<React.SetStateAction<ArrayBuffer | undefined>>

// eslint-disable-next-line
// function logHistory() {
//   let cur = historyHead
//   let num = 0
//   while(cur.next) {
//     cur = cur.next
//     num = num + 1
//     console.log(cur)
//   }
//   console.log("current is", currentHistory)
//   console.log("historyNodeLength = ", historyNodeLength, "actually", num)
// }

export function createTracker(MAX_STACK_LENGTH: number) {
  if(MAX_STACK_LENGTH < 2) throw new Error("MAX_STACK_LENGTH 必须大于1！")
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
  const historyHead = currentHistory // historyHead永远指向链表头部
  let historyNodeLength = 0

  const updateNode = (nextState: ArrayBuffer | undefined) => {
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
  }

  const undo = () => {
    if(!currentHistory.pre) return
    currentHistory = currentHistory.pre
    historyNodeLength = historyNodeLength - 1
    return currentHistory.image
  }

  const redo = () => {
    if(!currentHistory.next) return
    currentHistory = currentHistory.next
    return currentHistory.image
  }

  return {
    undo,
    redo,
    updateNode
  }
}

const { undo: pureUndo, redo: pureRedo, updateNode } = createTracker(10)
export function useHistoryImage(): [ArrayBuffer | undefined, React.Dispatch<React.SetStateAction<ArrayBuffer | undefined>>] {
  const [image, setImage] = useState<ArrayBuffer>()
  pureSetImage = setImage // 更新 pureSetImage

  const setImageWrapper = (state: React.SetStateAction<ArrayBuffer | undefined>) => {
    let nextState = typeof state === "function"? state(image): state
    setImage(nextState)
    updateNode(nextState)
  }
  return [image, setImageWrapper]
}

export function undo() {
  const image = pureUndo()
  pureSetImage(image)
}

export function redo() {
  const image = pureRedo()
  pureSetImage(image)
}