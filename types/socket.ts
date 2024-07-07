export interface ClientToServerEvents {
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  message: (data: { room: string; action: SocketData }) => void;
}

export interface ServerToClientEvents {
  message: (message: SocketData) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export enum ACTION {
  REMOTE_JOIN,
  SET_SONG,
  SET_PLAYLIST,
  MONITOR_END_VIDEO,
  PLAY,
  PAUSED,
  NEXT_SONG,
  REPLAY,
  MUTE,
  UNMUTE,
}

export interface SocketData {
  action: ACTION;
  videoId?: string;
  playlist?: any;
}
