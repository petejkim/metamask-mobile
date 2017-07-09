export type PortListener = (data: any) => void

export interface Port {
  id?: string
  name: string

  sender?: {
    url: string
  }

  onDisconnect: {
    addListener: (listener: PortListener) => void
  }

  onMessage: {
    addListener: (listener: PortListener) => void
  }

  postMessage: (message: any) => void
}

export interface ConnectEvent extends Event {
  detail: {
    id: string
    name: string
    url: string
  }
}

export interface MessageEvent extends Event {
  detail: {
    id: string
    data: any
  }
}
