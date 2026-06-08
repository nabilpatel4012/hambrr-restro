/**
 * Shared TypeScript definitions for Hambrr Kitchen Suite
 */

export type TabType = 'orders' | 'menu' | 'qr' | 'reports' | 'employees' | 'settings';

export type DietType = 'veg' | 'non-veg' | 'egg';

export interface OrderItem {
  name: string;
  qty: number;
}

export type OrderStatus = 'inbound' | 'queued' | 'preparing' | 'ready' | 'completed';

export interface Order {
  id: string; // e.g., "ORD-8821"
  tableId?: string; // e.g., "T4"
  channel: 'dine-in' | 'delivery' | 'takeaway';
  channelLabel: string; // e.g. "Dine-in Table T4"
  time: string; // order age or elapsed time e.g. "02:45"
  items: OrderItem[];
  totalBill: number;
  status: OrderStatus;
  stoveId?: string; // e.g. "STOVE 02"
  elapsedMinutes?: number;
  riderName?: string;
  riderStatus?: string;
  riderTime?: string;
  riderAvatar?: string;
  completedTimeAgo?: string;
  serverName?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  diet: DietType;
  inStock: boolean;
  variations?: { name: string; addPrice: number }[];
  addons?: { name: string; price: number }[];
  packagingCharge?: number;
  taxCategory?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  assignedCount: number;
  visible: boolean;
  icon: string;
}

export interface QRConfig {
  subdomain: string;
  customDomain: string;
  brandLogoUrl: string;
  heroBannerUrl: string;
  accentColor: string; // e.g. '#b02f00' (Zesty Orange)
}

export interface Table {
  id: string; // e.g., "T1"
  status: 'ordering' | 'ready' | 'empty';
  orderId?: string;
  itemsCount?: number;
  elapsedMinutes?: number;
  digitalOrderingActive: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  shiftStatus: 'clocked_in' | 'clocked_out';
  clockTime?: string;
  performance: number; // e.g., 5.0
  avatar: string;
  assignedCode: string; // e.g. "emp_42910"
}

export interface StoreSettings {
  operationalHours: {
    [day: string]: { open: string; close: string; active: boolean };
  };
  gstNumber: string;
  sgst: number;
  cgst: number;
  deliveryRadiusKm: number;
  deliveryBaseFee: number;
  deliveryFreeAbove: number;
  paymentMethods: {
    upi: boolean;
    card: boolean;
    cash: boolean;
    wallet: boolean;
  };
  allowTip: boolean;
  splitBills: boolean;
}
