'use client';

import React, { useEffect, useRef } from 'react';
import { X, CheckCircle, Trash2 } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  onClose: () => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

export default function NotificationPanel({ onClose, notifications, setNotifications }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // 🔹 Close panel if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  //Mark as read
  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    // Optional: send PUT/PATCH request to backend to update status
  };

  // 🔹 Delete notification
  const handleDelete = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    // Optional: send DELETE request to backend
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-16 right-4 w-80 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-orange-400">Notifications</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notifications"
          className="p-1 hover:bg-gray-700 rounded-lg transition"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* Notification List */}
      {notifications.length > 0 ? (
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`relative p-3 rounded-xl border transition ${
                n.read
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-700 border-orange-500/40'
              } hover:bg-gray-600`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4
                    className={`font-medium text-sm ${
                      n.read ? 'text-gray-300' : 'text-white'
                    }`}
                  >
                    {n.title}
                  </h4>
                  <p className="text-gray-400 text-xs mt-1">{n.message}</p>
                  <p className="text-gray-500 text-xs mt-1">{n.time}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center space-y-2 ml-2">
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="hover:text-orange-400 text-gray-400 transition"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="hover:text-red-500 text-gray-400 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!n.read && (
                <span className="absolute top-3 right-3 w-2 h-2 bg-orange-500 rounded-full"></span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm text-center">
          No new notifications
        </p>
      )}
    </div>
  );
}