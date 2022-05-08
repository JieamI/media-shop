import { createPubSub, Event } from "./createPubSub"

interface ImageMetaData {
  width?: number,
  height?: number
}

export const metaData: ImageMetaData = {}

const { subscribe, publish } = createPubSub()
subscribe(Event.UPDATE_META, buffer => {
  const img = new Image()
  img.onload = () => {
    metaData.width = img.naturalWidth
    metaData.height = img.naturalHeight
  }
  const blob = new Blob([buffer])
  img.src = URL.createObjectURL(blob)
})

export default publish