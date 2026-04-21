import { useEffect, useState } from "react";

export type PaymentStatus = "Paid" | "Unpaid";

export type Customer = {
  id: string;
  name: string;
  email: string;
  address: string;
  netMb: number;
  fees: number;
  date: string;
  status: PaymentStatus;
  createdAt: number;
};

const STORAGE_KEY = "customers_v1";

function read(): Customer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Customer[]) : [];
  } catch {
    return [];
  }
}

function write(list: Customer[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("customers:changed"));
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setCustomers(read());
    const onChange = () => setCustomers(read());
    window.addEventListener("customers:changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("customers:changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return {
    customers,
    add: (c: Omit<Customer, "id" | "createdAt">) => {
      const next: Customer = {
        ...c,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      write([next, ...read()]);
    },
    remove: (id: string) => write(read().filter((c) => c.id !== id)),
    toggleStatus: (id: string) =>
      write(
        read().map((c) =>
          c.id === id ? { ...c, status: c.status === "Paid" ? "Unpaid" : "Paid" } : c,
        ),
      ),
  };
}