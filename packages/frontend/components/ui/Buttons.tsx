import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left",
  children,
  onClick,
  type = "button",
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 active:scale-95",
        // variants
        variant === "primary" && "btn-primary",
        variant === "secondary" && "btn-secondary",
        // sizes
        size === "sm" && "px-3.5 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        // states
        fullWidth && "w-full",
        loading && "relative text-transparent pointer-events-none",
        (disabled || loading) && "opacity-45 cursor-not-allowed",
        className,
      )}
    >
      {/* Loading spinner */}
      {loading && (
        <span className="absolute w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="w-4 h-4 flex-shrink-0">{icon}</span>
      )}
    </button>
  );
}
