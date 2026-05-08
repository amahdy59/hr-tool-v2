import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] transition-all disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive font-[var(--button-font-weight)] cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 border border-transparent",
        outline:
          "border border-border bg-card text-foreground hover:bg-muted dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent",
        ghost:
          "hover:bg-muted hover:text-foreground dark:hover:bg-accent/50 border border-transparent",
        link: "text-primary underline-offset-4 hover:underline border-none p-0 h-auto",
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
