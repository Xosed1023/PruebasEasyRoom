import { IFingerprint } from "./interfaces/Fingerprint.interface"
import { UareUFingerprintAquiredQualityReport, UareUFingerprintSample } from "./UareU/interfaces/UareU.interface"


// Clase singleton para impedir que existan más listeners repetidos de los eventos de fingerprint
export class _Fingerprint {
    private static _instance: _Fingerprint

    private reader: IFingerprint<UareUFingerprintSample, UareUFingerprintAquiredQualityReport>

    constructor(reader: IFingerprint<UareUFingerprintSample, UareUFingerprintAquiredQualityReport>) {
        this.reader = reader
    }

    public static getInstance(reader: IFingerprint<UareUFingerprintSample, UareUFingerprintAquiredQualityReport>): _Fingerprint {
        if (!this._instance) {
            this._instance = new _Fingerprint(reader)
        } else {
            this._instance.reader = reader
        }
        return this._instance
    }

    startAcquisition() {
        this.reader.startAcquisition()
    }

    stopAcquisition() {
        this.reader.stopAcquisition()
    }

    setOnDeviceConected({ onDeviceConnected }: { onDeviceConnected: () => void }) {
        this.reader.setOnDeviceConected?.({ onDeviceConnected })
    }

    setOnDeviceDisconnected({ onDeviceDisconnected }: { onDeviceDisconnected: () => void }) {
        this.reader.setOnDeviceDisconnected?.({ onDeviceDisconnected })
    }

    setOnAcquisition({ onAcquisition }: { onAcquisition: (v: UareUFingerprintSample) => void }) {
        this.reader.setOnAcquisition({ onAcquisition })
    }

    setOnAcquisitionQualityReport({
        onAcquisitionQualityReport,
    }: {
        onAcquisitionQualityReport: (v: UareUFingerprintAquiredQualityReport) => void
    }) {
        this.reader.setOnAcquisitionQualityReport({ onAcquisitionQualityReport })
    }
}

export const Fingerprint = new Proxy(_Fingerprint, {
    construct(target, args: IFingerprint<UareUFingerprintSample, UareUFingerprintAquiredQualityReport>[]) {
        return target.getInstance(args[0])
    },
})
