import { useRef } from "react"

// export enum Event {
//   UPDATE_META,
//   SCALE,
// }
// const handlerMap = new Map<Event, ((...args: any[]) => any)[]>()
// function subscribe(event: Event, handler: (...args: any[]) => any) {
//   const handlerList = handlerMap.get(event)
//   if(!handlerList) {
//     const list = [handler]
//     handlerMap.set(event, list)
//     return
//   }
//   handlerList.push(handler)
// }

// function publish(event: Event, ...args: any[]) {
//   const handlerList = handlerMap.get(event)
//   if(!handlerList) return
//   handlerList.forEach(handler => {
//     args.length?
//     handler(...args):
//     handler()
//   })
// }


export function usePubSub<U extends Object & { [key: string]: any }>(): [(handler: (arg: any) => any, extras?: U) => () => void, (arg: any) => void] {

  const handlers = useRef<((arg: any) => void)[]>([])
  const states = useRef<U>({} as U)
  
  const subscribeRef = useRef((handler: (arg: any) => any, extras?: U) => {
    if(extras) states.current =  { ...states.current, ...extras }
    if(handlers.current.indexOf(handler) === -1) {
      handlers.current.push(handler)
    }
  
    return function() {
      const index =  handlers.current.indexOf(handler)
      handlers.current.splice(index, 1)
      if(extras) {
        Object.keys(extras).forEach((key) => {
          if(states.current.hasOwnProperty(key)) {
            delete states.current[key]
          }
        })
      }
    }
  })
  const publishRef = useRef((arg: any) => {
    let resultArgs = arg
    if(typeof arg === "function") {
      resultArgs = arg(states.current)
    }
    handlers.current.forEach(handler => {
      // resultArgs.length === handler.length &&
      handler(resultArgs)
    })
  })
  return [subscribeRef.current, publishRef.current]
}