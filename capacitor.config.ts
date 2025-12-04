import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
    appId: "io.easyroom.mobile",
    appName: "Easyroom",
    webDir: "dist",
    server: {
        androidScheme: "https",
        cleartext: true,
    },
    plugins: {
        StatusBar: {
            style: "light",
            backgroundColor: "#FFFFFF",
            overlaysWebView: false,
        },
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: true,
            backgroundColor: "#6941C6",
            androidSplashResourceName: "splash",
            androidScaleType: "CENTER_CROP",
            showSpinner: false,
            androidSpinnerStyle: "large",
            iosSpinnerStyle: "small",
            spinnerColor: "#999999",
            splashFullScreen: false,
            splashImmersive: false,
            layoutName: "launch_screen",
            useDialog: false,
        },
        PushNotifications: {
            presentationOptions: ["badge", "sound", "alert"],
        },
    },
}

export default config
