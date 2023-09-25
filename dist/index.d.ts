/// <reference types="node" />
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
declare const _default: {
    SimpleInvoicePDF: typeof SimpleInvoicePDF;
};
export default _default;
