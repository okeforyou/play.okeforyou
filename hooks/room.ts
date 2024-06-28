import { useLocalStorageValue } from "@react-hookz/web";

export function useRoomState() {
  const { value: room, set: setRoom } = useLocalStorageValue("room", {
    defaultValue: "",
  });

  return {
    room,
    setRoom,
  };
}
