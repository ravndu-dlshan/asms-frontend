'use client';

import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">System Settings</h1>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
        <div className="text-center py-12 text-gray-400">
          <SettingsIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">System Settings</p>
          <p className="text-sm">System configuration and settings will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}

