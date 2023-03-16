import { onCleanup } from "solid-js";

export const createWebsocket = (
  username: string,
  onData: (event: MessageEvent) => void,
  onError: (event: Event) => void,
  setState: (state: number) => void,
  protocols?: string | Array<string>,
  reconnectLimit = 2,
  reconnectInterval = 500
): [
  connect: () => void,
  disconnect: () => void,
  send: (message: string) => void
] => {
  let socket: WebSocket | undefined;
  let reconnections = 0;
  let reconnectId: ReturnType<typeof setTimeout> | undefined;

  const url = `ws://localhost:8000/broadcast/${username}`;

  const cancelReconnect = () => {
    if (reconnectId) {
      clearTimeout(reconnectId);
    }
  };

  const connect = () => {
    cancelReconnect();
    setState(WebSocket.CONNECTING);
    socket = new WebSocket(url);
    socket.onopen = () => setState(WebSocket.OPEN);
    socket.onclose = () => {
      setState(WebSocket.CLOSED);
      if (reconnectLimit && reconnectLimit > reconnections) {
        reconnections += 1;
        reconnectId = setTimeout(connect, reconnectInterval);
      }
    };
    socket.onerror = onError;
    socket.onmessage = onData;
  };

  const disconnect = () => {
    cancelReconnect();
    reconnectLimit = Number.NEGATIVE_INFINITY;
    if (socket) {
      socket.close();
    }
  };

  const send = (data: string | ArrayBuffer) => socket!.send(data);

  onCleanup(() => disconnect());

  return [connect, disconnect, send];
};
