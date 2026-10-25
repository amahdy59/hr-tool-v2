import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] transition-all duration-200 ease-out active:scale-[0.98] hover:-translate-y-[0.5px] motion-reduce:transform-none motion-reduce:transition-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive font-[var(--button-font-weight)] cursor-pointer disabled:cursor-not-allowed shadow-2xs hover:shadow-xs",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-blue-600 to-blue-700 text-primary-foreground hover:from-blue-500 hover:to-blue-600 active:from-blue-700 active:to-blue-800 border border-blue-500/30",
        destructive:
          "bg-gradient-to-b from-red-600 to-red-700 text-destructive-foreground hover:from-red-500 hover:to-red-600 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 border border-red-500/30",
        outline:
          "border border-border/80 bg-card text-foreground hover:bg-muted dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent",
        ghost:
          "hover:bg-muted hover:text-foreground dark:hover:bg-accent/50 border border-transparent shadow-none",
        link: "text-primary underline-offset-4 hover:underline border-none p-0 h-auto shadow-none",
      },
      size: {
        default: "px-[var(--button-padding-x-default)] py-[var(--button-padding-y)] h-[var(--button-height-default)] text-[length:var(--button-font-size-default)]",
        sm: "px-[var(--button-padding-x-sm)] py-[var(--button-padding-y)] h-[var(--button-height-sm)] text-[length:var(--button-font-size-sm)]",
        lg: "px-[var(--button-padding-x-lg)] py-[var(--button-padding-y)] h-[var(--button-height-lg)] text-[length:var(--button-font-size-lg)]",
        icon: "size-[var(--button-height-default)] p-0 text-[length:var(--button-font-size-default)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const buttonProps = !asChild && !props.type ? { type: "button" as const } : {};

    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...buttonProps}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
