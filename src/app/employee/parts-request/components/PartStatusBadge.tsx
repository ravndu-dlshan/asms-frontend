'use client';

import { getStatusColor } from '../../utils';

interface PartStatusBadgeProps {
  status: string;
}

export default function PartStatusBadge({ status }: PartStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
        status
      )}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}