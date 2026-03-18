import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Undo2,
  Redo2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const RichTextEditor = ({ value, onChange, label }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const hasContent = useMemo(() => {
    const text = value.replace(/<[^>]*>/g, "").trim();
    return text.length > 0;
  }, [value]);

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const emitChange = () => {
    onChange(editorRef.current?.innerHTML || "");
  };

  const runCommand = (command: string, commandValue?: string) => {
    focusEditor();
    document.execCommand(command, false, commandValue);
    emitChange();
  };

  const applyBlock = (tag: "H1" | "H2" | "P") => {
    runCommand("formatBlock", tag);
  };

  const insertLink = () => {
    const trimmed = linkUrl.trim();
    if (!trimmed) return;
    runCommand("createLink", trimmed);
    setLinkUrl("");
  };

  return (
    <div className="space-y-3">
      {label ? <Label>{label}</Label> : null}
      <Card className="border-border/60 overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-border/60 bg-muted/30 p-3">
          <Button type="button" variant="outline" size="sm" onClick={() => applyBlock("H1")}>
            <Heading1 className="h-4 w-4" />
            H1
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => applyBlock("H2")}>
            <Heading2 className="h-4 w-4" />
            H2
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => applyBlock("P")}>
            Paragraph
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <Button type="button" variant="outline" size="sm" onClick={() => runCommand("bold")}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => runCommand("italic")}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => runCommand("insertUnorderedList")}>
            <List className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => runCommand("insertOrderedList")}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <Button type="button" variant="outline" size="sm" onClick={() => runCommand("undo")}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => runCommand("redo")}>
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-b border-border/60 bg-background p-3">
          <div className="flex flex-col gap-2 md:flex-row">
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              type="url"
            />
            <Button type="button" variant="outline" onClick={insertLink}>
              <LinkIcon className="h-4 w-4" />
              Insert Link
            </Button>
          </div>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          className="min-h-[260px] w-full bg-background px-4 py-3 text-sm text-foreground outline-none [&_a]:text-accent [&_a]:underline [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-2xl [&_h2]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc"
        />
      </Card>

      <p className="text-xs text-muted-foreground">
        Format updates visually here — headings, lists, bold text, and links will appear in the public popup.
      </p>
      {!hasContent ? (
        <p className="text-xs text-muted-foreground">Start typing to create rich content.</p>
      ) : null}
    </div>
  );
};

export default RichTextEditor;
