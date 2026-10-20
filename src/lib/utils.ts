import { toast } from "sonner";

export { cn } from "cn"

export async function readFromClipboard() {
    const clipboardContent = await navigator.clipboard.readText();
    toast.success("Pasted content from Clipboard successfully!");
    return clipboardContent;
}

export async function copyToClipboard(textToCopy: string) {
    await navigator.clipboard.writeText(textToCopy);
    toast.success("Copied content to Clipboard successfully!");
}