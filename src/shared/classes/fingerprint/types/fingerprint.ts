import { UareUFingerprintAquiredQualityReport, UareUFingerprintSample } from "../UareU/interfaces/UareU.interface"

export type FingerprintQualityReport<T> = T extends UareUFingerprintAquiredQualityReport
    ? UareUFingerprintAquiredQualityReport
    : UareUFingerprintAquiredQualityReport

export type FingerPrintSample<T> = T extends UareUFingerprintSample ? UareUFingerprintSample : UareUFingerprintSample
