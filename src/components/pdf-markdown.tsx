import { Link, Styles, Text } from "@react-pdf/renderer";
import React, { FC } from "react";
import ReactMarkdown from "react-markdown";
import { useDocumentGlobals } from "./document-globals.js";

// https://www.npmjs.com/package/react-markdown#appendix-b-components
export const PdfMarkdown: FC<{
  children: string;
  style?: Styles;
}> = ({ children, style }) => {
  const { styles } = useDocumentGlobals();
  return (
    <Text style={style}>
      <ReactMarkdown
        components={{
          p: (props) => <Text style={styles.paragraph}>{props.children}</Text>,
          a: (props) => <Link src={props.href}>{props.children}</Link>,
        }}
      >
        {children}
      </ReactMarkdown>
    </Text>
  );
};
