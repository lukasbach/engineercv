/* eslint-disable vars-on-top,no-var */
import type * as zodLib from "zod";
import type * as reactPdfLib from "@react-pdf/renderer";
import type { defineComponent as defineComponentLib } from "./components/define-component.js";

declare global {
  var z: typeof zodLib.z;
  var ReactPdf: typeof reactPdfLib;
  var defineComponent: typeof defineComponentLib;
}
