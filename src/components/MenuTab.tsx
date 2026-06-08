import React, { useState } from 'react';
import { MenuItem, MenuCategory, DietType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface MenuTabProps {
  menuItems: MenuItem[];
  categories: MenuCategory[];
  onUpdateMenuItems: (items: MenuItem[]) => void;
  onUpdateCategories: (categories: MenuCategory[]) => void;
}

export default function MenuTab({ menuItems, categories, onUpdateMenuItems, onUpdateCategories }: MenuTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Item State wizard
  const [wizardTab, setWizardTab] = useState<'info' | 'addons' | 'price'>('info');
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: 199.00,
    category: 'Starters',
    diet: 'veg' as DietType,
    inStock: true,
    addons: [] as { name: string; price: number }[],
    variations: [] as { name: string; addPrice: number }[],
    packagingCharge: 10.00,
    taxCategory: 'GST 5%'
  });

  // Temporaries for addons wizard
  const [tempAddonName, setTempAddonName] = useState('');
  const [tempAddonPrice, setTempAddonPrice] = useState(15);

  // Filter Catalog
  const filteredCatalog = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Toggle Stock status
  const handleToggleStock = (itemId: string) => {
    const updated = menuItems.map(item => {
      if (item.id === itemId) {
        return { ...item, inStock: !item.inStock };
      }
      return item;
    });
    onUpdateMenuItems(updated);
  };

  // Delete Item
  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      const target = menuItems.find(i => i.id === itemId);
      const updated = menuItems.filter(item => item.id !== itemId);
      onUpdateMenuItems(updated);

      // Decrement Category count
      if (target) {
        const updatedCats = categories.map(c => {
          if (c.name === target.category) {
            return { ...c, assignedCount: Math.max(0, c.assignedCount - 1) };
          }
          return c;
        });
        onUpdateCategories(updatedCats);
      }
    }
  };

  // Add Item to Catalog
  const handleSaveNewDish = () => {
    if (!newDish.name.trim()) {
      alert('Please fill in the menu item name.');
      return;
    }

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: newDish.name,
      description: newDish.description || 'Delicately prepared by Hambrr kitchen experts.',
      price: Number(newDish.price) || 199.00,
      category: newDish.category,
      diet: newDish.diet,
      inStock: newDish.inStock,
      addons: newDish.addons.length > 0 ? newDish.addons : undefined,
      variations: newDish.variations.length > 0 ? newDish.variations : undefined,
      packagingCharge: newDish.packagingCharge,
      taxCategory: newDish.taxCategory
    };

    const nextCatalog = [...menuItems, newItem];
    onUpdateMenuItems(nextCatalog);

    // Update category Assigned Counts
    const updatedCats = categories.map(c => {
      if (c.name === newDish.category) {
        return { ...c, assignedCount: c.assignedCount + 1 };
      }
      return c;
    });
    onUpdateCategories(updatedCats);

    // Reset wizard
    setNewDish({
      name: '',
      description: '',
      price: 199.00,
      category: 'Starters',
      diet: 'veg' as DietType,
      inStock: true,
      addons: [],
      variations: [],
      packagingCharge: 10.00,
      taxCategory: 'GST 5%'
    });
    setWizardTab('info');
    setShowAddModal(false);
  };

  const handleAddAddon = () => {
    if (!tempAddonName.trim()) return;
    setNewDish(prev => ({
      ...prev,
      addons: [...prev.addons, { name: tempAddonName, price: Number(tempAddonPrice) || 0 }]
    }));
    setTempAddonName('');
    setTempAddonPrice(15);
  };

  const handleRemoveAddon = (index: number) => {
    setNewDish(prev => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index)
    }));
  };

  // Categories mutators
  const handleDeleteCategory = (catId: string) => {
    const target = categories.find(c => c.id === catId);
    if (target?.assignedCount && target.assignedCount > 0) {
      alert(`Cannot delete '${target.name}' because it contains ${target.assignedCount} dishes. Reassign them first!`);
      return;
    }
    if (confirm(`Delete category '${target?.name || ''}'?`)) {
      onUpdateCategories(categories.filter(c => c.id !== catId));
    }
  };

  const handleCreateCategory = () => {
    const name = prompt('Enter new category name:');
    if (!name) return;
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      alert('Category already exists!');
      return;
    }
    const newCat: MenuCategory = {
      id: `cat-${Date.now()}`,
      name,
      assignedCount: 0,
      visible: true,
      icon: 'restaurant_menu'
    };
    onUpdateCategories([...categories, newCat]);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Search and Catalog Column */}
      <div className="flex-1 flex flex-col h-full bg-[#f9f9fc] border-r border-[#e4beb4]/20 overflow-y-auto p-6 space-y-6">
        
        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1a1c1e] tracking-tight">Main Catalog</h1>
            <p className="text-xs text-[#5b4039] font-mono">
              Configure dishes, prices, tax classifications, and stock status.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#b02f00] hover:bg-[#b02f00]/95 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add</span> Add New Dish
          </button>
        </div>

        {/* Categories slider */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 shrink-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all uppercase shrink-0 border ${
              selectedCategory === 'All'
                ? 'bg-[#b02f00] border-[#b02f00] text-white shadow-sm'
                : 'bg-white border-[#e4beb4]/55 text-[#5b4039] hover:bg-[#b02f00]/5'
            }`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all uppercase shrink-0 border ${
                selectedCategory === cat.name
                  ? 'bg-[#b02f00] border-[#b02f00] text-white shadow-sm'
                  : 'bg-white border-[#e4beb4]/55 text-[#5b4039] hover:bg-[#b02f00]/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Catalog Search Bar */}
        <div className="relative shrink-0">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5b4039]/60">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#e4beb4]/40 rounded-xl pl-10 pr-4 py-3 text-xs focus:ring-2 focus:ring-[#b02f00] outline-none shadow-sm font-sans"
            placeholder="Search items by name or keywords..."
          />
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCatalog.length === 0 ? (
            <div className="col-span-2 py-16 text-center border-2 border-dashed border-[#e4beb4]/30 rounded-2xl bg-white text-[#5b4039]/50">
              <span className="material-symbols-outlined text-4xl mb-2">restaurant_menu</span>
              <p className="text-xs font-mono">No matching menu items found.</p>
            </div>
          ) : (
            filteredCatalog.map(item => (
              <div
                key={item.id}
                className="bg-white border border-[#e4beb4]/40 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    {/* Diet Dot Box Custom Implementation */}
                    <div className="flex items-center gap-2">
                      <div className={`w-[18px] h-[18px] border-2 rounded flex items-center justify-center p-0.5 ${
                        item.diet === 'veg' 
                          ? 'border-[#1b6d24]' 
                          : item.diet === 'egg' 
                          ? 'border-[#ffd54f]' 
                          : 'border-[#ba1a1a]'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          item.diet === 'veg' 
                            ? 'bg-[#1b6d24]' 
                            : item.diet === 'egg' 
                            ? 'bg-[#ffd54f]' 
                            : 'bg-[#ba1a1a]'
                        }`}></div>
                      </div>
                      <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#5b4039]/70">
                        {item.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="w-7 h-7 flex items-center justify-center text-[#ba1a1a] hover:bg-[#ba1a1a]/10 rounded-full transition-all"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>

                  <h3 className="text-base font-extrabold text-[#1a1c1e] tracking-tight">{item.name}</h3>
                  <p className="text-xs text-[#5b4039] mt-1 line-clamp-2 min-h-[32px]">
                    {item.description}
                  </p>
                </div>

                {/* Bottom line detailing stock toggle + pricing info */}
                <div className="mt-4 pt-3 border-t border-[#e4beb4]/10 flex justify-between items-center bg-[#f9f9fc] p-2 rounded-lg">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#5b4039]/50">Regular Price</p>
                    <p className="text-base font-bold text-[#b02f00]">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>

                  {/* High fidelity status toggle switch */}
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono tracking-widest font-bold ${item.inStock ? 'text-[#1b6d24]' : 'text-[#ba1a1a]'}`}>
                      {item.inStock ? 'IN STOCK' : 'OUT STOCK'}
                    </span>
                    <button
                      onClick={() => handleToggleStock(item.id)}
                      className={`w-[44px] h-[24px] rounded-full p-0.5 transition-all outline-none ${
                        item.inStock ? 'bg-[#1b6d24]' : 'bg-[#e2e2e5]'
                      }`}
                    >
                      <div
                        className={`bg-white w-[20px] h-[20px] rounded-full shadow-sm transform transition-all ${
                          item.inStock ? 'translate-x-[20px]' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Category Management Column on the right */}
      <div className="w-[340px] bg-white h-full flex flex-col shrink-0 overflow-y-auto p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold font-sans text-[#1a1c1e]">Category Config</h2>
          <p className="text-xs text-[#5b4039] font-mono mt-0.5">Define headers for the customer menu.</p>
        </div>

        <button
          onClick={handleCreateCategory}
          className="w-full border-2 border-dashed border-[#e4beb4]/70 hover:border-[#b02f00]/70 hover:bg-[#b02f00]/5 text-[#5b4039] hover:text-[#b02f00] py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span> Add Custom Category
        </button>

        {/* Category list */}
        <div className="space-y-3">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="px-4 py-3 border border-[#e4beb4]/40 rounded-xl flex items-center justify-between hover:bg-[#f9f9fc] transition-all duration-150"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 bg-[#b02f00]/10 rounded-lg flex items-center justify-center text-[#b02f00]">
                  <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1a1c1e] uppercase tracking-wide">{cat.name}</p>
                  <p className="text-[10px] text-[#5b4039] font-mono">{cat.assignedCount} dishes synced</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Visible status toggle */}
                <button
                  onClick={() => {
                    const nextCats = categories.map(c => c.id === cat.id ? { ...c, visible: !c.visible } : c);
                    onUpdateCategories(nextCats);
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    cat.visible ? 'text-[#1b6d24] hover:bg-[#1b6d24]/10' : 'text-[#ba1a1a] hover:bg-[#ba1a1a]/10'
                  }`}
                  title={cat.visible ? 'Visible to customers' : 'Hidden from customers'}
                >
                  <span className="material-symbols-outlined text-sm">
                    {cat.visible ? 'visibility' : 'visibility_off'}
                  </span>
                </button>

                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="w-7 h-7 flex items-center justify-center text-[#ba1a1a] hover:bg-[#ba1a1a]/10 rounded-full transition-all"
                  title="Delete category"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: Wizard Dish Addition */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#eaebef]/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#e4beb4]/50 rounded-2xl w-[600px] max-w-full overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#e4beb4]/20 flex justify-between items-center bg-[#f9f9fc]">
                <div>
                  <h3 className="text-base font-extrabold text-[#1a1c1e] tracking-tight">Dish Creator Setup</h3>
                  <p className="text-[10px] text-[#5b4039] font-mono mt-0.5 uppercase tracking-wide">Wizard step configuration</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#5b4039] hover:bg-[#ba1a1a]/10 hover:text-[#ba1a1a] transition-all"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Wizard Tabs selection bar */}
              <div className="flex border-b border-[#e4beb4]/10 bg-[#f3f3f6]/40 px-6 pt-2">
                <button
                  onClick={() => setWizardTab('info')}
                  className={`px-4 py-2 text-xs font-mono font-bold tracking-wider relative ${
                    wizardTab === 'info' ? 'text-[#b02f00]' : 'text-[#5b4039]/60'
                  }`}
                >
                  1. Core Details
                  {wizardTab === 'info' && <motion.div layoutId="wizard-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b02f00]" />}
                </button>
                <button
                  onClick={() => setWizardTab('addons')}
                  className={`px-4 py-2 text-xs font-mono font-bold tracking-wider relative ${
                    wizardTab === 'addons' ? 'text-[#b02f00]' : 'text-[#5b4039]/60'
                  }`}
                >
                  2. Add-on Options
                  {wizardTab === 'addons' && <motion.div layoutId="wizard-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b02f00]" />}
                </button>
                <button
                  onClick={() => setWizardTab('price')}
                  className={`px-4 py-2 text-xs font-mono font-bold tracking-wider relative ${
                    wizardTab === 'price' ? 'text-[#b02f00]' : 'text-[#5b4039]/60'
                  }`}
                >
                  3. Price & Tax
                  {wizardTab === 'price' && <motion.div layoutId="wizard-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b02f00]" />}
                </button>
              </div>

              {/* Form Content body workspace */}
              <div className="p-6 flex-1 min-h-[300px]">
                {wizardTab === 'info' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold font-mono text-[#5b4039] uppercase tracking-wider mb-1.5">Dish Name*</label>
                      <input
                        type="text"
                        value={newDish.name}
                        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                        className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#b02f00]"
                        placeholder="e.g. Avocado Cheddar Sourdough"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-mono text-[#5b4039] uppercase tracking-wider mb-1.5">Description</label>
                      <textarea
                        value={newDish.description}
                        onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                        rows={3}
                        className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#b02f00] resize-none"
                        placeholder="Detail ingredients, cooking highlights..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold font-mono text-[#5b4039] uppercase tracking-wider mb-1.5">Primary Category</label>
                        <select
                          value={newDish.category}
                          onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                          className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-3 py-2 text-xs"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold font-mono text-[#5b4039] uppercase tracking-wider mb-1.5">Diet Classification</label>
                        <select
                          value={newDish.diet}
                          onChange={(e) => setNewDish({ ...newDish, diet: e.target.value as DietType })}
                          className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-3 py-2 text-xs"
                        >
                          <option value="veg">Vegetarian (Veg)</option>
                          <option value="non-veg">Non-Vegetarian (Non-Veg)</option>
                          <option value="egg">Contains Egg</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {wizardTab === 'addons' && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#5b4039]/80 mb-2">
                      Configure custom addon modifications (e.g. "Extra Cheese") that customers see on the QR menu.
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempAddonName}
                        onChange={(e) => setTempAddonName(e.target.value)}
                        className="flex-1 bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-4 py-2 text-xs"
                        placeholder="Addon modified element name (e.g. Extra Mayo)"
                      />
                      <input
                        type="number"
                        value={tempAddonPrice}
                        onChange={(e) => setTempAddonPrice(Number(e.target.value))}
                        className="w-24 bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-3 py-2 text-xs text-right font-mono"
                        placeholder="Price"
                      />
                      <button
                        onClick={handleAddAddon}
                        className="bg-[#b02f00] text-white px-4 py-2 rounded-lg font-bold text-xs"
                      >
                        Add
                      </button>
                    </div>

                    <div className="mt-4 space-y-2 max-h-36 overflow-y-auto">
                      {newDish.addons.length === 0 ? (
                        <p className="text-[11px] font-mono text-[#5b4039]/40 italic py-4 text-center border border-dashed rounded-lg">
                          No optional add-on configurations logged.
                        </p>
                      ) : (
                        newDish.addons.map((addon, index) => (
                          <div key={index} className="flex justify-between items-center bg-[#f3f3f6]/60 px-3 py-1.5 rounded border">
                            <span className="text-xs font-medium text-[#1a1c1e]">{addon.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-[#b02f00] font-semibold">+₹{addon.price}</span>
                              <button
                                onClick={() => handleRemoveAddon(index)}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[#ba1a1a] hover:bg-[#ba1a1a]/10"
                              >
                                <span className="material-symbols-outlined text-xs">close</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {wizardTab === 'price' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold font-mono text-[#5b4039] uppercase tracking-wider mb-1.5">Base Price (INR)*</label>
                        <input
                          type="number"
                          value={newDish.price}
                          onChange={(e) => setNewDish({ ...newDish, price: Number(e.target.value) || 0 })}
                          className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#b02f00] font-mono text-right"
                          placeholder="e.g. 199"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold font-mono text-[#5b4039] uppercase tracking-wider mb-1.5">Packaging Fee (INR)</label>
                        <input
                          type="number"
                          value={newDish.packagingCharge}
                          onChange={(e) => setNewDish({ ...newDish, packagingCharge: Number(e.target.value) || 0 })}
                          className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#b02f00] font-mono text-right"
                          placeholder="e.g. 15"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-mono text-[#5b4039] uppercase tracking-wider mb-1.5">Tax Category Bracket</label>
                      <select
                        value={newDish.taxCategory}
                        onChange={(e) => setNewDish({ ...newDish, taxCategory: e.target.value })}
                        className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-3 py-2 text-xs"
                      >
                        <option value="GST 5%">5% GST (Non-AC Restaurants / Bakery etc)</option>
                        <option value="GST 12%">12% GST (Beverages / Standard Services)</option>
                        <option value="GST 18%">18% GST (Luxury Dining Bracket)</option>
                        <option value="TAX EXEMPT0%">0% Zero Tax / Essential Ingredients</option>
                      </select>
                    </div>

                    <div className="p-3.5 bg-[#b02f00]/5 rounded-xl border border-[#b02f00]/10 mt-6 text-[#5b4039] text-xs">
                      <p className="font-bold flex items-center gap-1 text-[#b02f00]">
                        <span className="material-symbols-outlined text-sm">info</span>
                        Instant QR Sync Configured
                      </p>
                      <p className="mt-1 leading-normal">
                        Saving this entry immediately broadcasts the updated pricing metrics, addon groups, and allergen details, dynamically visible to dining customers on the live subdomain.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons footer */}
              <div className="px-6 py-4 bg-[#f9f9fc] border-t border-[#e4beb4]/20 flex justify-between items-center">
                <div className="flex gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${wizardTab === 'info' ? 'bg-[#b02f00]' : 'bg-[#e2e2e5]'}`}></div>
                  <div className={`w-1.5 h-1.5 rounded-full ${wizardTab === 'addons' ? 'bg-[#b02f00]' : 'bg-[#e2e2e5]'}`}></div>
                  <div className={`w-1.5 h-1.5 rounded-full ${wizardTab === 'price' ? 'bg-[#b02f00]' : 'bg-[#e2e2e5]'}`}></div>
                </div>

                <div className="flex gap-2">
                  {wizardTab !== 'info' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (wizardTab === 'addons') setWizardTab('info');
                        if (wizardTab === 'price') setWizardTab('addons');
                      }}
                      className="px-4 py-2 border rounded-lg text-xs font-bold text-[#5b4039] hover:bg-[#e8e8ea]"
                    >
                      Back
                    </button>
                  )}

                  {wizardTab !== 'price' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (wizardTab === 'info') setWizardTab('addons');
                        if (wizardTab === 'addons') setWizardTab('price');
                      }}
                      className="px-5 py-2 bg-[#b02f00] hover:bg-[#b02f00]/95 text-white rounded-lg text-xs font-bold active:scale-95 transition-all"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveNewDish}
                      className="px-6 py-2 bg-[#1b6d24] hover:bg-[#1b6d24]/95 text-white rounded-lg text-xs font-bold active:scale-95 transition-all shadow-md shadow-[#1b6d24]/10"
                    >
                      Save Dish
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
