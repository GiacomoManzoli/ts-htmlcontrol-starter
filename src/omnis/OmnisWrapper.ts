import { OSMessage } from "./interfaces"
import { OmnisCallbackObject } from "./OmnisCallbackObject"

export class JOmnisWrapper {
    jOmnis: JOmnis

    constructor(jOmnis: JOmnis) {
        this.jOmnis = jOmnis

        const callbackObject = new OmnisCallbackObject(this)

        // Imposto il callback object corretto
        const swappableOmnis = jOmnis as JOmnisSwappable
        swappableOmnis.callbackHotSwap(callbackObject)
    }

    /**
     * Wrappa jOmnis.sendControlEvent.
     * @param {String} evName Nome dell'evento, tipicamente ha un prefisso "ev"
     * @param {Object | String} [evData] [OPZIONALE] Dati dell'evento come oggetto o come JSON.stringify
     * @param {Number} [callId] [OPZIONALE] Id della chiamata alla quale risponde l'evento
     * @param {String} [omnisCallbackName] [OPZIONALE] Nome del metodo di callback di Omnis
     */
    sendEvent(evName: string, evData?: string | any, callId?: number, omnisCallbackName?: string) {
        /** 2018.06.29: Aggiunto parametro callId
         * Serve per capire quando effettivamente un metodo richiesto da OMNIS è stato completato, in modo da
         * facilitare la gestione dei vari Working Message.
         * Codice Modifica: 2018.06.29.CID
         */
        console.info(`[jOmnis] sendEvent ${evName}`, evData)
        var message: OSMessage = {
            evType: evName,
            callId: callId && callId !== 0 ? callId : 0
        }
        if (evData) {
            message.data = typeof evData === "string" ? evData : JSON.stringify(evData)
        }
        if (omnisCallbackName) {
            message.callback = omnisCallbackName
        }
        jOmnis.sendControlEvent(message)
    }
}
