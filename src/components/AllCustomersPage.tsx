import { Link } from "@tanstack/react-router";
import { Users, Trash2, UserPlus, Mail, MapPin } from "lucide-react";
import { useCustomers } from "@/lib/customers";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export function AllCustomersPage() {
  const { customers, remove, toggleStatus } = useCustomers();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Toaster richColors position="top-right" />
      <header className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Users className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            All Customers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customers.length === 0
              ? "No customers yet — add your first one."
              : `${customers.length} customer${customers.length === 1 ? "" : "s"} on record.`}
          </p>
        </div>
      </header>

      {customers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-[var(--shadow-card)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">No customers yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by adding your first customer.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-button)] transition-colors hover:bg-[var(--primary-hover)]"
          >
            <UserPlus className="h-4 w-4" />
            Add Customer
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {customers.map((c) => (
            <article
              key={c.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-bold text-foreground">{c.name}</h3>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{c.address}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    remove(c.id);
                    toast.success("Customer removed");
                  }}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete customer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Net MB</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">{c.netMb}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Fees</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">{c.fees}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Date</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">{c.date}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => toggleStatus(c.id)}
                className={
                  "mt-4 inline-flex w-full items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition-colors " +
                  (c.status === "Paid"
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300")
                }
              >
                {c.status} — tap to toggle
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}