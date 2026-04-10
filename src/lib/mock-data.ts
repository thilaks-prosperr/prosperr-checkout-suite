export type SessionStatus =
  | "INITIATED"
  | "OTP_SENT"
  | "OTP_VERIFIED"
  | "AWAITING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "SELF_APPROVED"
  | "PAYMENT_LINK_GENERATED"
  | "PAYMENT_PENDING"
  | "PAYMENT_COMPLETED"
  | "PAYMENT_FAILED"
  | "DRAFT"
  | "EXPIRED"
  | "TIMEOUT";

export interface TimelineEvent {
  event: string;
  time: string;
  status: SessionStatus;
}

export interface CheckoutSession {
  id: string;
  status: SessionStatus;
  prospectName: string;
  prospectMobile: string;
  prospectEmail: string;
  categoryId: string;
  categoryName: string;
  planAmount: number;
  payableAmount: number;
  discountAmount: number;
  gstAmount: number;
  validity: string;
  startDate: string;
  endDate: string;
  bdaName: string;
  createdAt: string;
  expiresAt: string;
  superiors: string[];
  approvalRequestedAt: string;
  coinBalance: number;
  consumedCoins: number;
  selfApproved?: boolean;
  approvedBy?: string;
  rejectionReason?: string;
  notes?: string;
  timeline: TimelineEvent[];
  dependents?: { name: string; planType: string }[];
  isRenewal?: boolean;
}

export interface Subscriber {
  name: string;
  mobile: string;
  plan: string;
  activeSince: string;
  expiresAt: string;
  daysRemaining: number;
  subscriptionId: string;
}

export interface PlanOption {
  id: string;
  name: string;
  price: number;
  discountedPrice: number;
  minPrice: number;
  maxPrice: number;
}

export const planOptions: PlanOption[] = [
  { id: "SS_BASIC", name: "Super Saver Basic", price: 6000, discountedPrice: 5000, minPrice: 3000, maxPrice: 6000 },
  { id: "SS_PREMIUM", name: "Super Saver Premium", price: 12000, discountedPrice: 10000, minPrice: 5000, maxPrice: 12000 },
  { id: "SS_ELITE", name: "Super Saver Elite", price: 25000, discountedPrice: 20000, minPrice: 12000, maxPrice: 25000 },
];

export const mockSession: CheckoutSession = {
  id: "01HRX5K2J8NQPWXYZ",
  status: "AWAITING_APPROVAL",
  prospectName: "Ravi Kumar",
  prospectMobile: "8660319759",
  prospectEmail: "ravi.kumar@gmail.com",
  categoryId: "SS_PREMIUM",
  categoryName: "Super Saver Premium",
  planAmount: 12000,
  payableAmount: 7000,
  discountAmount: 5000,
  gstAmount: 1068,
  validity: "1 year",
  startDate: "2025-04-01",
  endDate: "2026-04-01",
  bdaName: "Anjali D.",
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  superiors: ["Rahul M.", "Priya K.", "Suresh T."],
  approvalRequestedAt: new Date().toISOString(),
  coinBalance: 200,
  consumedCoins: 0,
  notes: "Client insisted on 7k. Very warm lead, ready to sign. Please approve.",
  dependents: [
    { name: "Meera Kumar", planType: "Dependent Filing" },
  ],
  timeline: [
    { event: "Session created", time: "2:34 PM", status: "INITIATED" },
    { event: "OTP sent to +91 XXXXXX4759", time: "2:35 PM", status: "OTP_SENT" },
    { event: "OTP verified", time: "2:36 PM", status: "OTP_VERIFIED" },
    { event: "Approval requested", time: "2:36 PM", status: "AWAITING_APPROVAL" },
  ],
};

export const mockSubscriber: Subscriber = {
  name: "Ravi Kumar",
  mobile: "8660319759",
  plan: "Super Saver Premium",
  activeSince: "2025-03-01",
  expiresAt: "2026-03-01",
  daysRemaining: 23,
  subscriptionId: "sub_01HRX5K2J8",
};

export const mockSessions: CheckoutSession[] = [
  mockSession,
  {
    ...mockSession,
    id: "01HRX5K2J8ABCDEFG",
    prospectName: "Priya Sharma",
    prospectMobile: "9876543210",
    prospectEmail: "priya.s@gmail.com",
    status: "PAYMENT_COMPLETED",
    payableAmount: 10000,
    discountAmount: 2000,
    selfApproved: false,
    approvedBy: "Rahul M.",
    timeline: [
      ...mockSession.timeline,
      { event: "Approved by Rahul M.", time: "2:37 PM", status: "APPROVED" },
      { event: "Payment link generated", time: "2:37 PM", status: "PAYMENT_LINK_GENERATED" },
      { event: "Payment completed ✓", time: "2:41 PM", status: "PAYMENT_COMPLETED" },
    ],
  },
  {
    ...mockSession,
    id: "01HRX5K2J8HIJKLMN",
    prospectName: "Amit Patel",
    prospectMobile: "7890123456",
    status: "SELF_APPROVED",
    selfApproved: true,
    payableAmount: 4500,
    discountAmount: 7500,
    timeline: [
      ...mockSession.timeline,
      { event: "Approval timeout", time: "2:39 PM", status: "TIMEOUT" },
      { event: "Self-approved by Anjali D.", time: "2:40 PM", status: "SELF_APPROVED" },
    ],
  },
  {
    ...mockSession,
    id: "01HRX5K2J8OPQRSTU",
    prospectName: "Sneha Reddy",
    prospectMobile: "9123456780",
    status: "DRAFT",
    payableAmount: 8000,
    discountAmount: 4000,
  },
];

export const mockPendingApprovals: CheckoutSession[] = [
  mockSession,
  {
    ...mockSession,
    id: "01HRX5K2J8VWXYZ01",
    prospectName: "Karthik N.",
    prospectMobile: "9988776655",
    bdaName: "Vikram S.",
    payableAmount: 4000,
    discountAmount: 8000,
    notes: "Long-time referral from existing client. Needs approval for special pricing.",
    approvalRequestedAt: new Date(Date.now() - 60000).toISOString(),
  },
];

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMobile(mobile: string): string {
  if (mobile.length === 10) {
    return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;
  }
  return mobile;
}

export function maskMobile(mobile: string): string {
  if (mobile.length >= 10) {
    return `+91 XXXXXX${mobile.slice(-4)}`;
  }
  return mobile;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function getSessionShortId(id: string): string {
  return id.slice(-8).toUpperCase();
}
