declare module "@uiw/react-md-editor" {
  import * as React from "react";

  export type PreviewType = "live" | "edit" | "preview";

  export interface MDEditorProps {
    value?: string;
    onChange?: (value?: string) => void;
    height?: number;
    preview?: PreviewType;
    placeholder?: string;
    className?: string;
    visiableDragbar?: boolean;
    [key: string]: unknown;
  }

  export interface MDEditor extends React.ForwardRefExoticComponent<MDEditorProps> {}

  const MDEditor: MDEditor;
  export default MDEditor;
}
