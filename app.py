import os
import requests as http
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

PIPEDRIVE_TOKEN = os.environ.get("PIPEDRIVE_API_TOKEN", "")
PIPEDRIVE_BASE  = "https://eybna.pipedrive.com/v1"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/subscribe", methods=["POST"])
def subscribe():
    data  = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    if not PIPEDRIVE_TOKEN:
        return jsonify({"error": "Server configuration error"}), 500

    params = {"api_token": PIPEDRIVE_TOKEN}

    try:
        # 1. Create / find the person
        p_resp = http.post(
            f"{PIPEDRIVE_BASE}/persons",
            params=params,
            json={"name": email, "email": [{"value": email, "primary": True}]},
            timeout=10,
        )
        p_resp.raise_for_status()
        person_id = p_resp.json()["data"]["id"]

        # 2. Create the lead
        l_resp = http.post(
            f"{PIPEDRIVE_BASE}/leads",
            params=params,
            json={"title": "BUUZ Website Signup", "person_id": person_id},
            timeout=10,
        )
        l_resp.raise_for_status()

        return jsonify({"success": True})

    except http.exceptions.RequestException as exc:
        return jsonify({"error": str(exc)}), 502
