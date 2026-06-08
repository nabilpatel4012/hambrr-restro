import { Order, MenuItem, MenuCategory, QRConfig, Table, Employee, StoreSettings } from './types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: '#ORD-8821',
    tableId: 'T4',
    channel: 'dine-in',
    channelLabel: 'Dine-in Table T4',
    time: '02:45',
    items: [
      { name: 'Classic Hambrr (No Onion)', qty: 2 },
      { name: 'Truffle Fries (Large)', qty: 1 },
      { name: 'Coke Zero', qty: 2 }
    ],
    totalBill: 1450.00,
    status: 'inbound',
    elapsedMinutes: 2
  },
  {
    id: '#ORD-8825',
    tableId: 'T1',
    channel: 'delivery',
    channelLabel: 'Hambrr Delivery',
    time: '00:32',
    items: [
      { name: 'Peri Peri Feast Burger', qty: 1 },
      { name: 'Choco Lava Cake', qty: 1 }
    ],
    totalBill: 680.00,
    status: 'inbound',
    elapsedMinutes: 0
  },
  {
    id: '#ORD-8812',
    tableId: 'T12',
    channel: 'dine-in',
    channelLabel: 'TABLE T12 • STOVE 02',
    time: '08:12',
    items: [
      { name: 'Mushroom Swiss', qty: 3 },
      { name: 'Bacon BBQ Special', qty: 1 }
    ],
    totalBill: 1650.00,
    status: 'preparing',
    stoveId: 'STOVE 02',
    elapsedMinutes: 8
  },
  {
    id: '#ORD-8815',
    tableId: 'T2',
    channel: 'dine-in',
    channelLabel: 'TABLE T02 • STOVE 01',
    time: '02:45',
    items: [
      { name: 'Loaded Nachos', qty: 2 }
    ],
    totalBill: 580.00,
    status: 'queued',
    stoveId: 'STOVE 01',
    elapsedMinutes: 2
  },
  {
    id: '#ORD-8805',
    tableId: 'T7',
    channel: 'delivery',
    channelLabel: 'Zomato Delivery • 4 Items',
    time: '02:00',
    items: [
      { name: 'Sameer Khan', qty: 1 } // Used for rider association
    ],
    totalBill: 1220.00,
    status: 'ready',
    riderName: 'Sameer Khan',
    riderStatus: 'Arriving in 2 mins',
    riderAvatar: 'https://lh3.googleusercontent.com/aida/AP1WRLvE2yyEZyf3J2cpiIVMKjyFwjurnSJh712Xjrn3GirTAW9jSAimfE__Rov9ytrOmAawO1lIi7TpmmbSADUSCWxtVhxt02PezwO7mY9SGuuhDIPjRypmAut20NI8nkjjgmB4nkdfzvIEdJgdLZW_OQNPRjIcixN0q4A_l9K-fZb96Wh6DrkdIXpJil5Tro_aatfqXVKX1YuFW-A2SeCjXcTaT3UYcN8QzWTzy-GdAHkWqFbWS6Ek5BJ40RAM'
  },
  {
    id: '#ORD-8798',
    channel: 'dine-in',
    channelLabel: 'Dine-in • Handed over 12m ago',
    time: '12:00',
    items: [],
    totalBill: 2450.00,
    status: 'completed',
    completedTimeAgo: '12m ago',
    serverName: 'Rajesh M.'
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Classic Veg Burger',
    description: 'Crispy vegetable patty with house-made thousand island dressing.',
    price: 189.00,
    category: 'Starters',
    diet: 'veg',
    inStock: true,
    variations: [
      { name: 'Regular', addPrice: 0 },
      { name: 'Large (Double Patty)', addPrice: 65.00 }
    ],
    addons: [
      { name: 'Extra Cheese', price: 20 },
      { name: 'Caramelized Onions', price: 15 },
      { name: 'Jalapenos', price: 10 }
    ],
    packagingCharge: 12.00,
    taxCategory: 'GST 5%'
  },
  {
    id: 'item-2',
    name: 'Peri-Peri Chicken Wings',
    description: '6 pieces of juicy chicken wings tossed in spicy peri-peri sauce.',
    price: 259.00,
    category: 'Starters',
    diet: 'non-veg',
    inStock: false
  },
  {
    id: 'item-3',
    name: 'Cheesy Garlic Bread',
    description: 'Freshly baked sourdough with roasted garlic butter and mozzarella.',
    price: 145.00,
    category: 'Starters',
    diet: 'veg',
    inStock: true
  },
  {
    id: 'item-4',
    name: 'Truffle Arancini',
    description: 'Wild mushroom risotto balls, truffle oil, parmesan snow.',
    price: 290.00,
    category: 'Starters',
    diet: 'veg',
    inStock: true
  },
  {
    id: 'item-5',
    name: 'Burrata Salad',
    description: 'Heirloom tomatoes, basil oil, balsamic reduction, sourdough.',
    price: 380.00,
    category: 'Starters',
    diet: 'veg',
    inStock: true
  }
];

export const INITIAL_CATEGORIES: MenuCategory[] = [
  { id: 'cat-1', name: 'Starters', assignedCount: 12, visible: true, icon: 'restaurant' },
  { id: 'cat-2', name: 'Main Course', assignedCount: 24, visible: true, icon: 'dinner_dining' },
  { id: 'cat-3', name: 'Beverages', assignedCount: 8, visible: true, icon: 'local_bar' },
  { id: 'cat-4', name: 'Desserts', assignedCount: 5, visible: true, icon: 'icecream' }
];

export const INITIAL_QR_CONFIG: QRConfig = {
  subdomain: 'the-bistro.hambrr.in',
  customDomain: 'menu.thebistro.com',
  brandLogoUrl: 'H',
  heroBannerUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLt7LKrvF-AE_Wf-3c_qsg8clTzJRiklHuqDcp2BKwbpHqXRwBQ8gvJraEDLJdRgbolcWiI626dk9_o8iTgyTxEJVlsfy8kS7wJ2wfddT-clSqebbgNaRM4oyDu856ZThn6O2XYrPwx3Q1H9fA0eepleRGzO05nTjItqBSNSB8Be8bWIbGNvNWSeoRTSh4Flb3PVFT7u2M6fVhDx4F5rz6oI_q87Iiq4NCyRab8XCUzgPhj59L5QUbtWHBa6',
  accentColor: '#b02f00' // Hambrr Zesty Orange
};

export const INITIAL_TABLES: Table[] = [
  { id: 'T1', status: 'ordering', orderId: '#ORD-8821', itemsCount: 5, elapsedMinutes: 12, digitalOrderingActive: true },
  { id: 'T2', status: 'ready', orderId: '#ORD-8815', itemsCount: 2, digitalOrderingActive: true },
  { id: 'T3', status: 'empty', digitalOrderingActive: false },
  { id: 'T4', status: 'ordering', orderId: '#ORD-8825', itemsCount: 3, elapsedMinutes: 2, digitalOrderingActive: true },
  { id: 'T5', status: 'ordering', orderId: '#ORD-8812', itemsCount: 8, elapsedMinutes: 8, digitalOrderingActive: true },
  { id: 'T6', status: 'empty', digitalOrderingActive: false },
  { id: 'T7', status: 'ready', orderId: '#ORD-8805', itemsCount: 4, digitalOrderingActive: true },
  { id: 'T8', status: 'empty', digitalOrderingActive: false }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Marcus Chen',
    role: 'Chef de Cuisine',
    shiftStatus: 'clocked_in',
    clockTime: '08:32 AM',
    performance: 5.0,
    assignedCode: 'emp_42910',
    avatar: 'https://lh3.googleusercontent.com/aida/AP1WRLsL8hfvh30RQuE1vpV0ygZED76OoOSfiQlHdrqiQUkWFS57V8Bc9QipFW7UHF_kO0yWfPu9U4WQKc6dhRByVi2lPGeiCVK3IyTipgqEmauRBw7uQhXfxGlKCuh2DrH_GA2IF_l1gaaqTSnPwBTp7BO4ZpkoiZjhvQ7rm_Gj2EkpHuFXHvtcFbJUFboPEKjy8z2eKGgAa_464yAG-kX56aROHhJPvhlhMu_IMHoIyTlvsH2kpazdd3dMHtNx'
  },
  {
    id: 'emp-2',
    name: 'Elena Rodriguez',
    role: 'Head Waiter',
    shiftStatus: 'clocked_out',
    performance: 4.2,
    assignedCode: 'emp_42911',
    avatar: 'https://lh3.googleusercontent.com/aida/AP1WRLsvPZdxskV39FaPIcPay97BxA2VnzRapJ7BbMp4m64id8G8wl9uOPrICR3T2zoPrFDAfUb2koXi-34XjxNS2rOnhPvdtV6TUdJUx_LTKMJfxk382MDyAYMmlKTMoyU1SO8K_36fLDrLdsjt_jVFeFknDuYdEBt9j7o9kDor5O6KvMOnK-4YExSMf2al4tJTqZt0zTztHxviFfu3mwcqJhHFg4YR4brOl_Pix_P0QG6mfN9otLDq9pMadnIV'
  },
  {
    id: 'emp-3',
    name: 'James Sutherland',
    role: 'Admin / Ops',
    shiftStatus: 'clocked_in',
    clockTime: '09:00 AM',
    performance: 4.9,
    assignedCode: 'emp_42912',
    avatar: 'https://lh3.googleusercontent.com/aida/AP1WRLuldCoHyBbsDpKXI4gYfzt_FtXRcjdkVGSbsBYdZ3MYkhvkF4Q73KXOlKHeFRhe9EDDsk15QVHJczt7Qsjf72oFTNLkCPDVHTFSiqHJOrvGujSibNtmtqZ3VyfMDuzxdzLZWvPGk3l2fA5Xv_NcaqnQXfr3OK6QQGA66eWL0PcJvkVibvbUhDH-o_rujpHIqHXaxwCrIye-qUmoHrOeGu-qyhb1or9-0Ifu7WHQnq8i54AJE0LTdJ7V5RTj'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  operationalHours: {
    'Monday': { open: '09:00', close: '22:00', active: true },
    'Tuesday': { open: '09:00', close: '22:00', active: true },
    'Wednesday': { open: '09:00', close: '22:00', active: true },
    'Thursday': { open: '09:00', close: '22:00', active: true },
    'Friday': { open: '09:00', close: '23:00', active: true },
    'Saturday': { open: '09:00', close: '23:00', active: true },
    'Sunday': { open: '09:00', close: '22:00', active: false }
  },
  gstNumber: '27AAACH2427P1Z5',
  sgst: 2.5,
  cgst: 2.5,
  deliveryRadiusKm: 8.5,
  deliveryBaseFee: 40,
  deliveryFreeAbove: 500,
  paymentMethods: {
    upi: true,
    card: true,
    cash: true,
    wallet: false
  },
  allowTip: true,
  splitBills: false
};
