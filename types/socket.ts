export interface ClientToServerEvents {
  joinRoom: (room: string) => void;
  message: (data: { room: string; action: SocketData }) => void;
}

export interface ServerToClientEvents {
  message: (message: SocketData) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export enum ACTION {
  SET_SONG,
  PLAY = 1,
  PAUSED,
  NEXT_SONG,
  REPLAY,
  MUTE,
  UNMUTE,
  MONITOR_END_VIDEO,
}

export interface SocketData {
  action: ACTION;
  videoId?: string;
}
