import { useEffect, useRef } from "react"
import UareUFingerprint from "../classes/fingerprint/UareU/UareUFingerprint"
import {
    UareUFingerprintAquiredQualityReport,
    UareUFingerprintSample,
} from "../classes/fingerprint/UareU/interfaces/UareU.interface"
import { _Fingerprint, Fingerprint } from "../classes/fingerprint/Fingerprint"
import { FingerprintQualityReport, FingerPrintSample } from "../classes/fingerprint/types/fingerprint"

const useFingerprint = <Y extends UareUFingerprintSample, T extends UareUFingerprintAquiredQualityReport>({
    client,
    onAcquisitionQualityReport,
    onDeviceConnected,
    onDeviceDisconnected,
    onAcquisition,
}: {
    client: "UareU"
    onAcquisitionQualityReport?: (
        // agregar tipado de respuestas para otros sdk's
        v: FingerprintQualityReport<T>
    ) => void
    onAcquisition: (v: FingerPrintSample<Y>) => void
    onDeviceConnected?: () => void
    onDeviceDisconnected?: () => void
}) => {
    const fingerprint = useRef<_Fingerprint>()

    const startAcquisition = () => {
        fingerprint.current?.startAcquisition()
    }

    const stopAcquisition = () => {
        fingerprint.current?.stopAcquisition()
    }

    const setOnAcquisition = () => {
        fingerprint.current?.setOnAcquisition({ onAcquisition })
    }

    const setOnAcquisitionQualityReport = () => {
        if(onAcquisitionQualityReport) {
            fingerprint.current?.setOnAcquisitionQualityReport({ onAcquisitionQualityReport })
        }
    }

    useEffect(() => {
        fingerprint.current?.stopAcquisition()
        if (client === "UareU") {
            fingerprint.current = new Fingerprint(new UareUFingerprint({ onAcquisitionQualityReport, onAcquisition }))
            if (onDeviceConnected) {
                fingerprint.current?.setOnDeviceConected?.({ onDeviceConnected })
            }
            if (onDeviceDisconnected) {
                fingerprint.current?.setOnDeviceDisconnected?.({ onDeviceDisconnected })
            }
        }

        return () => {
            stopAcquisition()
        }
    }, [client, onDeviceDisconnected])

    useEffect(() => {
        if (fingerprint.current) {
            setOnAcquisition()
        }
    }, [onAcquisition])

    useEffect(() => {
        if (fingerprint.current) {
            setOnAcquisitionQualityReport()
        }
    }, [onAcquisitionQualityReport])

    return { startAcquisition, stopAcquisition }
}

export default useFingerprint
