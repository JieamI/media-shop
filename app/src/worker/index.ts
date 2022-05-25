import { createTracker } from '../hooks/useHistoryImage'
import init, { Processor, Encoding } from 'media-shop'
import { Action } from '../share/dispatcher'

let image: ArrayBuffer
let downloadImage: ArrayBuffer
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
      image = undo() as ArrayBuffer
    }
  ], [
    Action.REDO,
    () => {
      image = redo() as ArrayBuffer
    },
  ], [
    Action.ROTATE90,
    () => {
      image = processor.rotate_clock(new Uint8Array(image)).buffer
      updateNode(image)
    }
  ], [
    Action.ROTATE270, () => {
      image = processor.rotate_anticlock(new Uint8Array(image)).buffer
      updateNode(image)
    }
  ], [
    Action.HORIZONTALFLIP,
    () => {
      image = processor.flip_horizontal(new Uint8Array(image)).buffer
      updateNode(image)
    }
  ], [
    Action.VERTICALFLIP,
    () => {
      image = processor.flip_vertical(new Uint8Array(image)).buffer
      updateNode(image)
    }
  ], [
    Action.BLUR,
    (sigma: number) => {
      image = processor.blur(new Uint8Array(image), sigma).buffer
      updateNode(image)
    }
  ], [
    Action.BRIGHTEN,
    (value: number) => {
      image = processor.brighten(new Uint8Array(image), value).buffer
      updateNode(image)
    }
  ], [
    Action.CONTRAST,
    (value: number) => {
      image = processor.contrast(new Uint8Array(image), value).buffer
      updateNode(image)
    }
  ], [
    Action.INVERT,
    () => {
      image = processor.invert(new Uint8Array(image)).buffer
      updateNode(image)
    }
  ], [
    Action.BINARIZE,
    (threshold: number) => {
      image = processor.binarize(new Uint8Array(image), threshold).buffer
      updateNode(image)
    }
  ], [
    Action.HUEROTATE,
    (angle: number) => {
      image = processor.hue_rotate(new Uint8Array(image), angle).buffer
      updateNode(image)
    }
  ], [
    Action.GRAYSCALE,
    () => {
      image = processor.grayscale(new Uint8Array(image)).buffer
      updateNode(image)
    }
  ], [
    Action.DOWNLOAD,
    () => {
      downloadImage = image
    }
  ], [
    Action.RESIZE, 
    ({width, height}) => {
      downloadImage = processor.resize(new Uint8Array(downloadImage), width, height).buffer
    }
  ], [
    Action.CVTFMT,
    (encoding: Encoding) => {
      downloadImage = processor.convert_format(new Uint8Array(downloadImage), encoding).buffer
    }
  ], [
    Action.RETRIEVE,
    () => {
      postMessage(downloadImage)
    }
  ],
])

onmessage = (e: MessageEvent) => {
  const { action, data } = e.data
  console.log(`receive action ${action} \n receive data ${data}`)
  const handler = actionMap.get(action)
  if(!handler) return
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