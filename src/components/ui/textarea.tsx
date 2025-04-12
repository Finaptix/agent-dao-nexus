
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const combinedRef = React.useMemo(() => {
      return (node: HTMLTextAreaElement) => {
        textareaRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      };
    }, [ref]);

    const resizeTextarea = React.useCallback(() => {
      if (!textareaRef.current || !autoResize) return;
      
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set the height to the scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }, [autoResize]);

    // Resize on content change
    React.useEffect(() => {
      if (!autoResize) return;
      
      resizeTextarea();
      
      // Add resize handler for window size changes
      window.addEventListener('resize', resizeTextarea);
      return () => {
        window.removeEventListener('resize', resizeTextarea);
      };
    }, [autoResize, resizeTextarea]);

    // Handle input changes
    const handleInput = React.useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        resizeTextarea();
      }
      if (props.onInput) {
        props.onInput(e);
      }
    }, [autoResize, props.onInput, resizeTextarea]);

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={combinedRef}
        onInput={handleInput}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
