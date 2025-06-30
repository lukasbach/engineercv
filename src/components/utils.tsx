import { Text } from "@react-pdf/renderer";
import React, { ReactNode } from "react";

export const joinComponents = (
  components: (ReactNode | null)[],
  seperator = "\u00A0–\u00A0",
): ReactNode =>
  components.filter(Boolean).map((component, index, arr) => (
    <React.Fragment key={index}>
      <Text>{component}</Text>
      {index < arr.length - 1 && <Text>{seperator}</Text>}
    </React.Fragment>
  ));