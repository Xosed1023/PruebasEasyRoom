import { useEffect, useState } from "react"
import { Network } from '@capacitor/network';

export function useNetwork() {
    const [onLine, setOnline] = useState<boolean>(true)

    const handleOnline = () => {
        setOnline(true)
    }

    const handleOffline = () => {
        setOnline(false)
    }

    useEffect(()=>{
        Network.getStatus().then((status)=>{
            if(status.connected) {
                handleOnline()
            } else {
                handleOffline()
            }
        }).catch(console.log)
    }, [])

    useEffect(() => {
        Network.addListener('networkStatusChange', status => {
            if(status.connected) {
                handleOnline()
            } else {
                handleOffline()
            }
});

        return () => {
           Network.removeAllListeners().then(console.log).catch(console.log)
        }
    }, [])

    return {
        onLine,
    }
}