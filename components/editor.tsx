"use client"
import { Editor as TipEditor } from "novel";
import { usePathname } from "next/navigation";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  id:any
};

const Editor = ({
  onChange,
  id,
  initialContent,
}: EditorProps) => {
  const pathname=usePathname()
  return (
    <div>
      <TipEditor className="border-0 font-sans" onUpdate={(editor?)=> onChange(JSON.stringify(editor?.getHTML(), null, 2))} editorProps={{editable:()=>pathname.includes("preview")?false:true}} storageKey={id} defaultValue={initialContent}/>
    </div>
  )
}

export default Editor;
