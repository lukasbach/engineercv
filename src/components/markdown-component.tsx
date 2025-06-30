import { Link, Text } from "@react-pdf/renderer";
import React from "react";
import ReactMarkdown from "react-markdown";
import z from "zod";
import { defineComponent } from "./define-component.js";

export const markdownComponent = defineComponent({
  name: "markdown",
  schema: z.object({}),
  additionalProps: z.object({ children: z.any(), style: z.any().optional() }),
  // https://www.npmjs.com/package/react-markdown#appendix-b-components
  component: ({ children, styles, style }) =>
    // eslint-disable-next-line no-nested-ternary
    !children ? null : typeof children === "string" ? (
      <Text style={style}>
        <ReactMarkdown
          components={{
            p: (props) => (
              <Text style={styles.paragraph}>{props.children}</Text>
            ),
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
    ) : (
      children
    ),
  defaultStyles: {
    link: { color: "black", textDecoration: "none" },
    paragraph: {},
  } as const,
});
