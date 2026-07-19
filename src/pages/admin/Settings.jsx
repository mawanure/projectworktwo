import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [storeName, setStoreName] = useState('Stay Home');
  const [currency, setCurrency] = useState('USD');
  const [deliveryFee, setDeliveryFee] = useState('60.00');
  const [freeThreshold, setFreeThreshold] = useState('1000.00');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Configuration options saved successfully (Simulated)');
  };

  return (
    <div className="space-y-6 font-sans text-left">
      <div>
        <h2 className="text-2xl font-bold font-spartan text-dark">Portal Configuration</h2>
        <p className="text-sm text-neutral-400">Manage payment gateways, currency rules, delivery parameters, and store information.</p>
      </div>

      <div className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 max-w-xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Store Title</label>
            <input 
              type="text" 
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none bg-white text-sm"
              >
                <option value="USD">USD ($)</option>
                <option value="BDT">BDT (৳)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Flat Delivery Fee</label>
              <input 
                type="number" 
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Free Delivery Minimum Threshold ($)</label>
            <input 
              type="number" 
              value={freeThreshold}
              onChange={(e) => setFreeThreshold(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition"
            >
              Save Parameters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
