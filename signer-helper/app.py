from flask import Flask, request
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)


@app.route("/open-signer", methods=["POST"])
def open_signer():

    data = request.get_json()

    pdf_path = data["pdf"]
    request_id = data["request_id"]

    print("PDF:", pdf_path)
    print("REQUEST:", request_id)

    cmd = [
        r"C:\Land_acquisition\Launcher\dist\launcher.exe",
        pdf_path,
        str(request_id)
    ]

    print(cmd)

    subprocess.Popen(cmd)

    return {
        "success": True
    }


app.run(
    host="127.0.0.1",
    port=5000
)