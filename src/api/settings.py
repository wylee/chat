from pydantic import BaseSettings


class Settings(BaseSettings):
    env: str
    debug: bool = False
    title: str = "Chat"
    enable_permissive_cors: bool = False
