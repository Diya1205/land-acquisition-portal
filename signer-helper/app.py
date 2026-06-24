from flask import Flask
from flask_cors import CORS
import subprocess

app = Flask(__name__)

CORS(app)

@app.route("/open-signer", methods=["GET", "POST"])
def open_signer():

    subprocess.Popen(
        r"C:\Land_acquisition\Docs Signer\PdfSignerService.exe"
    )

    return { 
        "success": True
    }

app.run(
    host="127.0.0.1",
    port=5000
)