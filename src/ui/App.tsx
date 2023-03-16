import {
  createSignal,
  Component,
  Show,
  For,
  Switch,
  Match,
  createEffect,
} from "solid-js";

import { createWebsocket } from "./socket";

import ConnectionStatus from "./ConnectionStatus";

const formDataFromEvent = (event: SubmitEvent, reset = false): FormData => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const formData = new FormData(form);
  if (reset) {
    form.reset();
  }
  return formData;
};

const App: Component = () => {
  let connect: () => void;
  let disconnect: () => void;
  let send: (message: string) => void;

  const [username, setUsername] = createSignal("");
  const [connectionState, setConnectionState] = createSignal(WebSocket.CLOSED);
  const [error, setError] = createSignal("");
  const [data, setData] = createSignal<any[]>([]);

  const connected = () => connectionState() === WebSocket.OPEN;
  const dataCount = () => data().length;

  const onError = (event: Event) => {
    const message =
      "An error was encountered while attempting to connect to the chat service";
    setError(message);
    console.error(event);
  };

  const onData = (event: MessageEvent) => {
    const newData = JSON.parse(event.data);
    if (dataCount() === 64) {
      setData([newData]);
    } else {
      setData([...data(), newData]);
    }
  };

  const handleSubmitUsername = (event: SubmitEvent) => {
    const formData = formDataFromEvent(event);
    const newUsername = (formData.get("username") as string).trim();
    if (username) {
      if (newUsername !== username()) {
        setUsername(newUsername);
      }
    } else {
      setError("Username cannot be blank");
    }
  };

  const handleSubmitMessage = (event: SubmitEvent) => {
    const formData = formDataFromEvent(event, true);
    const message = formData.get("message") as string;
    if (message) {
      sendMessage(message);
    }
  };

  const sendMessage = (message: string) => {
    send(message);
  };

  const handleDisconnect = () => {
    setError("");
    setData([]);
    setUsername("");
    disconnect();
  };

  createEffect(() => {
    if (username()) {
      [connect, disconnect, send] = createWebsocket(
        username(),
        onData,
        onError,
        setConnectionState
      );
      connect();
    }
  });

  return (
    <>
      <header>
        <h1>Chat</h1>
        {username()}
      </header>

      <div id="connection-status" class="text-">
        <ConnectionStatus state={connectionState()} />
        <Show when={connected()}>
          <button
            type="button"
            onClick={handleDisconnect}
            class="p-2 text-red-500 border border-red-500 rounded"
          >
            disconnect
          </button>
        </Show>
      </div>

      <main>
        <Show when={error()}>
          <div class="error">{error()}</div>
        </Show>

        <Show when={!connected()}>
          <form onSubmit={handleSubmitUsername}>
            <fieldset>
              <input
                id="username"
                name="username"
                type="text"
                required
                autocomplete="off"
                placeholder="Enter a username"
              />
            </fieldset>
          </form>
        </Show>

        <Show when={connected()}>
          <form onSubmit={handleSubmitMessage}>
            <fieldset>
              <input
                id="message"
                name="message"
                type="text"
                required
                autocomplete="off"
                placeholder="Type your message then hit Enter"
              />
            </fieldset>
          </form>
        </Show>

        <Show when={connected()}>
          <div class="messages">
            <div class="messages-header">
              <span>
                <Switch>
                  <Match when={dataCount() === 0}>no messages</Match>
                  <Match when={dataCount() === 1}>1 message</Match>
                  <Match when={dataCount() > 1}>{dataCount()} messages</Match>
                </Switch>
              </span>

              <Show when={dataCount() > 0}>
                <button onClick={() => setData([])}>clear</button>
              </Show>
            </div>

            <div class="messages-body">
              <Show when={dataCount() === 0}>
                <div class="text-xl">Get this party started 🎉</div>
              </Show>

              <For each={data()}>
                {(entry) => (
                  <div class="message">
                    <Switch>
                      <Match when={entry.action}>
                        <span class="message-action">
                          &gt; {entry.username} {entry.action}
                        </span>
                      </Match>
                      <Match when={entry.message}>
                        <span class="message-username">{entry.username}:</span>{" "}
                        <span class="message-message">{entry.message}</span>
                      </Match>
                    </Switch>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>
      </main>
    </>
  );
};

export default App;
