import { JOmnisWrapper } from "./OmnisWrapper"

const TAG = "OM_INT"

export class OmnisCallbackObject {
    public jOmnisWrapper: JOmnisWrapper

    constructor(jOmnisWrapper: JOmnisWrapper) {
        this.jOmnisWrapper = jOmnisWrapper
    }

    omnisOnLoad() {
        console.info(`${TAG} Omnis interface loaded. Waiting for the communication link...`)
    }

    omnisOnWebSocketOpened() {
        console.info(`${TAG} web socket opened`)
        this.jOmnisWrapper.sendEvent("ev_Ready")
    }

    omnisSetData(params) {
        console.log("omnisSetData", params)
    }

    omnisGetData(params) {
        console.log("omnisGetData", params)
    }
}
