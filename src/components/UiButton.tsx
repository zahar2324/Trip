
import type { Props } from "../../types/UiButton";

export default function UiButton({ children, onClick, loading, className = "", disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded ${className} ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" fill="none" />
          <path d="M4 12a8 8 0 0 0 8 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      ) : null}
      <span>{children}</span>
    </button>
  );
}