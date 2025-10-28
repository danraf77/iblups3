import { supabaseServer } from '@/lib/supabaseServer';
import LiveChannelsTable from './LiveChannelsTable';

export const dynamic = 'force-dynamic';

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
