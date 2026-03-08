export interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  paymentMethod: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended";
  joinDate: string;
  orders: number;
}

export const orders: Order[] = [
  { id: "ORD-001", customer: "Sarah Johnson", email: "sarah@email.com", items: 3, total: 529.97, status: "delivered", date: "2026-03-07", paymentMethod: "Stripe" },
  { id: "ORD-002", customer: "Michael Chen", email: "michael@email.com", items: 1, total: 449.99, status: "shipped", date: "2026-03-07", paymentMethod: "PayPal" },
  { id: "ORD-003", customer: "Emily Rodriguez", email: "emily@email.com", items: 2, total: 319.98, status: "processing", date: "2026-03-06", paymentMethod: "Stripe" },
  { id: "ORD-004", customer: "James Wilson", email: "james@email.com", items: 4, total: 694.96, status: "pending", date: "2026-03-06", paymentMethod: "Credit Card" },
  { id: "ORD-005", customer: "Anna Park", email: "anna@email.com", items: 1, total: 79.99, status: "cancelled", date: "2026-03-05", paymentMethod: "Stripe" },
  { id: "ORD-006", customer: "David Lee", email: "david@email.com", items: 2, total: 259.98, status: "delivered", date: "2026-03-05", paymentMethod: "PayPal" },
  { id: "ORD-007", customer: "Maria Garcia", email: "maria@email.com", items: 5, total: 899.95, status: "shipped", date: "2026-03-04", paymentMethod: "Stripe" },
  { id: "ORD-008", customer: "Tom Brown", email: "tom@email.com", items: 1, total: 199.99, status: "processing", date: "2026-03-04", paymentMethod: "Credit Card" },
];

export const adminUsers: AdminUser[] = [
  { id: "USR-001", name: "Sarah Johnson", email: "sarah@email.com", role: "Customer", status: "active", joinDate: "2025-11-15", orders: 12 },
  { id: "USR-002", name: "Michael Chen", email: "michael@email.com", role: "Premium", status: "active", joinDate: "2025-09-20", orders: 28 },
  { id: "USR-003", name: "Emily Rodriguez", email: "emily@email.com", role: "Customer", status: "active", joinDate: "2026-01-05", orders: 5 },
  { id: "USR-004", name: "James Wilson", email: "james@email.com", role: "Customer", status: "suspended", joinDate: "2025-12-10", orders: 3 },
];

export const revenueData = [
  { month: "Sep", revenue: 28400, orders: 186 },
  { month: "Oct", revenue: 34200, orders: 224 },
  { month: "Nov", revenue: 52800, orders: 348 },
  { month: "Dec", revenue: 71200, orders: 465 },
  { month: "Jan", revenue: 41600, orders: 272 },
  { month: "Feb", revenue: 45800, orders: 301 },
  { month: "Mar", revenue: 38900, orders: 248 },
];

export const categoryDistribution = [
  { name: "Electronics", value: 35, fill: "hsl(43, 74%, 49%)" },
  { name: "Fashion", value: 25, fill: "hsl(43, 80%, 65%)" },
  { name: "Home & Living", value: 18, fill: "hsl(220, 15%, 40%)" },
  { name: "Accessories", value: 12, fill: "hsl(220, 15%, 55%)" },
  { name: "Beauty", value: 10, fill: "hsl(220, 10%, 35%)" },
];
