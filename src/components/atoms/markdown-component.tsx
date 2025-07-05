import { Link, Text, View } from "@react-pdf/renderer";
import React from "react";
import ReactMarkdown from "react-markdown";
import z from "zod";
import { defineComponent } from "../define-component.js";

export const markdownComponent = defineComponent({
  name: "markdown",
  schema: z.object({}),
  additionalProps: z.object({
    children: z.any(),
    style: z.any().optional(),
    paragraphSpacing: z.string().optional(),
  }),
  // https://www.npmjs.com/package/react-markdown#appendix-b-components
  component: ({ children, styles, style, paragraphSpacing }) =>
    // eslint-disable-next-line no-nested-ternary
    !children ? null : typeof children === "string" ? (
      <View style={style}>
        <ReactMarkdown
          components={{
            p: (props) =>
              paragraphSpacing ? (
                <View
                  style={[styles.paragraph, { marginBottom: paragraphSpacing }]}
                >
                  <Text>{`${props.children}`.replaceAll("\n", "")}</Text>
                </View>
              ) : (
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
      </View>
    ) : (
      children
    ),
  defaultStyles: {
    link: { color: "black", textDecoration: "none" },
    paragraph: {},
  } as const,
});
