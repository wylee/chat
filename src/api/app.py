import os
import toml
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .endpoints import home, broadcast
from .settings import Settings


class App(FastAPI):
    def __init__(self, *args, **kwargs):
        self.settings = kwargs.pop("settings")
        super().__init__(*args, **kwargs)


class AppErr(Exception):
    pass


def factory(settings_file: Optional[str] = None) -> App:
    settings = load_settings(settings_file)

    app = App(
        settings=settings,
        debug=settings.debug,
        title=settings.title,
    )

    if settings.enable_permissive_cors:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_methods=["*"],
            allow_headers=["*"],
        )

    app.include_router(home.router, tags=["home"])
    app.include_router(broadcast.router, prefix="/broadcast", tags=["broadcast"])

    return app


def load_settings(settings_file: Optional[str] = None) -> Settings:
    if settings_file is None:
        try:
            settings_file = os.environ["CHAT_SETTINGS_FILE"]
        except KeyError:
            msg = "The CHAT_SETTINGS_FILE environment variable must be set"
            raise AppErr(msg) from None

    settings_file = Path(settings_file).resolve()

    all_settings = toml.load(settings_file)
    return Settings(**all_settings["api"])
