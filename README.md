# Basic Chat App

This is a learning project containing a _super_ basic websocket-based
chat app.

## Purpose

- Revisit FastAPI
- Learn SolidJS and compare with React
- Refresh TailwindCSS skills
- Refresh WebSocket skills

## Stack

- [FastAPI](https://fastapi.tiangolo.com/)
- [SolidJS](https://www.solidjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [TOML](https://toml.io/) for settings

## Installation and Running

### Prerequisites

- Python 3.11 (older versions untested but might work)
- [poetry](https://python-poetry.org)
- Node/npm

### Installation

```shell
git clone git@github.com:wylee/chat.git
cd chat
poetry install
npm install
poetry shell
```

### Runnning

```
run api

# In another terminal
run ui 
```

Now you can open multiple browser tabs, go to http://localhost:3000/,
set a username in each tab, and chat with yourself.

