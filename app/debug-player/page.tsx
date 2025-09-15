import DebugVideojsHls from '../components/DebugVideojsHls';

export default function DebugPlayerPage() {
  const hlsUrl = 'https://live-stream.iblups.com/dev/68fe7d84cbd05c3c32e1e31b35931a691d59df16.m3u8';

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto p-4">
        <h1 className="text-white text-2xl mb-4">Debug Video.js Player</h1>
        <div className="bg-gray-800 p-4 rounded mb-4">
          <p className="text-white">URL: {hlsUrl}</p>
        </div>
        <div className="w-full max-w-4xl mx-auto">
          <DebugVideojsHls
            src={hlsUrl}
            autoplay={false}
            muted={true}
            controls={true}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
