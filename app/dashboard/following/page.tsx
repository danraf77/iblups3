'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../hooks/useTranslation';

interface FollowedChannel {
  id: string;
  channel_id: string;
  channel_username: string;
  channel_name: string;
  followed_at: string;
}

export default function FollowingPage() {
  const { t } = useTranslation();
  const [channels, setChannels] = useState<FollowedChannel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await fetch('/api/dashboard/following');
        if (response.ok) {
          const data = await response.json();
          setChannels(data.channels);
        }
      } catch (error) {
        console.error('Error fetching followed channels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-primary">{t('following.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">{t('following.title')}</h1>
          <p className="text-muted">
            {t(channels.length === 1 ? 'following.channelsCount' : 'following.channelsCountPlural', { count: channels.length })}
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#2c73ff] rounded-lg hover:bg-[#1e5bb8] transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t('following.exploreChannels')}
        </Link>
      </div>

      {/* Channels List */}
      {channels.length === 0 ? (
        <div className="bg-card rounded-lg p-12 border border-border-primary text-center">
          <svg className="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-primary mb-2">{t('following.noChannels')}</h3>
          <p className="text-muted mb-6">
            {t('following.noChannelsDescription')}
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#2c73ff] rounded-lg hover:bg-[#1e5bb8] transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t('following.exploreChannels')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <div key={channel.id} className="bg-card rounded-lg border border-border-primary overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#2c73ff] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {channel.channel_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{channel.channel_name}</h3>
                      <p className="text-sm text-muted">@{channel.channel_username}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('following.followingSince')} {new Date(channel.followed_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>

                  <div className="flex items-center">
                    <Link
                      href={`/${channel.channel_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#2c73ff] hover:text-[#1e5bb8] hover:underline transition-colors duration-200"
                    >
                      {t('following.viewChannel')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
