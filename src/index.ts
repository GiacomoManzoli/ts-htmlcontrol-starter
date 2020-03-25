import { JOmnisWrapper } from "./omnis"

let anyWindow = window as any

if (anyWindow.jOmnis) {
    const jOmnisWrapper = new JOmnisWrapper(jOmnis)

    console.log("Completata inizializzazione applicazione")
}
