"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const invoice = new index_1.default({
    style: {
        header: {
            image: {
                path: "./logo.png",
                width: 50,
                height: 19,
            },
        },
    },
    data: {
        invoice: {
            name: "Invoice",
            header: [
                {
                    label: "Invoice Number",
                    value: 1,
                },
                {
                    label: "Status",
                    value: "Paid",
                },
                {
                    label: "Date",
                    value: "22/10/21",
                },
            ],
            currency: "EUR",
            customer: [
                {
                    label: "Bill To",
                    value: [
                        "John Doe",
                        "Acme Corp",
                        "john.doe@gmail.com",
                        "+145453242342342",
                        "522 Main Street, New York",
                        "USA",
                    ],
                },
                {
                    label: "Tax Identifier",
                    value: "352352342333",
                },
                {
                    label: "Information",
                    value: "Deliver to the door",
                },
            ],
            seller: [
                {
                    label: "Bill From",
                    value: [
                        "Big Corp",
                        "2 Flowers Streets, London",
                        "UK",
                        "+44245345435345",
                        "biling@bigcorp.com",
                    ],
                },
                {
                    label: "Tax Identifier",
                    value: "5345345345435345345",
                },
            ],
            legal: [
                {
                    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                    weight: "bold",
                    color: "primary",
                },
                {
                    value: "sed do eiusmod tempor incididunt ut labore et dolore magna.",
                    weight: "bold",
                    color: "secondary",
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
                parts: [
                    [
                        {
                            value: "Nike Air Max",
                        },
                        {
                            value: 1,
                        },
                        {
                            value: "53",
                            price: true,
                        },
                    ],
                    [
                        {
                            value: "Discount",
                        },
                        {
                            value: 1,
                        },
                        {
                            value: "-10",
                            price: true,
                        },
                    ],
                ],
                total: [
                    {
                        label: "Total without VAT",
                        value: "43",
                        price: true,
                    },
                    {
                        label: "VAT Rate",
                        value: "20%",
                    },
                    {
                        label: "VAT Paid",
                        value: "8.6",
                        price: true,
                    },
                    {
                        label: "Total paid with VAT",
                        value: "51.6",
                        price: true,
                    },
                ],
            },
        },
    },
});
const buffer = invoice.generateBuffer().then((buffer) => {
    console.log(buffer);
});
//# sourceMappingURL=demo.js.map