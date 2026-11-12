
import Link from "next/link";
import { FlaskConical, ArrowLeft } from "lucide-react";

interface AuthHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
}

export function AuthHeader({
  showBack = false,
  onBack,
}: AuthHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
      ) : (
        <Link href="/" className="flex items-center gap-2 font-bold">
          <FlaskConical className="size-5 text-primary" />
          Tool Monitor
        </Link>
      )}

      {showBack && (
        <Link href="/" className="flex items-center gap-2 font-bold">
          <FlaskConical className="size-5 text-primary" />
          Tool Monitor
        </Link>
      )}
    </div>
  );
}
