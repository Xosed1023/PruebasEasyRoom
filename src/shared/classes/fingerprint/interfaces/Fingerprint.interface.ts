import { UareUFingerprintAquiredQualityReport, UareUFingerprintSample } from "../UareU/interfaces/UareU.interface"
// import { FingerprintQualityReport, FingerPrintSample } from "../classes/fingerprint/types/fingerprint"


export interface IFingerprint<
    OnAcquisitionValue extends UareUFingerprintSample,
    OnAcquisitionQualityReportValue extends UareUFingerprintAquiredQualityReport
> {
    startAcquisition: () => void
    stopAcquisition: () => void
    setOnDeviceConected?: ({ onDeviceConnected }: { onDeviceConnected: () => void }) => void
    setOnDeviceDisconnected?: ({ onDeviceDisconnected }: { onDeviceDisconnected: () => void }) => void
    setOnAcquisition: ({ onAcquisition }: { onAcquisition: (v: OnAcquisitionValue) => void }) => void
    setOnAcquisitionQualityReport: ({
        onAcquisitionQualityReport,
    }: {
        onAcquisitionQualityReport: (v: OnAcquisitionQualityReportValue) => void
    }) => void
}
