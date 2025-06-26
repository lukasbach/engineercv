import { Link, Styles, Text } from "@react-pdf/renderer";
import React, { FC } from "react";
import ReactMarkdown from "react-markdown";

// https://www.npmjs.com/package/react-markdown#appendix-b-components
export const PdfMarkdown: FC<{
  children: string;
  style?: Styles;
}> = ({ children, style }) => {
  return (
    <Text style={style}>
      <ReactMarkdown
        components={{
          p: (props) => <Text>{props.children}</Text>,
          a: (props) => <Link src={props.href}>{props.children}</Link>,
        }}
      >
        {children}
      </ReactMarkdown>
    </Text>
  );
};
