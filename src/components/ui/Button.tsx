import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "link" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-primary text-white hover:bg-primary/90 shadow-sm":
              variant === "primary",
            "border border-primary bg-transparent hover:bg-primary/10 text-primary":
              variant === "secondary",
            "border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900":
              variant === "outline",
            "bg-danger text-white hover:bg-danger/90 shadow-sm":
              variant === "danger",
            "hover:bg-slate-100 hover:text-slate-900 text-slate-700":
              variant === "ghost",
            "text-primary underline-offset-4 hover:underline":
              variant === "link",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };

