import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message', '')
        api_key = os.environ.get("GEMINI_API_KEY")
        
        # JALUR LANGSUNG (BYPASS LIBRARY):
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={api_key}"
        
        payload = {
            "contents": [{"parts": [{"text": user_message}]}]
        }
        
        response = requests.post(url, json=payload)
        data = response.json()
        
        if "candidates" in data:
            ai_response = data["candidates"][0]["content"]["parts"][0]["text"]
            return jsonify({"response": ai_response})
        else:
            return jsonify({"response": f"Google Error: {data.get('error', {}).get('message', 'Unknown Error')}"}), 500

    except Exception as e:
        return jsonify({"response": f"Bypass System - Error: {str(e)}"}), 500
