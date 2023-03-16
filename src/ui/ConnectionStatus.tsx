import { Component } from "solid-js";

interface Props {
  state: number;
}

const { CONNECTING, OPEN, CLOSING, CLOSED } = WebSocket;

const ConnectionStatus: Component<Props> = (props) => {
  const className = (state: number) => {
    switch (state) {
      case CONNECTING:
        return "text-amber-700";
      case OPEN:
        return "text-green-600";
      case CLOSING:
        return "text-amber-700";
      case CLOSED:
        return "text-gray-300";
      default:
        return undefined;
    }
  };

  const message = (state: number) => {
    switch (state) {
      case CONNECTING:
        return "connecting...";
      case OPEN:
        return "connected";
      case CLOSING:
        return "connecting closing...";
      case CLOSED:
        return "not connected";
      default:
        return "unknown";
    }
  };

  return <span class={className(props.state)}>{message(props.state)}</span>;
};

export default ConnectionStatus;
