import json
from typing import List

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


@router.websocket("/{username}")
async def broadcast(websocket: WebSocket, username: str):
    await manager.connect(websocket)
    await manager.broadcast(dump_action(username, "joined"))
    try:
        while True:
            message = await websocket.receive_text()
            await manager.broadcast(dump_message(username, message))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(dump_action(username, "left"))


def dump_action(username, action):
    return json.dumps({"username": username, "action": action})


def dump_message(username, message):
    return json.dumps({"username": username, "message": message})
