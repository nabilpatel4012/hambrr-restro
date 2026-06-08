import React, { useState } from 'react';
import { TabType, Order, MenuItem, MenuCategory, QRConfig, Table, Employee, StoreSettings } from './types';
import Sidebar from './components/Sidebar';
import OrdersTab from './components/OrdersTab';
import MenuTab from './components/MenuTab';
import QRDesignerTab from './components/QRDesignerTab';
import ReportsTab from './components/ReportsTab';
import EmployeesTab from './components/EmployeesTab';
import SettingsTab from './components/SettingsTab';

import {
  INITIAL_ORDERS,
  INITIAL_MENU_ITEMS,
  INITIAL_CATEGORIES,
  INITIAL_QR_CONFIG,
  INITIAL_TABLES,
  INITIAL_EMPLOYEES,
  INITIAL_SETTINGS
} from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [liveStatus, setLiveStatus] = useState<boolean>(true);

  // Synced States shared across tabs
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [categories, setCategories] = useState<MenuCategory[]>(INITIAL_CATEGORIES);
  const [qrConfig, setQrConfig] = useState<QRConfig>(INITIAL_QR_CONFIG);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

  const handleToggleLiveStatus = () => {
    setLiveStatus(prev => !prev);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <OrdersTab
            orders={orders}
            tables={tables}
            onUpdateOrders={setOrders}
            onUpdateTables={setTables}
          />
        );
      case 'menu':
        return (
          <MenuTab
            menuItems={menuItems}
            categories={categories}
            onUpdateMenuItems={setMenuItems}
            onUpdateCategories={setCategories}
          />
        );
      case 'qr':
        return (
          <QRDesignerTab
            qrConfig={qrConfig}
            tables={tables}
            onUpdateQRConfig={setQrConfig}
            onUpdateTables={setTables}
          />
        );
      case 'reports':
        return <ReportsTab />;
      case 'employees':
        return (
          <EmployeesTab
            employees={employees}
            onUpdateEmployees={setEmployees}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            settings={settings}
            onUpdateSettings={setSettings}
          />
        );
      default:
        return (
          <OrdersTab
            orders={orders}
            tables={tables}
            onUpdateOrders={setOrders}
            onUpdateTables={setTables}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#e4beb4]/10 text-slate-800 font-sans selection:bg-[#b02f00]/20">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        liveStatus={liveStatus}
        onToggleLiveStatus={handleToggleLiveStatus}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col h-full pl-[260px] relative overflow-hidden">
        {renderActiveTabContent()}
      </main>
    </div>
  );
}
