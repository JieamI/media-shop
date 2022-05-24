import { createTracker } from '../hooks/useHistoryImage'
import init, { Processor, Encoding } from 'media-shop'
import { Action } from '../share/dispatcher'

let image: ArrayBuffer
let processor: Processor
const taskQueue: ((...args: any[]) => void)[] = []

const { redo, undo, updateNode } = createTracker(10)

const actionMap = new Map<Action, (...args: any[]) => void>([
  [
    Action.INIT, 
    (buffer: ArrayBuffer) => {
      image = buffer
      updateNode(image)
      init().then(() => {
        processor = new Processor()
      })
    }
  ],[
    Action.UNDO,
    () => {
      console.log("undo")
      image = undo() as ArrayBuffer
    }
  ], [
    Action.REDO,
    () => {
      console.log("redo")
      image = redo() as ArrayBuffer
    },
  ], [
    Action.ROTATE90,
    () => {
      console.log("rotate90")
      image = processor.rotate_clock(new Uint8Array(image))
      updateNode(image)
    }
  ], [
    Action.ROTATE270, () => {
      console.log("rotate270")
      image = processor.rotate_anticlock(new Uint8Array(image))
      updateNode(image)
    }
  ], [
    Action.RESIZE, 
    ({width, height}) => {
      console.log("resize")
      image = processor.resize(new Uint8Array(image), width, height)
    }
  ], [
    Action.CVTFMT,
    (encoding: Encoding) => {
      console.log("cvtfmt")
      image = processor.convert_format(new Uint8Array(image), encoding)
    }
  ], [
    Action.RETRIEVE,
    () => {
      console.log("retreive")
      // postMessage(image, [image])
      postMessage(image)
    }
  ]
])

onmessage = (e: MessageEvent) => {
  const { action, data } = e.data
  console.log(`receive action ${action} \n receive data ${data}`)
  const handler = actionMap.get(action)
  if(!handler) return
  // handler(data)
  const handlerWrapper = handler.bind(null, data)
  Object.defineProperty(handlerWrapper, "action", {
    value: action,
    writable: false
  })
  taskQueue.push(handlerWrapper)
}

function main() {
  const handler = taskQueue.shift()
  if(handler) {
    console.log(`start execute ${Object.getOwnPropertyDescriptor(handler, "action")?.value}`)
    handler()
  }
  setTimeout(main, 0)
}
main()


export {}