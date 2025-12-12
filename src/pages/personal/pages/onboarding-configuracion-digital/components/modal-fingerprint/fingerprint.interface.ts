export interface FingerprintSampleData {
    Data:    string;
    Header:  Header;
    Version: number;
}

export interface Header {
    Encryption: number;
    Factor:     number;
    Format:     Format;
    Purpose:    number;
    Quality:    number;
    Type:       number;
}

export interface Format {
    FormatID:    number;
    FormatOwner: number;
}