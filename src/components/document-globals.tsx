import { createContext, useContext } from "react";
import { Style } from "@react-pdf/stylesheet";

export interface DocumentGlobals {
  styles: Record<string, Style>;
  spec: any;
}

const DocumentGlobalsContext = createContext<DocumentGlobals | null>(null);

export const useDocumentGlobals = (): DocumentGlobals => {
  const context = useContext(DocumentGlobalsContext);
  if (!context) {
    throw new Error(
      "useDocumentGlobals must be used within a DocumentGlobalsProvider",
    );
  }
  return context;
};

export const DocumentGlobalsProvider = DocumentGlobalsContext.Provider;
