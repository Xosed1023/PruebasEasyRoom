import { IFingerprint } from "../interfaces/Fingerprint.interface"
import {
    UareUFingerprintAquiredQualityReport,
    SampleFormat,
    UareUFingerprintSample,
} from "./interfaces/UareU.interface"
// el sdk de npm "https://www.npmjs.com/package/@digitalpersona/devices" en su version 0.2.6 depende de WebSdk, WebSdk no está en npm por lo tanto no podemos usar @digitalpersona/devices hasta que lo arreglen
let fingerPrint: any = undefined

export class UareUFingerprint implements IFingerprint<UareUFingerprintSample, UareUFingerprintAquiredQualityReport> {

    constructor({
        onAcquisitionQualityReport,
        onAcquisition,
    }: {
        onAcquisitionQualityReport?: (v: UareUFingerprintAquiredQualityReport) => void
        onAcquisition: (v: UareUFingerprintSample) => void
    }) {
        if(!fingerPrint) {
            fingerPrint = new window.Fingerprint.WebApi()
        }

        fingerPrint.onQualityReported = onAcquisitionQualityReport
        fingerPrint.onSamplesAcquired = onAcquisition
        fingerPrint.onConnectionFailed = function () {
            null
        }
    }

    setOnAcquisition({ onAcquisition }: { onAcquisition: (v: UareUFingerprintSample) => void }) {
        fingerPrint.onSamplesAcquired = onAcquisition
    }

    setOnAcquisitionQualityReport({
        onAcquisitionQualityReport,
    }: {
        onAcquisitionQualityReport: (v: UareUFingerprintAquiredQualityReport) => void
    }) {
        fingerPrint.onQualityReported = onAcquisitionQualityReport
    }

    setOnDeviceConected({ onDeviceConnected }: { onDeviceConnected?: () => void }) {
        fingerPrint.onDeviceConnected = onDeviceConnected
    }
    setOnDeviceDisconnected({ onDeviceDisconnected }: { onDeviceDisconnected?: () => void }) {
        fingerPrint.onDeviceDisconnected = onDeviceDisconnected
    }

    getDeviceId() {
        return fingerPrint.enumerateDevices().then((devices) => devices[0])
    }

    startAcquisition() {
        this.getDeviceId().then((device) => {
            fingerPrint.startAcquisition(SampleFormat.Intermediate, device)
        })
    }

    stopAcquisition() {
        fingerPrint.stopAcquisition()
    }
}

export default UareUFingerprint
