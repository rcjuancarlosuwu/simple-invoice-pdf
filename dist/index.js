"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfkit_1 = __importDefault(require("pdfkit"));
const path = require("path");
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const transliteration_1 = require("transliteration");
const memory_streams_1 = __importDefault(require("memory-streams"));
class SimpleInvoicePDF {
    constructor(options) {
        this.defaultOptions = {
            style: {
                document: {
                    marginLeft: 30,
                    marginRight: 30,
                    marginTop: 30,
                },
                fonts: {
                    normal: {
                        name: "Helvetica",
                        range: /[^\u0000-\u00FF]/m,
                    },
                    bold: {
                        name: "Helvetica-Bold",
                    },
                    fallback: {
                        name: "Noto Sans",
                        path: path.join(__dirname, "../res/fonts/", "NotoSans-Regular.ttf"),
                        enabled: true,
                        range: /[^\u0000-\u0500]/m,
                        transliterate: true,
                    },
                },
                header: {
                    backgroundColor: "#F8F8FA",
                    height: 150,
                    image: null,
                    textPosition: 330,
                },
                table: {
                    quantity: {
                        position: 330,
                        maxWidth: 140,
                    },
                    total: {
                        position: 490,
                        maxWidth: 80,
                    },
                },
                text: {
                    primaryColor: "#000100",
                    secondaryColor: "#8F8F8F",
                    headingSize: 15,
                    regularSize: 10,
                },
            },
            data: {
                invoice: {
                    name: "Invoice for Acme",
                    header: [
                        {
                            label: "Invoice Number",
                            value: 1,
                        },
                    ],
                    customer: [
                        {
                            label: "Bill To",
                            value: [],
                        },
                    ],
                    seller: [
                        {
                            label: "Bill From",
                            value: [],
                        },
                    ],
                    details: {
                        header: [
                            {
                                value: "Description",
                            },
                            {
                                value: "Quantity",
                            },
                            {
                                value: "Subtotal",
                            },
                        ],
                        parts: [],
                        total: [
                            {
                                label: "Total",
                                value: 0,
                            },
                        ],
                    },
                    legal: [],
                },
            },
        };
        this.options = (0, lodash_merge_1.default)(this.defaultOptions, options);
        this.storage = {
            header: {
                image: null,
            },
            cursor: {
                x: 0,
                y: 0,
            },
            customer: {
                height: 0,
            },
            seller: {
                height: 0,
            },
            fonts: {
                fallback: {
                    loaded: false,
                },
            },
            document: null,
        };
    }
    loadCustomFonts() {
        // Register custom fonts
        const { normal, bold } = this.options.style.fonts;
        if (normal.path) {
            this.getDocument().registerFont(normal.name, normal.path);
        }
        if (bold.path) {
            this.getDocument().registerFont(bold.name, bold.path);
        }
    }
    getFontOrFallback(type, value) {
        const normalRange = this.options.style.fonts.normal.range;
        const fallbackRange = this.options.style.fonts.fallback.range;
        if (type !== "normal" && type !== "bold") {
            type = "normal";
        }
        // Return default font
        if (!this.options.style.fonts.fallback.enabled) {
            return this.options.style.fonts[type].name;
        }
        // Return default font if no special characters are found
        if (!normalRange.test(value || "")) {
            return this.options.style.fonts[type].name;
        }
        // Return default font if fallback font range is not supported
        if (fallbackRange.test(value || "")) {
            return this.options.style.fonts[type].name;
        }
        if (!this.storage.fonts.fallback.loaded) {
            this.getDocument().registerFont(this.options.style.fonts.fallback.name, this.options.style.fonts.fallback.path);
            this.storage.fonts.fallback.loaded = true;
        }
        // Return fallback font
        return this.options.style.fonts.fallback.name;
    }
    valueOrTransliterate(value) {
        const fallbackRange = this.options.style.fonts.fallback.range;
        // Return default font
        if (!this.options.style.fonts.fallback.enabled) {
            return value;
        }
        // Return default font if no special characters are found
        if (!fallbackRange.test(value || "")) {
            return value;
        }
        return (0, transliteration_1.transliterate)(value);
    }
    getDocument() {
        if (!this.storage.document) {
            this.storage.document = new pdfkit_1.default({
                size: "A4",
            });
        }
        return this.storage.document;
    }
    setCursor(axis, value) {
        this.storage.cursor[axis] = value;
    }
    prettyPrice(value) {
        if (typeof value === "number") {
            value = value.toFixed(2);
        }
        if (this.options.data.invoice.currency) {
            value = `${value} ${this.options.data.invoice.currency}`;
        }
        return value;
    }
    setText(text, options = {}) {
        const { fontWeight = "normal", colorCode = "primary", fontSize = "regular", align = "left", color = "", marginTop = 0, maxWidth, skipDown, } = options;
        this.storage.cursor.y += marginTop;
        const { primaryColor, secondaryColor, regularSize, headingSize } = this.options.style.text;
        if (!color) {
            if (colorCode === "primary") {
                this.getDocument().fillColor(primaryColor);
            }
            else {
                this.getDocument().fillColor(secondaryColor);
            }
        }
        const fontSizeValue = fontSize === "regular" ? regularSize : headingSize;
        this.getDocument().font(this.getFontOrFallback(fontWeight, text));
        this.getDocument().fillColor(color);
        this.getDocument().fontSize(fontSizeValue);
        this.getDocument().text(this.valueOrTransliterate(text), this.storage.cursor.x, this.storage.cursor.y, {
            align,
            width: maxWidth,
        });
        const diff = this.getDocument().y - this.storage.cursor.y;
        this.storage.cursor.y = this.getDocument().y;
        // Do not move down
        if (skipDown === true) {
            if (diff > 0) {
                this.storage.cursor.y -= diff;
            }
            else {
                this.storage.cursor.y -= 11.5;
            }
        }
    }
    generateHeader() {
        const { backgroundColor, height, image, textPosition } = this.options.style.header;
        this.getDocument()
            .rect(0, 0, this.getDocument().page.width, height)
            .fill(backgroundColor);
        // Add an image to the header if any
        if (image && image.path) {
            this.getDocument().image(image.path, this.options.style.document.marginLeft, this.options.style.document.marginTop, {
                width: image.width,
                height: image.height,
            });
        }
        const fontMargin = 4;
        this.setCursor("x", textPosition);
        this.setCursor("y", this.options.style.document.marginTop);
        this.setText(this.options.data.invoice.name, {
            fontSize: "heading",
            fontWeight: "bold",
            color: this.options.style.header.regularColor,
        });
        this.options.data.invoice.header.forEach((line) => {
            this.setText(`${line.label}:`, {
                fontWeight: "bold",
                color: this.options.style.header.regularColor,
                marginTop: fontMargin,
            });
            const values = Array.isArray(line.value) ? line.value : [line.value];
            values.forEach((value) => {
                this.setText(value, {
                    colorCode: "secondary",
                    color: this.options.style.header.secondaryColor,
                    marginTop: fontMargin,
                });
            });
        });
    }
    /**
     * Generates customer and seller details
     *
     * @private
     * @param {string} type
     * @return void
     */
    generateDetails(type) {
        const maxWidth = 250;
        const fontMargin = 4;
        this.setCursor("y", this.options.style.header.height + 18);
        // Use a different left position
        if (type === "customer") {
            this.setCursor("x", this.options.style.document.marginLeft);
        }
        else {
            this.setCursor("x", this.options.style.header.textPosition);
        }
        this.options.data.invoice[type].forEach((line) => {
            this.setText(`${line.label}:`, {
                colorCode: "primary",
                fontWeight: "bold",
                marginTop: 8,
                maxWidth: maxWidth,
            });
            let _values = [];
            if (Array.isArray(line.value)) {
                _values = line.value;
            }
            else {
                _values = [line.value];
            }
            _values.forEach((value) => {
                this.setText(value, {
                    colorCode: "secondary",
                    marginTop: fontMargin,
                    maxWidth: maxWidth,
                });
            });
        });
        this.storage[type].height = this.storage.cursor.y;
    }
    /**
     * Generates a row in the table
     *
     * @private
     * @param {string} type
     * @param {Array<{ value: string | number, price?: boolean }>} columns
     * @return void
     */
    generateTableRow(type, columns) {
        let fontWeight = "normal", colorCode = "secondary";
        this.storage.cursor.y = this.getDocument().y;
        this.storage.cursor.y += 17;
        if (type === "header") {
            fontWeight = "bold";
            colorCode = "primary";
        }
        let start = this.options.style.document.marginLeft;
        let maxY = this.storage.cursor.y;
        // Computes columns by giving an extra space for the last column \
        //   It is used to keep perfect alignment
        let maxWidth = (this.options.style.header.textPosition -
            start -
            this.options.style.document.marginRight) /
            (columns.length - 2);
        columns.forEach((column, index) => {
            let _value;
            if (index < columns.length - 2) {
                this.setCursor("x", start);
            }
            else {
                if (index == columns.length - 2) {
                    maxWidth = this.options.style.table.quantity.maxWidth;
                    this.setCursor("x", this.options.style.table.quantity.position);
                }
                else {
                    maxWidth = this.options.style.table.total.maxWidth;
                    this.setCursor("x", this.options.style.table.total.position);
                }
            }
            _value = column.value;
            if (column.price === true) {
                _value = this.prettyPrice(_value);
            }
            this.setText(_value.toString(), {
                colorCode: colorCode,
                maxWidth: maxWidth,
                fontWeight: fontWeight,
                skipDown: true,
            });
            start += maxWidth + 10;
            // Increase y position in case of a line return
            if (this.getDocument().y >= maxY) {
                maxY = this.getDocument().y;
            }
        });
        // Set y to the max y position
        this.setCursor("y", maxY);
        if (type === "header") {
            this.generateLine();
        }
    }
    /**
     * Generates a line separator
     *
     * @private
     * @return void
     */
    generateLine() {
        this.storage.cursor.y += this.options.style.text.regularSize + 2;
        this.getDocument()
            .strokeColor("#F0F0F0")
            .lineWidth(1)
            .moveTo(this.options.style.document.marginRight, this.storage.cursor.y)
            .lineTo(this.getDocument().page.width - this.options.style.document.marginRight, this.storage.cursor.y)
            .stroke();
    }
    /**
     * Generates invoice parts
     *
     * @private
     * @return void
     */
    generateParts() {
        let startY = Math.max(this.storage.customer.height, this.storage.seller.height);
        let fontMargin = 4;
        let leftMargin = 15;
        this.setCursor("y", startY);
        this.setText("\n");
        this.generateTableRow("header", this.options.data.invoice.details.header);
        (this.options.data.invoice.details.parts || []).forEach((part) => {
            this.generateTableRow("row", part);
        });
        this.storage.cursor.y += 50;
        (this.options.data.invoice.details.total || []).forEach((total) => {
            let mainRatio = 0.6, secondaryRatio = 0.3;
            let margin = 30;
            let value = total.value;
            this.setCursor("x", this.options.style.table.quantity.position);
            this.setText(total.label, {
                colorCode: "primary",
                fontWeight: "bold",
                marginTop: 12,
                maxWidth: this.options.style.table.quantity.maxWidth,
                skipDown: true,
            });
            this.setCursor("x", this.options.style.table.total.position);
            if (total.price === true) {
                value = this.prettyPrice(total.value);
            }
            this.setText(value.toString(), {
                colorCode: "secondary",
                maxWidth: this.options.style.table.total.maxWidth,
            });
        });
    }
    /**
     * Generates legal terms
     *
     * @private
     * @return void
     */
    generateLegal() {
        this.storage.cursor.y += 60;
        (this.options.data.invoice.legal || []).forEach((legal) => {
            this.setCursor("x", this.options.style.document.marginLeft * 2);
            this.setText(legal.value, {
                fontWeight: legal.weight,
                colorCode: legal.color || "primary",
                align: "center",
                marginTop: 10,
            });
        });
    }
    /**
     * Generates a PDF invoice and returns it as a Buffer
     *
     * @public
     * @return Promise<Buffer>
     */
    generateBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            const pdfStream = new memory_streams_1.default.WritableStream();
            const document = this.getDocument();
            this.loadCustomFonts();
            this.generateHeader();
            this.generateDetails("customer");
            this.generateDetails("seller");
            this.generateParts();
            this.generateLegal();
            document.pipe(pdfStream);
            document.end();
            return new Promise((resolve, reject) => {
                pdfStream.on("finish", () => {
                    const buffer = pdfStream.toBuffer();
                    resolve(buffer);
                });
                pdfStream.on("error", (error) => {
                    reject(error);
                });
            });
        });
    }
}
exports.default = { SimpleInvoicePDF };
//# sourceMappingURL=index.js.map