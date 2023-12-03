from logging import getLogger, _nameToLevel
from flask import Flask
from os.path import isfile

def read_file(
    file_path,
    *,
    formatter=lambda s: f"[[{s}]]",
    default_folder="web/",
    default_extension=".html",
    **replacements
):
    fpath = default_folder + file_path + default_extension
    data = ""

    if not isfile(fpath):
        return data

    with open(fpath, "r") as f:
        data = f.read()
        f.close()
    
    for key, value in replacements.items():
        data = data.replace(formatter(key), value)
    
    return data

getLogger("werkzeug").setLevel(_nameToLevel["ERROR"])

app = Flask(
    __name__,
    static_url_path="/res",
    static_folder="res"
)

@app.route("/")
def home():
    return read_file("index")

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000
    )

