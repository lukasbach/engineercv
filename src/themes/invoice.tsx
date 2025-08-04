import "../module-globals.js";
import React from "react";

const header = defineComponent({
  name: "header",
  schema: z.object({
    fromAddress: z.string().array().optional(),
    invoice: z.object({
      invoiceNumber: z.string(),
      date: z.string(),
      dueDate: z.string(),
    }),
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent({ name: "markdown" });
    return (
      <>
        <ReactPdf.View style={styles.container}>
          <ReactPdf.View style={styles.headerRow}>
            <ReactPdf.View style={styles.fromSection}>
              <ReactPdf.Text style={styles.title}>INVOICE</ReactPdf.Text>
              <Markdown style={styles.fromAddress}>
                {spec.fromAddress?.join("\n")}
              </Markdown>
            </ReactPdf.View>
            <ReactPdf.View style={styles.invoiceDetails}>
              <ReactPdf.View style={styles.detailRow}>
                <ReactPdf.Text style={styles.label}>Invoice #:</ReactPdf.Text>
                <ReactPdf.Text style={styles.value}>{spec.invoice.invoiceNumber}</ReactPdf.Text>
              </ReactPdf.View>
              <ReactPdf.View style={styles.detailRow}>
                <ReactPdf.Text style={styles.label}>Date:</ReactPdf.Text>
                <ReactPdf.Text style={styles.value}>{spec.invoice.date}</ReactPdf.Text>
              </ReactPdf.View>
              <ReactPdf.View style={styles.detailRow}>
                <ReactPdf.Text style={styles.label}>Due Date:</ReactPdf.Text>
                <ReactPdf.Text style={styles.value}>{spec.invoice.dueDate}</ReactPdf.Text>
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
    toAddress: z.string().array().optional(),
    shipAddress: z.string().array().optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent({ name: "markdown" });
    const billTo = spec.toAddress;
    const shipTo = spec.shipAddress;
    
    return (
      <>
        <ReactPdf.View style={styles.container}>
          <ReactPdf.View style={styles.addressRow}>
            <ReactPdf.View style={styles.addressSection}>
              <ReactPdf.Text style={styles.addressLabel}>Bill To:</ReactPdf.Text>
              <Markdown style={styles.address}>
                {billTo?.join("\n")}
              </Markdown>
            </ReactPdf.View>
            {shipTo && shipTo !== billTo && (
              <ReactPdf.View style={styles.addressSection}>
                <ReactPdf.Text style={styles.addressLabel}>Ship To:</ReactPdf.Text>
                <Markdown style={styles.address}>
                  {shipTo?.join("\n")}
                </Markdown>
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

const invoiceTable = defineComponent({
  name: "invoiceTable",
  schema: z.object({
    items: z.array(z.object({
      definition: z.object({
        description: z.string(),
        unitPrice: z.number(),
      }),
      count: z.number().optional().default(1),
    })),
    modifiers: z.array(z.object({
      description: z.string(),
      rate: z.number(),
    })).optional(),
    invoice: z.object({
      currency: z.string().optional().default("USD"),
      paymentMade: z.number().optional().default(0),
    }),
  }),
  component: ({ spec, styles }) => {
    const subtotal = spec.items.reduce((sum, item) => 
      sum + (item.definition.unitPrice * (item.count || 1)), 0
    );
    
    const modifierTotal = (spec.modifiers || []).reduce((sum, modifier) => 
      sum + (subtotal * modifier.rate), 0
    );
    
    const total = subtotal + modifierTotal;
    const balance = total - (spec.invoice.paymentMade || 0);
    
    return (
      <>
        <ReactPdf.View style={styles.container}>
          {/* Table Header */}
          <ReactPdf.View style={styles.tableHeader}>
            <ReactPdf.Text style={[styles.headerCell, styles.descriptionCol]}>Description</ReactPdf.Text>
            <ReactPdf.Text style={[styles.headerCell, styles.qtyCol]}>Qty</ReactPdf.Text>
            <ReactPdf.Text style={[styles.headerCell, styles.priceCol]}>Unit Price</ReactPdf.Text>
            <ReactPdf.Text style={[styles.headerCell, styles.totalCol]}>Total</ReactPdf.Text>
          </ReactPdf.View>
          
          {/* Table Rows */}
          {spec.items.map((item, index) => {
            const lineTotal = item.definition.unitPrice * (item.count || 1);
            return (
              <ReactPdf.View key={index} style={styles.tableRow}>
                <ReactPdf.Text style={[styles.cell, styles.descriptionCol]}>
                  {item.definition.description}
                </ReactPdf.Text>
                <ReactPdf.Text style={[styles.cell, styles.qtyCol]}>
                  {item.count || 1}
                </ReactPdf.Text>
                <ReactPdf.Text style={[styles.cell, styles.priceCol]}>
                  {spec.invoice.currency} {item.definition.unitPrice.toFixed(2)}
                </ReactPdf.Text>
                <ReactPdf.Text style={[styles.cell, styles.totalCol]}>
                  {spec.invoice.currency} {lineTotal.toFixed(2)}
                </ReactPdf.Text>
              </ReactPdf.View>
            );
          })}
          
          {/* Summary Section */}
          <ReactPdf.View style={styles.summarySection}>
            <ReactPdf.View style={styles.summaryRow}>
              <ReactPdf.Text style={styles.summaryLabel}>Subtotal:</ReactPdf.Text>
              <ReactPdf.Text style={styles.summaryValue}>
                {spec.invoice.currency} {subtotal.toFixed(2)}
              </ReactPdf.Text>
            </ReactPdf.View>
            
            {(spec.modifiers || []).map((modifier, index) => (
              <ReactPdf.View key={index} style={styles.summaryRow}>
                <ReactPdf.Text style={styles.summaryLabel}>
                  {modifier.description} ({(modifier.rate * 100).toFixed(0)}%):
                </ReactPdf.Text>
                <ReactPdf.Text style={styles.summaryValue}>
                  {spec.invoice.currency} {(subtotal * modifier.rate).toFixed(2)}
                </ReactPdf.Text>
              </ReactPdf.View>
            ))}
            
            <ReactPdf.View style={[styles.summaryRow, styles.totalRow]}>
              <ReactPdf.Text style={[styles.summaryLabel, styles.totalLabel]}>Total:</ReactPdf.Text>
              <ReactPdf.Text style={[styles.summaryValue, styles.totalValue]}>
                {spec.invoice.currency} {total.toFixed(2)}
              </ReactPdf.Text>
            </ReactPdf.View>
            
            {(spec.invoice.paymentMade || 0) > 0 && (
              <>
                <ReactPdf.View style={styles.summaryRow}>
                  <ReactPdf.Text style={styles.summaryLabel}>Payment Made:</ReactPdf.Text>
                  <ReactPdf.Text style={styles.summaryValue}>
                    -{spec.invoice.currency} {(spec.invoice.paymentMade || 0).toFixed(2)}
                  </ReactPdf.Text>
                </ReactPdf.View>
                <ReactPdf.View style={[styles.summaryRow, styles.balanceRow]}>
                  <ReactPdf.Text style={[styles.summaryLabel, styles.balanceLabel]}>Balance Due:</ReactPdf.Text>
                  <ReactPdf.Text style={[styles.summaryValue, styles.balanceValue]}>
                    {spec.invoice.currency} {balance.toFixed(2)}
                  </ReactPdf.Text>
                </ReactPdf.View>
              </>
            )}
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
    tableRow: {
      display: "flex",
      flexDirection: "row",
      borderBottom: "0.5pt solid #ccc",
    },
    headerCell: {
      fontSize: "10pt",
      fontWeight: "bold",
      padding: "6pt",
      borderRight: "0.5pt solid #ccc",
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
      textAlign: "center",
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
    summarySection: {
      marginTop: "20pt",
      width: "50%",
      marginLeft: "auto",
    },
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
      color: "#d00",
    },
    balanceValue: {
      fontWeight: "bold",
      fontSize: "12pt",
      color: "#d00",
    },
  } as const,
});

const body = defineComponent({
  name: "body",
  schema: z.object({
    body: z.string().optional(),
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent({ name: "markdown" });
    if (!spec.body) return null;
    
    return (
      <>
        <ReactPdf.View style={styles.container}>
          <Markdown style={styles.text}>{spec.body}</Markdown>
        </ReactPdf.View>
      </>
    );
  },
  defaultStyles: {
    container: {
      marginTop: "20pt",
    },
    text: {
      fontSize: "10pt",
      lineHeight: "1.4",
    },
  } as const,
});

export default {
  config: {
    components: {
      header,
      toAddress,
      invoiceTable,
      body,
    },
  },
  order: ["header", "toAddress", "invoiceTable", "body"],
};
