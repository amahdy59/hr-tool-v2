import * as React from "react";

import { cn } from "./utils";
import { fieldControlClassName } from "./form-control";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea dir="auto"
      data-slot="textarea"
      className={cn(
        fieldControlClassName,
        "resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
