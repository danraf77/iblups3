import { supabaseServer } from '@/lib/supabaseServer';
import React from 'react';

export const dynamic = 'force-dynamic'; // 🔁 Siempre datos frescos

// 🧩 Server function: obtiene canales en vivo desde Supabase
async function getLiveChannels() {
  const { data, error } = await supabaseServer
    .from('channels_channel')
    .select('id, name, username, is_live')
    .eq('is_live', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching live channels:', error);
    return [];
  }

  return data || [];
}

// 🧩 Server component
export default async function LiveDashboardPage() {
  const channels = await getLiveChannels();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        🔴 Canales en vivo - iBlups
      </h1>

      {channels.length === 0 ? (
        <p className="text-gray-500">No hay canales transmitiendo actualmente.</p>
      ) : (
        <LiveChannelsTable initialChannels={channels} />
      )}
    </main>
  );
}

// 🧠 Client component - se actualiza cada 5 segundos con viewers
'use client';
import { useEffect, useState } from 'react';

type Channel = {
  id: number;
  name: string;
  username: string;
};

function LiveChannelsTable({ initialChannels }: { initialChannels: Channel[] }) {
  const [viewers, setViewers] = useState<Record<string, number>>({});

  // Obtiene viewers en Redis
  const fetchViewers = async () => {
    try {
      const res = await fetch('/api/viewers/get');
      const json = await res.json();

      // Convertir [{username, viewers}] → { username: count }
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
    const interval = setInterval(fetchViewers, 5000); // Actualiza cada 5 s
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
