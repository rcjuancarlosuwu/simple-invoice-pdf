interface HeaderImage {
    path: string;
    width: number;
    height: number;
}
interface HeaderOptions {
    backgroundColor?: string;
    height?: number;
    image: HeaderImage | null;
    textPosition?: number;
    regularColor?: string;
    secondaryColor?: string;
}
interface FontOptions {
    name: string;
    range?: RegExp;
    path?: string;
}
interface Fonts {
    normal: FontOptions;
    bold: FontOptions;
    fallback: {
        name: string;
        path: string;
        enabled: boolean;
        range?: RegExp;
        transliterate: boolean;
    };
}
interface TableOptions {
    quantity: {
        position: number;
        maxWidth: number;
    };
    total: {
        position: number;
        maxWidth: number;
    };
}
interface TextOptions {
    primaryColor: string;
    secondaryColor: string;
    headingSize: number;
    regularSize: number;
}
interface InvoiceData {
    name: string;
    header: {
        label: string;
        value: string | number;
    }[];
    customer: {
        label: string;
        value: string | string[];
    }[];
    seller: {
        label: string;
        value: string | string[];
    }[];
    currency?: string;
    details: {
        header: {
            value: string;
        }[];
        parts: {
            value: string | number;
            price?: boolean;
        }[][];
        total: {
            label: string;
            value: string | number;
            price?: boolean;
        }[];
    };
    legal: {
        value: string;
        weight?: string;
        color?: string;
    }[];
}
interface InvoiceOptions {
    style: {
        document?: {
            marginLeft: number;
            marginRight: number;
            marginTop: number;
        };
        fonts?: Fonts;
        header: HeaderOptions;
        table?: TableOptions;
        text?: TextOptions;
    };
    data: {
        invoice: InvoiceData;
    };
}
