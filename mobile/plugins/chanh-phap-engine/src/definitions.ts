import type { PluginListenerHandle } from '@capacitor/core';

export interface QueueSegment {
  index: number;
  block: string;
  heading?: string;
  sourceOffset?: number;
  text: string;
}

export interface StartQueueOptions {
  bookKey: string;
  bookTitle: string;
  remoteBaseUrl: string;
  voice: string;
  rate: number;
  startIndex: number;
  startSeconds: number;
  repeatMode?: string;
  repeatTarget?: number;
  repeatA?: number;
  repeatB?: number;
  sleepDeadlineMs?: number;
  segments: QueueSegment[];
}

export interface PlaybackStateEvent {
  bookKey: string;
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error';
  index: number;
  currentTime: number;
  duration: number;
  voice: string;
  voiceLabel: string;
  packActive: boolean;
  onDeviceAiActive?: boolean;
  finished?: boolean;
  message?: string;
}

export interface ChanhPhapEnginePlugin {
  getVaultStatus(): Promise<{
    packs: string[];
    ttsInstalled: boolean;
    freeDiskMiB: number;
  }>;
  getManuscript(options: { url: string }): Promise<{
    found: boolean;
    content?: string;
    packId?: string;
  }>;
  cacheManuscript(options: { url: string; content: string }): Promise<void>;
  searchVault(options: {
    q: string;
    collection?: string;
    mode?: string;
    offset?: number;
  }): Promise<{ results: unknown[]; total: number }>;
  downloadPack(options: {
    id: string;
    kind: 'tts' | 'text-pack';
    remoteBaseUrl: string;
  }): Promise<{ installed: boolean }>;
  removePack(options: { id: string; kind: 'tts' | 'text-pack' }): Promise<void>;

  startQueue(options: StartQueueOptions): Promise<void>;
  pauseQueue(): Promise<void>;
  stopQueue(): Promise<void>;
  seekQueue(options: { index: number; seconds: number; resume: boolean }): Promise<void>;
  updateQueueOptions(options: {
    repeatMode?: string;
    repeatTarget?: number;
    repeatA?: number;
    repeatB?: number;
    sleepDeadlineMs?: number;
    rate?: number;
  }): Promise<void>;
  getQueueState(): Promise<PlaybackStateEvent>;

  scheduleDailyPracticeReminder(options: {
    hour: number;
    minute: number;
    enabled: boolean;
  }): Promise<void>;

  addListener(
    eventName: 'playbackState',
    listenerFunc: (event: PlaybackStateEvent) => void,
  ): Promise<PluginListenerHandle>;
  addListener(
    eventName: 'downloadProgress',
    listenerFunc: (event: { id: string; percent: number }) => void,
  ): Promise<PluginListenerHandle>;
}

