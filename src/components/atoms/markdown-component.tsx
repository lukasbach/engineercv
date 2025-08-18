import { Link, Text, View } from "@react-pdf/renderer";
import React from "react";
import ReactMarkdown from "react-markdown";
import z from "zod";
import { defineComponent } from "../define-component.js";

export const Wrapper = ({
  children,
  paragraphSpacing,
  styles,
  style,
}: {
  children: any;
  paragraphSpacing?: string;
  styles: any;
  style?: any;
}) => {
  return (
    <View style={style}>
      {typeof children === "string" ? (
        <ReactMarkdown
          allowedElements={["p", "a"]}
          components={{
            p: (props) =>
              paragraphSpacing ? (
                <View
                  style={[styles.paragraph, { marginBottom: paragraphSpacing }]}
                >
                  <Text>{props.children}</Text>
                </View>
              ) : (
                <Text style={styles.paragraph}>{props.children}</Text>
              ),
            a: (props) => {
              return (
                <Link src={props.href} style={styles.link}>
                  {props.children}
                </Link>
              );
            },
          }}
        >
          {children}
        </ReactMarkdown>
      ) : (
        children
      )}
    </View>
  );
};

export const markdownComponent = defineComponent({
  name: "markdown",
  schema: z.object({}),
  additionalProps: z.object({
    children: z.any(),
    style: z.any().nullish(),
    paragraphSpacing: z.string().optional(),
  }),
  // https://www.npmjs.com/package/react-markdown#appendix-b-components
  component: ({ children, styles, style, paragraphSpacing }) => {
    if (!children) return null;
    if (typeof children !== "string" && !Array.isArray(children))
      return children;

    return Array.isArray(children) ? (
      children.map((item, index) => (
        <Wrapper
          key={index}
          children={item}
          paragraphSpacing={paragraphSpacing}
          styles={styles}
          style={style}
        />
      ))
    ) : (
      <Wrapper
        children={children}
        paragraphSpacing={paragraphSpacing}
        styles={styles}
        style={style}
      />
    );
  },
  defaultStyles: {
    link: { color: "black", textDecoration: "none" },
    paragraph: {},
  } as const,
});
