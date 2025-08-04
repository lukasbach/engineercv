import "../module-globals.js";
import React from "react";

const header = defineComponent({
  name: "header",
  schema: z.object({
    strings: z
      .object({
        invoice: z.string().default(""),
        invoiceNumber: z.string().default(""),
        date: z.string().default(""),
        dueDate: z.string().default(""),
      })
      .default({}),
    fromAddress: z.string().array().optional(),
    invoice: z.object({
      invoiceNumber: z.string().or(z.number()),
      date: z.string(),
      dueDate: z.string(),
    }),
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent(defaultComponents.markdown);
    return (
      <>
        <ReactPdf.View style={styles.container}>
          <ReactPdf.View style={styles.headerRow}>
            <ReactPdf.View style={styles.fromSection}>
              <ReactPdf.Text style={styles.title}>
                {spec.strings?.invoice}
              </ReactPdf.Text>
              <Markdown style={styles.fromAddress}>
                {spec.fromAddress?.join("\n")}
              </Markdown>
            </ReactPdf.View>
            <ReactPdf.View style={styles.invoiceDetails}>
              <ReactPdf.View style={styles.detailRow}>
                <ReactPdf.Text style={styles.label}>
                  {spec.strings?.invoiceNumber}
                </ReactPdf.Text>
                <ReactPdf.Text style={styles.value}>
                  {spec.invoice.invoiceNumber}
                </ReactPdf.Text>
              </ReactPdf.View>
              <ReactPdf.View style={styles.detailRow}>
                <ReactPdf.Text style={styles.label}>
                  {spec.strings?.date}
                </ReactPdf.Text>
                <ReactPdf.Text style={styles.value}>
                  {spec.invoice.date}
                </ReactPdf.Text>
              </ReactPdf.View>
              <ReactPdf.View style={styles.detailRow}>
                <ReactPdf.Text style={styles.label}>
                  {spec.strings?.dueDate}
                </ReactPdf.Text>
                <ReactPdf.Text style={styles.value}>
                  {spec.invoice.dueDate}
                </ReactPdf.Text>
              </ReactPdf.View>
            </ReactPdf.View>
          </ReactPdf.View>
        </ReactPdf.View>
      </>
    );
  },
  defaultStyles: {
    container: {
      marginBottom: "20pt",
    },
    headerRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    fromSection: {
      flex: 1,
    },
    title: {
      fontSize: "28pt",
      fontWeight: "bold",
      marginBottom: "10pt",
    },
    fromAddress: {
      fontSize: "10pt",
      lineHeight: "1.2",
    },
    invoiceDetails: {
      width: "200pt",
    },
    detailRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: "4pt",
    },
    label: {
      fontSize: "10pt",
      fontWeight: "bold",
    },
    value: {
      fontSize: "10pt",
    },
  } as const,
});

const toAddress = defineComponent({
  name: "toAddress",
  schema: z.object({
    strings: z
      .object({
        billTo: z.string().default(""),
        shipTo: z.string().default(""),
      })
      .default({}),
    toAddress: z.string().array().optional(),
    shipAddress: z.string().array().optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent(defaultComponents.markdown);
    const billTo = spec.toAddress;
    const shipTo = spec.shipAddress;

    return (
      <>
        <ReactPdf.View style={styles.container}>
          <ReactPdf.View style={styles.addressRow}>
            <ReactPdf.View style={styles.addressSection}>
              <ReactPdf.Text style={styles.addressLabel}>
                {spec.strings?.billTo}
              </ReactPdf.Text>
              <Markdown style={styles.address}>{billTo?.join("\n")}</Markdown>
            </ReactPdf.View>
            {shipTo && (
              <ReactPdf.View style={styles.addressSection}>
                <ReactPdf.Text style={styles.addressLabel}>
                  {spec.strings?.shipTo}
                </ReactPdf.Text>
                <Markdown style={styles.address}>{shipTo?.join("\n")}</Markdown>
              </ReactPdf.View>
            )}
          </ReactPdf.View>
        </ReactPdf.View>
      </>
    );
  },
  defaultStyles: {
    container: {
      marginBottom: "20pt",
    },
    addressRow: {
      display: "flex",
      flexDirection: "row",
      gap: "40pt",
    },
    addressSection: {
      flex: 1,
    },
    addressLabel: {
      fontSize: "12pt",
      fontWeight: "bold",
      marginBottom: "6pt",
    },
    address: {
      fontSize: "10pt",
      lineHeight: "1.2",
    },
  } as const,
});

const invoiceTableRow = defineComponent({
  name: "invoiceTableRow",
  schema: z.object({}),
  additionalProps: z.object({
    item: z.object({
      definition: z.object({
        description: z.string(),
        unitPrice: z.number(),
      }),
      quantity: z.number().optional(),
    }),
    currency: z.string().optional(),
  }),
  component: ({ item, currency = "USD", styles }) => {
    const lineTotal = item.definition.unitPrice * (item.quantity || 1);

    return (
      <>
        <ReactPdf.View style={styles.tableRow}>
          <ReactPdf.Text style={[styles.cell, styles.descriptionCol]}>
            {item.definition.description}
          </ReactPdf.Text>
          <ReactPdf.Text style={[styles.cell, styles.qtyCol]}>
            {item.quantity || 1}
          </ReactPdf.Text>
          <ReactPdf.Text style={[styles.cell, styles.priceCol]}>
            {currency} {item.definition.unitPrice.toFixed(2)}
          </ReactPdf.Text>
          <ReactPdf.Text style={[styles.cell, styles.totalCol]}>
            {currency} {lineTotal.toFixed(2)}
          </ReactPdf.Text>
        </ReactPdf.View>
      </>
    );
  },
  defaultStyles: {
    tableRow: {
      display: "flex",
      flexDirection: "row",
      borderBottom: "0.5pt solid #ccc",
    },
    cell: {
      fontSize: "9pt",
      padding: "6pt",
      borderRight: "0.5pt solid #ccc",
    },
    descriptionCol: {
      flex: 3,
    },
    qtyCol: {
      flex: 1,
    },
    priceCol: {
      flex: 2,
      textAlign: "right",
    },
    totalCol: {
      flex: 2,
      textAlign: "right",
      borderRight: "none",
    },
  } as const,
});

const invoiceSummaryModifier = defineComponent({
  name: "invoiceSummaryModifier",
  schema: z.object({}),
  additionalProps: z.object({
    modifier: z.object({
      description: z.string(),
      rate: z.number(),
    }),
    subtotal: z.number(),
    currency: z.string().optional(),
  }),
  component: ({ modifier, subtotal, currency = "USD", styles }) => {
    const modifierAmount = subtotal * modifier.rate;

    return (
      <>
        <ReactPdf.View style={styles.summaryRow}>
          <ReactPdf.Text style={styles.summaryLabel}>
            {modifier.description} ({(modifier.rate * 100).toFixed(0)}%):
          </ReactPdf.Text>
          <ReactPdf.Text style={styles.summaryValue}>
            {currency} {modifierAmount.toFixed(2)}
          </ReactPdf.Text>
        </ReactPdf.View>
      </>
    );
  },
  defaultStyles: {
    summaryRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: "4pt",
    },
    summaryLabel: {
      fontSize: "10pt",
    },
    summaryValue: {
      fontSize: "10pt",
      textAlign: "right",
    },
  } as const,
});

const invoiceSummary = defineComponent({
  name: "invoiceSummary",
  schema: z.object({}),
  additionalProps: z.object({
    subtotal: z.number(),
    total: z.number(),
    modifiers: z
      .array(
        z.object({
          description: z.string(),
          rate: z.number(),
        }),
      )
      .optional(),
    paymentMade: z.number().optional(),
    currency: z.string().optional(),
    strings: z
      .object({
        subtotal: z.string().default(""),
        totalLabel: z.string().default(""),
        paymentMade: z.string().default(""),
        balanceDue: z.string().default(""),
      })
      .optional(),
  }),
  component: ({
    subtotal,
    total,
    modifiers,
    paymentMade = 0,
    currency = "USD",
    strings,
    styles,
    getComponent,
  }) => {
    const balance = total - (paymentMade || 0);
    const InvoiceSummaryModifier = getComponent({
      name: "invoiceSummaryModifier",
    });

    return (
      <>
        <ReactPdf.View style={styles.summaryRow}>
          <ReactPdf.Text style={styles.summaryLabel}>
            {strings?.subtotal}:
          </ReactPdf.Text>
          <ReactPdf.Text style={styles.summaryValue}>
            {currency} {subtotal.toFixed(2)}
          </ReactPdf.Text>
        </ReactPdf.View>

        {/* Modifiers */}
        {(modifiers || []).map((modifier, index) => (
          <InvoiceSummaryModifier
            key={index}
            modifier={modifier}
            subtotal={subtotal}
            currency={currency}
          />
        ))}

        <ReactPdf.View style={[styles.summaryRow, styles.totalRow]}>
          <ReactPdf.Text style={[styles.summaryLabel, styles.totalLabel]}>
            {strings?.totalLabel}:
          </ReactPdf.Text>
          <ReactPdf.Text style={[styles.summaryValue, styles.totalValue]}>
            {currency} {total.toFixed(2)}
          </ReactPdf.Text>
        </ReactPdf.View>

        {(paymentMade || 0) > 0 && (
          <>
            <ReactPdf.View style={styles.summaryRow}>
              <ReactPdf.Text style={styles.summaryLabel}>
                {strings?.paymentMade}:
              </ReactPdf.Text>
              <ReactPdf.Text style={styles.summaryValue}>
                -{currency} {(paymentMade || 0).toFixed(2)}
              </ReactPdf.Text>
            </ReactPdf.View>
            <ReactPdf.View style={[styles.summaryRow, styles.balanceRow]}>
              <ReactPdf.Text style={[styles.summaryLabel, styles.balanceLabel]}>
                {strings?.balanceDue}:
              </ReactPdf.Text>
              <ReactPdf.Text style={[styles.summaryValue, styles.balanceValue]}>
                {currency} {balance.toFixed(2)}
              </ReactPdf.Text>
            </ReactPdf.View>
          </>
        )}
      </>
    );
  },
  defaultStyles: {
    summaryRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: "4pt",
    },
    summaryLabel: {
      fontSize: "10pt",
    },
    summaryValue: {
      fontSize: "10pt",
      textAlign: "right",
    },
    totalRow: {
      borderTop: "1pt solid #000",
      paddingTop: "6pt",
      marginTop: "6pt",
    },
    totalLabel: {
      fontWeight: "bold",
      fontSize: "12pt",
    },
    totalValue: {
      fontWeight: "bold",
      fontSize: "12pt",
    },
    balanceRow: {
      borderTop: "1pt solid #000",
      paddingTop: "6pt",
      marginTop: "6pt",
    },
    balanceLabel: {
      fontWeight: "bold",
      fontSize: "12pt",
    },
    balanceValue: {
      fontWeight: "bold",
      fontSize: "12pt",
    },
  } as const,
});

const invoiceTable = defineComponent({
  name: "invoiceTable",
  schema: z.object({
    strings: z
      .object({
        description: z.string().default(""),
        qty: z.string().default(""),
        unitPrice: z.string().default(""),
        total: z.string().default(""),
        subtotal: z.string().default(""),
        totalLabel: z.string().default(""),
        paymentMade: z.string().default(""),
        balanceDue: z.string().default(""),
      })
      .default({}),
    items: z.array(
      z.object({
        definition: z.object({
          description: z.string(),
          unitPrice: z.number(),
        }),
        quantity: z.number().optional(),
      }),
    ),
    modifiers: z
      .array(
        z.object({
          description: z.string(),
          rate: z.number(),
        }),
      )
      .optional(),
    invoice: z.object({
      currency: z.string().optional(),
      paymentMade: z.number().optional(),
    }),
  }),
  component: ({ spec, styles, getComponent }) => {
    const InvoiceTableRow = getComponent({ name: "invoiceTableRow" });
    const InvoiceSummary = getComponent({ name: "invoiceSummary" });

    const currency = spec.invoice.currency || "USD";
    const paymentMade = spec.invoice.paymentMade || 0;

    const subtotal = spec.items.reduce(
      (sum, item) => sum + item.definition.unitPrice * (item.quantity || 1),
      0,
    );

    const modifierTotal = (spec.modifiers || []).reduce(
      (sum, modifier) => sum + subtotal * modifier.rate,
      0,
    );

    const total = subtotal + modifierTotal;

    return (
      <>
        <ReactPdf.View style={styles.container}>
          {/* Table Header */}
          <ReactPdf.View style={styles.tableHeader}>
            <ReactPdf.Text style={[styles.headerCell, styles.descriptionCol]}>
              {spec.strings?.description}
            </ReactPdf.Text>
            <ReactPdf.Text style={[styles.headerCell, styles.qtyCol]}>
              {spec.strings?.qty}
            </ReactPdf.Text>
            <ReactPdf.Text style={[styles.headerCell, styles.priceCol]}>
              {spec.strings?.unitPrice}
            </ReactPdf.Text>
            <ReactPdf.Text style={[styles.headerCell, styles.totalCol]}>
              {spec.strings?.total}
            </ReactPdf.Text>
          </ReactPdf.View>

          {/* Table Rows */}
          {spec.items.map((item, index) => (
            <InvoiceTableRow key={index} item={item} currency={currency} />
          ))}

          {/* Summary Section */}
          <ReactPdf.View style={styles.summaryContainer}>
            <InvoiceSummary
              subtotal={subtotal}
              total={total}
              modifiers={spec.modifiers}
              paymentMade={paymentMade}
              currency={currency}
              strings={spec.strings}
            />
          </ReactPdf.View>
        </ReactPdf.View>
      </>
    );
  },
  defaultStyles: {
    container: {
      marginTop: "20pt",
      marginBottom: "20pt",
    },
    tableHeader: {
      display: "flex",
      flexDirection: "row",
      backgroundColor: "#f0f0f0",
      borderTop: "1pt solid #000",
      borderBottom: "1pt solid #000",
    },
    headerCell: {
      fontSize: "10pt",
      fontWeight: "bold",
      padding: "6pt",
      borderRight: "0.5pt solid #ccc",
    },
    descriptionCol: {
      flex: 3,
    },
    qtyCol: {
      flex: 1,
    },
    priceCol: {
      flex: 2,
      textAlign: "right",
    },
    totalCol: {
      flex: 2,
      textAlign: "right",
      borderRight: "none",
    },
    summaryContainer: {
      marginTop: "10pt",
      width: "50%",
      marginLeft: "auto",
    },
  } as const,
});

const body = defineComponent({
  name: "body",
  schema: z.object({
    body: z.string().optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent(defaultComponents.markdown);
    if (!spec.body) return null;

    return (
      <>
        <ReactPdf.View style={styles.container}>
          <Markdown style={styles.text} paragraphSpacing="14pt">
            {spec.body}
          </Markdown>
        </ReactPdf.View>
      </>
    );
  },
  defaultStyles: {
    container: {
      marginTop: "20pt",
    },
    text: { fontSize: "10pt" },
  } as const,
});

export default {
  config: {
    components: {
      header,
      toAddress,
      invoiceTable,
      invoiceTableRow,
      invoiceSummaryModifier,
      invoiceSummary,
      body,
    },
  },
  order: ["header", "toAddress", "invoiceTable", "body"],
  strings: {
    invoice: "INVOICE",
    invoiceNumber: "Invoice #:",
    date: "Date:",
    dueDate: "Due Date:",
    billTo: "Bill To:",
    shipTo: "Ship To:",
    description: "Description",
    qty: "Qty",
    unitPrice: "Unit Price",
    total: "Total",
    subtotal: "Subtotal",
    totalLabel: "Total",
    paymentMade: "Payment Made",
    balanceDue: "Balance Due",
  },
  styles: {
    page: {
      container: {
        paddingHorizontal: "48pt",
        paddingVertical: "40pt",
      },
    },
  },
};
