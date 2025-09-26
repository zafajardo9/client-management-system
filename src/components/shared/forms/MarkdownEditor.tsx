"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { MDEditorProps } from "@uiw/react-md-editor";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
}) as ComponentType<MDEditorProps>;

export type MarkdownEditorProps = MDEditorProps;

export default function MarkdownEditor(props: MarkdownEditorProps) {
  return <MDEditor {...props} />;
}
