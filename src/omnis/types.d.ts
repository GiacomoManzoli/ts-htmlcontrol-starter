declare type JOmnis = {
    sendControlEvent: (arg0: any) => void
    callbackObject: any
}

declare type JOmnisSwappable = JOmnis & { callbackHotSwap: (any) => void }
