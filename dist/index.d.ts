/// <reference types="node" />
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
declare class SimpleInvoicePDF {
    private defaultOptions;
    private options;
    private storage;
    constructor(options: InvoiceOptions);
    private loadCustomFonts;
    private getFontOrFallback;
    private valueOrTransliterate;
    private getDocument;
    private setCursor;
    private prettyPrice;
    private setText;
    private generateHeader;
    /**
     * Generates customer and seller details
     *
     * @private
     * @param {string} type
     * @return void
     */
    private generateDetails;
    /**
     * Generates a row in the table
     *
     * @private
     * @param {string} type
     * @param {Array<{ value: string | number, price?: boolean }>} columns
     * @return void
     */
    private generateTableRow;
    /**
     * Generates a line separator
     *
     * @private
     * @return void
     */
    private generateLine;
    /**
     * Generates invoice parts
     *
     * @private
     * @return void
     */
    private generateParts;
    /**
     * Generates legal terms
     *
     * @private
     * @return void
     */
    private generateLegal;
    /**
     * Generates a PDF invoice and returns it as a Buffer
     *
     * @public
     * @return Promise<Buffer>
     */
    generateBuffer(): Promise<Buffer>;
}
export { SimpleInvoicePDF };
