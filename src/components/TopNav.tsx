import { Link, useLocation } from "@tanstack/react-router";
import { UserPlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopNav() {
  const location = useLocation();
  const isAdd = location.pathname === "/";
  const isList = location.pathname === "/customers";

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-end gap-2 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
            isAdd
              ? "bg-primary text-primary-foreground shadow-[var(--shadow-button)]"
              : "text-foreground hover:bg-muted",
          )}
        >
          <UserPlus className="h-4 w-4" />
          Add Customer
        </Link>
        <Link
          to="/customers"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
            isList
              ? "bg-primary text-primary-foreground shadow-[var(--shadow-button)]"
              : "text-foreground hover:bg-muted",
          )}
        >
          <Users className="h-4 w-4" />
          All Customers
        </Link>
      </div>
    </header>
  );
}