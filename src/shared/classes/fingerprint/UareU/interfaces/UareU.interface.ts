export interface UareUFingerprintSample {
    type: string
    deviceUid: string
    sampleFormat: number
    samples: string
}

export interface UareUFingerprintAquiredQualityReport {
    type: string
    deviceUid: string
    quality: number
}

export enum DeviceModality {
    Unknown = 0,
    Swipe = 1,
    Area = 2,
    AreaMultifinger = 3,
}

export enum DeviceTechnology {
    Unknown = 0,
    Optical = 1,
    Capacitive = 2,
    Thermal = 3,
    Pressure = 4,
}

export enum DeviceUidType {
    Persistent = 0,
    Volatile = 1,
}

export enum QualityCode {
    Good = 0,
    NoImage = 1,
    TooLight = 2,
    TooDark = 3,
    TooNoisy = 4,
    LowContrast = 5,
    NotEnoughFeatures = 6,
    NotCentered = 7,
    NotAFinger = 8,
    TooHigh = 9,
    TooLow = 10,
    TooLeft = 11,
    TooRight = 12,
    TooStrange = 13,
    TooFast = 14,
    TooSkewed = 15,
    TooShort = 16,
    TooSlow = 17,
    ReverseMotion = 18,
    PressureTooHard = 19,
    PressureTooLight = 20,
    WetFinger = 21,
    FakeFinger = 22,
    TooSmall = 23,
    RotatedTooMuch = 24,
}

export enum SampleFormat {
    Raw = 1,
    Intermediate = 2,
    Compressed = 3,
    PngImage = 5,
}
