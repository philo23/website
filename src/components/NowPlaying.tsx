'use client';

import React, { Fragment, useEffect, useMemo } from 'react';
import { useEventSource } from '../hooks/eventsource';
import { useExtractColors } from 'react-extract-colors';

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="flex-1 bg-current/30 h-1 rounded-full shadow-inner">
      <div
        className="bg-current/70 h-full rounded-full flex justify-end items-center"
        style={{ width: Math.round(progress * 10000) / 100 + '%' }}
      >
        <div className="bg-current size-3 shrink-0 translate-x-1/2 rounded-full shadow"></div>
      </div>
    </div>
  );
}

interface SpotifyLinkProps {
  type: 'track' | 'artist' | 'album';
  id: string;
  children: React.ReactNode;
}
function SpotifyLink({ type, id, children }: SpotifyLinkProps) {
  return (
    <a
      href={`https://open.spotify.com/${type}/${id}`}
      target="_blank"
      className="contents group hover:underline"
    >
      {children}
    </a>
  );
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

interface Artist {
  id: string;
  name: string;
}
interface AlbumImage {
  url: string;
  width: number;
  height: number;
}
interface Album {
  id: string;
  name: string;
  images: AlbumImage[];
  total_tracks: number;
}

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  track_number: number;
  explicit: boolean;
  artists: Artist[];
  album: Album;
}

function calculateLuminance(color: string) {
  const r = parseInt(color.slice(1, 3), 16) / 255;
  const g = parseInt(color.slice(3, 5), 16) / 255;
  const b = parseInt(color.slice(5, 7), 16) / 255;

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function NowPlaying({
  activityStreamUrl,
}: {
  activityStreamUrl: string;
}) {
  const {
    readyState,
    error,
    addListener,
    data: { track, progress },
  } = useEventSource(activityStreamUrl, {
    track: null as Track | null,
    progress: 0 as number | null,
  });

  useEffect(() => addListener('track'), [addListener]);
  useEffect(() => addListener('progress'), [addListener]);

  const albumArt = track?.album.images[0].url ?? '';

  const { dominantColor, darkerColor } = useExtractColors(albumArt, {
    format: 'hex',
    maxSize: 64,
    sortBy: 'vibrance',
  });

  const luminance = useMemo(
    () => (dominantColor ? calculateLuminance(dominantColor) : 0),
    [dominantColor],
  );

  if (readyState != 1 || error) {
    return null;
  }

  if (!track || !progress) {
    return null;
  }

  const linearGradient = dominantColor
    ? `linear-gradient(to bottom, ${dominantColor}, ${darkerColor})`
    : undefined;
  const textColor = luminance > 0.5 ? 'text-black' : 'text-white';

  return (
    <div className="container mx-auto">
      <div
        className={`${textColor} rounded-lg bg-transparent hover:bg-white transition-all m-2 p-2 flex gap-2 shadow-lg relative cursor-default select-none`}
        style={{
          backgroundColor: dominantColor ?? undefined,
          backgroundImage: linearGradient,
        }}
      >
        <div className="size-16 md:size-12 flex items-center justify-center self-center relative">
          <SpotifyLink type="album" id={track.album.id}>
            <img
              src={albumArt}
              alt={`Album art for ${track.album.name}`}
              width={128}
              height={128}
              className="w-full rounded shadow ring-2 ring-current/20 hover:ring-current/40"
            />
          </SpotifyLink>
        </div>
        <div className="flex-1 flex flex-col md:flex-row justify-center gap-2">
          <div className="flex flex-col justify-center md:min-w-32 md:max-w-64">
            <div className="select-text leading-tight line-clamp-1 font-bold">
              <SpotifyLink type="track" id={track.id}>
                {track.name}
              </SpotifyLink>
            </div>
            <div className="text-sm select-text leading-tight line-clamp-1">
              {track.artists.map(({ id, name }, i) => (
                <Fragment key={id}>
                  {i > 0 && ', '}
                  <SpotifyLink type="artist" id={id}>
                    {name}
                  </SpotifyLink>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 text-xs">
            <span className="w-10 text-center">{formatTime(progress)}</span>
            <ProgressBar progress={progress / track.duration_ms} />
            <span className="w-10 text-center">
              {formatTime(track.duration_ms)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
