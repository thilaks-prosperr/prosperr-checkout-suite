import { createContext, useContext } from "react";
import type { CheckoutSession } from "./mock-data";

export interface SalesAuth {
  isAuthenticated: boolean;
  name: string;
  email: string;
  role: "bda" | "superior";
}

export interface AppState {
  salesAuth: SalesAuth | null;
  sessions: CheckoutSession[];
}

export const defaultSalesAuth: SalesAuth = {
  isAuthenticated: true,
  name: "Anjali D.",
  email: "anjali@prosperr.io",
  role: "bda",
};

export const superiorAuth: SalesAuth = {
  isAuthenticated: true,
  name: "Rahul M.",
  email: "rahul@prosperr.io",
  role: "superior",
};
