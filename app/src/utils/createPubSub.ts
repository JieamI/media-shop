export enum Event {
  UPDATE_META,
}

export function createPubSub() {
  const handlerMap = new Map<Event, ((buffer: ArrayBuffer) => void)[]>()
  function subscribe(event: Event, handler: (buffer: ArrayBuffer) => void) {
    const handlerList = handlerMap.get(event)
    if(!handlerList) {
      const list = [handler]
      handlerMap.set(event, list)
    }
    handlerList?.push(handler)
  }
  function publish(event: Event, buffer: ArrayBuffer) {
    const handlerList = handlerMap.get(event)
    if(!handlerList) return
    handlerList.forEach(handler => {
      handler(buffer)
    })
  }
  return { subscribe, publish }
}