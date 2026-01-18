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
          allowedElements={[
            "p",
            "a",
            "strong",
            "em",
            "code",
            "del",
            "ul",
            "ol",
            "li",
          ]}
          components={{
            p: (props: any) =>
              paragraphSpacing ? (
                <View
                  style={[styles.paragraph, { marginBottom: paragraphSpacing }]}
                >
                  <Text>{props.children}</Text>
                </View>
              ) : (
                <Text style={styles.paragraph}>{props.children}</Text>
              ),
            a: (props: any) => {
              return (
                <Link src={props.href} style={styles.link}>
                  {props.children}
                </Link>
              );
            },
            strong: (props: any) => (
              <Text style={styles.strong}>{props.children}</Text>
            ),
            em: (props: any) => <Text style={styles.em}>{props.children}</Text>,
            code: (props: any) => (
              <Text style={styles.code}>{props.children}</Text>
            ),
            del: (props: any) => (
              <Text style={styles.del}>{props.children}</Text>
            ),
            ul: (props: any) => <View style={styles.ul}>{props.children}</View>,
            ol: (props: any) => <View style={styles.ol}>{props.children}</View>,
            li: (props: any) => (
              <View style={styles.li}>
                <Text style={styles.liBullet}>
                  {props.ordered ? `${(props.index ?? 0) + 1}. ` : "• "}
                </Text>
                <View style={styles.liContent}>{props.children}</View>
              </View>
            ),
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
    strong: { fontWeight: "bold" },
    em: { fontStyle: "italic" },
    code: { fontFamily: "Courier" },
    del: { textDecoration: "line-through" },
    ul: { marginLeft: 10 },
    ol: { marginLeft: 10 },
    li: { flexDirection: "row" },
    liBullet: { width: 10 },
    liContent: { flex: 1 },
  } as const,
});
