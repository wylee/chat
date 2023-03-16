import os

import uvicorn
from runcommands import command, commands as c


@command
def api(env="dev", settings_file=None, reload=True):
    if settings_file is None:
        settings_file = f"settings.{env}.toml"
    os.environ["CHAT_SETTINGS_FILE"] = settings_file
    uvicorn.run("api.app:factory", factory=True, reload=reload)


@command
def ui():
    c.local("npm start")


@command
def check():
    c.local("ruff .")


@command
def fmt():
    c.local("ruff --fix .")
