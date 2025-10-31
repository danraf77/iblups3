'use client';

import { useEffect, useState } from 'react';

type Channel = {
  id: number;
  name: string;
  username: string;
};

export default function LiveChannelsTable({
  initialChannels,
}: {
  initialChannels: Channel[];
}) {
  const [viewers, setViewers] = useState<Record<string, number>>({});

  const fetchViewers = async () => {
    try {
      const res = await fetch('/api/viewers/get');
      const json = await res.json();

      const map: Record<string, number> = {};
      for (const item of json.data) {
        map[item.username] = item.viewers;
      }
      setViewers(map);
    } catch (e) {
      console.error('Error fetching viewers:', e);
    }
  };

  useEffect(() => {
    fetchViewers();
    const interval = setInterval(fetchViewers, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 text-sm font-semibold text-gray-600">Canal</th>
            <th className="py-2 text-sm font-semibold text-gray-600 text-right">Viewers</th>
          </tr>
        </thead>
        <tbody>
          {initialChannels.map((ch) => (
            <tr key={ch.id} className="border-b border-gray-100">
              <td className="py-2 text-gray-800 font-medium">{ch.name || ch.username}</td>
              <td className="py-2 text-right text-blue-600 font-semibold">
                {viewers[ch.username]?.toLocaleString() || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
