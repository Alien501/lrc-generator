import { useRef } from "react";
import { Button } from "../ui/button";

type OptionMenuProps = {
  label: string;
  ctaText: string;
  id: string;
  inputType?: "file" | "function";
  fileType?: string;
  onClick?: (e: any) => void;
};

export default function OptionMenu({
  label,
  ctaText,
  id,
  inputType = "function",
  fileType = "**/**",
  onClick = () => {},
}: OptionMenuProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (e: React.MouseEvent) => {
    if (inputType === "file") {
      inputRef.current?.click();
    } else {
      onClick(e);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div>
        {inputType === "file" && (
          <input
            ref={inputRef}
            onChange={onClick}
            id={id}
            accept={fileType}
            type="file"
            className="hidden"
          />
        )}
        <Button className="rounded-sm p-3" onClick={handleButtonClick}>
          {ctaText}
        </Button>
      </div>
    </div>
  );
}
