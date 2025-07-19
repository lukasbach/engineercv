import React from "react";
import z from "zod";
import * as fa from "react-icons/fa";
import * as io5 from "react-icons/io5";
import * as bs from "react-icons/bs";
import * as md from "react-icons/md";
import * as fi from "react-icons/fi";
import * as ai from "react-icons/ai";
import * as hi from "react-icons/hi";
import * as ci from "react-icons/ci";
import * as sl from "react-icons/sl";
import { Circle, Path, Svg, View } from "@react-pdf/renderer";
import { defineComponent } from "../define-component.js";

const library: Record<string, any> = { fa, io5, bs, md, fi, ai, hi, ci, sl };

export const iconComponent = defineComponent({
  name: "icon",
  schema: z.object({
    config: z.object({ useIcons: z.boolean().optional() }).optional(),
  }),
  additionalProps: z.object({
    icon: z.string(),
    suite: z.string().optional(),
    size: z.string().optional(),
    color: z.string().optional(),
  }),
  component: ({ icon, suite = "fa", size = "16pt", color, spec, styles }) => {
    if (!spec.config?.useIcons) return null;

    if (!(suite in library)) {
      throw new Error(`Icon suite "${suite}" not found`);
    }
    if (!(icon in library[suite])) {
      throw new Error(`Icon "${icon}" not found in suite "${suite}"`);
    }

    // https://github.com/diegomura/react-pdf/discussions/1334#discussioncomment-10525387
    const iconElement = library[suite][icon]({ fill: color });

    const paths = iconElement.props.children.filter(
      (child: any) => child.type === "path",
    );
    const circles = iconElement.props.children.filter(
      (child: any) => child.type === "circle",
    );

    const fill = iconElement.props.fill || "black";

    return (
      <View>
        <Svg
          viewBox={iconElement.props.attr.viewBox}
          style={[{ width: size, height: size }, styles.svg]}
        >
          {paths &&
            paths.map((path: any, index: any) => (
              <Path
                key={index}
                d={path.props.d}
                fill={path.props.fill || fill}
              />
            ))}
          {circles &&
            circles.map((circle: any, index: any) => (
              <Circle
                key={index}
                cx={circle.props.cx}
                cy={circle.props.cy}
                r={circle.props.r}
                fill={circle.props.fill || fill}
              />
            ))}
        </Svg>
      </View>
    );
  },
  defaultStyles: {
    svg: {},
  },
});
