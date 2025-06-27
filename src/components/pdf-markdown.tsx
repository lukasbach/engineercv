import { Link, Text } from "@react-pdf/renderer";
import React, { FC } from "react";
import ReactMarkdown from "react-markdown";
import { Style } from "@react-pdf/stylesheet";
import { useDocumentGlobals } from "./document-globals.js";

// https://www.npmjs.com/package/react-markdown#appendix-b-components
export const PdfMarkdown: FC<{
  children: string;
  style?: Style | Style[];
}> = ({ children, style }) => {
  const { styles } = useDocumentGlobals();
  return (
    <Text style={style}>
      <ReactMarkdown
        components={{
          p: (props) => <Text style={styles.paragraph}>{props.children}</Text>,
          a: (props) => (
            <Link src={props.href} style={styles.link}>
              {props.children}
            </Link>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </Text>
  );
};
