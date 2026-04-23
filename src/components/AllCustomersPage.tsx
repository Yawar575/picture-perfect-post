import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Users,
  Trash2,
  UserPlus,
  Pencil,
  Search,
  RefreshCw,
  PencilLine,
  ChevronDown,
  ChevronUp,
  Mail,
  MapPin,
  Receipt,
} from "lucide-react";
import { useCustomers, type Customer, type PaymentStatus } from "@/lib/customers";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { EditCustomerDialog } from "@/components/EditCustomerDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Filter = "All" | PaymentStatus;

export function AllCustomersPage() {
  const { customers, remove, update, toggleStatus, setStatusAll } = useCustomers();
  const [editing, setEditing] = useState<Customer | null>(null);
  const [billing, setBilling] = useState<Customer | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      if (filter !== "All" && c.status !== filter) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    });
  }, [customers, query, filter]);

  const stats = useMemo(() => {
    let totalFees = 0;
    let paid = 0;
    let unpaid = 0;
    let pending = 0;
    for (const c of customers) {
      totalFees += Number(c.fees) || 0;
      if (c.status === "Paid") paid++;
      else if (c.status === "Unpaid") unpaid++;
      else pending++;
    }
    return { totalFees, paid, unpaid, pending };
  }, [customers]);

  function handleBulk(status: PaymentStatus) {
    if (customers.length === 0) return;
    if (window.confirm(`Mark all ${customers.length} customers as ${status}?`)) {
      setStatusAll(status);
      toast.success(`All marked as ${status}`);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <Toaster richColors position="top-right" />

      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              All Customers
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {customers.length} total record{customers.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new Event("customers:changed"));
            toast.success("Refreshed");
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </header>

      {customers.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <PencilLine className="h-4 w-4" />
            Edit All Status:
          </span>
          <button
            type="button"
            onClick={() => handleBulk("Paid")}
            className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          >
            Mark All Paid
          </button>
          <button
            type="button"
            onClick={() => handleBulk("Unpaid")}
            className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300"
          >
            Mark All Unpaid
          </button>
          <button
            type="button"
            onClick={() => handleBulk("Pending")}
            className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
          >
            Mark All Pending
          </button>
        </div>
      )}

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
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3.5 text-sm text-foreground shadow-[var(--shadow-card)] placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
              className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground shadow-[var(--shadow-card)] focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Net MB</th>
                    <th className="px-4 py-3 text-left font-semibold">Fees</th>
                    <th className="px-4 py-3 text-left font-semibold">Address</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        No customers match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c) => {
                      const isOpen = expanded === c.id;
                      return (
                        <FragmentRow
                          key={c.id}
                          c={c}
                          isOpen={isOpen}
                          onToggle={() => setExpanded(isOpen ? null : c.id)}
                          onEdit={() => setEditing(c)}
                          onDelete={() => {
                            if (window.confirm(`Delete ${c.name}?`)) {
                              remove(c.id);
                              toast.success("Customer removed");
                            }
                          }}
                          onCycleStatus={() => toggleStatus(c.id)}
                          onPrint={() => setBilling(c)}
                        />
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
            <span>
              Total: <span className="font-bold text-foreground">{customers.length}</span> customers
            </span>
            <span>
              Total Fees:{" "}
              <span className="font-bold text-foreground">
                {stats.totalFees.toLocaleString()}
              </span>
            </span>
            <span>
              Paid: <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.paid}</span>
            </span>
            <span>
              Unpaid: <span className="font-bold text-rose-600 dark:text-rose-400">{stats.unpaid}</span>
            </span>
            {stats.pending > 0 && (
              <span>
                Pending: <span className="font-bold text-amber-600 dark:text-amber-400">{stats.pending}</span>
              </span>
            )}
          </div>
        </>
      )}

      <EditCustomerDialog
        customer={editing}
        onClose={() => setEditing(null)}
        onSave={(id, patch) => update(id, patch)}
      />

      <BillDialog customer={billing} onClose={() => setBilling(null)} />
    </main>
  );
}

function BillDialog({
  customer,
  onClose,
}: {
  customer: Customer | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!customer} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm overflow-hidden p-0">
        <DialogHeader className="bg-primary px-6 py-5 text-primary-foreground">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Muna Networking
          </DialogTitle>
        </DialogHeader>
        {customer && (
          <div className="relative px-6 pb-6 pt-2">
            <div className="divide-y divide-border">
              <BillRow label="Name" value={customer.name} />
              <BillRow label="Net MB" value={`${customer.netMb} MB`} />
              <BillRow label="Date" value={customer.date || "—"} />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-muted px-4 py-3">
              <span className="text-sm font-semibold text-muted-foreground">
                Bill
              </span>
              <span className="text-2xl font-bold text-primary">
                {customer.fees}
              </span>
            </div>
            {customer.status === "Paid" && (
              <div
                aria-hidden
                className="pointer-events-none absolute right-4 top-6 -rotate-12 select-none rounded-md border-4 border-emerald-600 px-3 py-1 text-2xl font-extrabold uppercase tracking-widest text-emerald-600 opacity-80 shadow-sm"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Received
              </div>
            )}
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Take a screenshot and send to your customer
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function BillRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function StatusPill({ status }: { status: PaymentStatus }) {
  const cls =
    status === "Paid"
      ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
      : status === "Unpaid"
        ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300"
        : "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}

function FragmentRow({
  c,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
  onCycleStatus,
  onPrint,
}: {
  c: Customer;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCycleStatus: () => void;
  onPrint: () => void;
}) {
  return (
    <>
      <tr className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/30">
        <td className="px-4 py-3.5 font-bold text-foreground">{c.name}</td>
        <td className="px-4 py-3.5 text-muted-foreground">{c.email}</td>
        <td className="px-4 py-3.5 font-medium text-foreground">{c.netMb} MB</td>
        <td className="px-4 py-3.5 font-bold text-foreground">{c.fees}</td>
        <td className="px-4 py-3.5 text-muted-foreground">{c.address || "—"}</td>
        <td className="px-4 py-3.5 text-muted-foreground">{c.date || "—"}</td>
        <td className="px-4 py-3.5">
          <button type="button" onClick={onCycleStatus} aria-label="Cycle status">
            <StatusPill status={c.status} />
          </button>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={onToggle}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              aria-label="Show bill"
              title="Show bill"
            >
              <Receipt className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Edit customer"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete customer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
      {isOpen && (
        <tr className="border-b border-border bg-muted/20">
          <td colSpan={8} className="px-4 py-4">
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-foreground">{c.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-foreground">{c.address || "No address provided"}</span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}