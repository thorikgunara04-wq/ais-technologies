import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Ambil Key dari Environment Variable Vercel
api_key = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=api_key)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        user_data = request.json
        user_message = user_data.get('message', '')

        # Format pemanggilan terbaru untuk library 0.5.0+
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        
        # Penulisan pesan yang lebih stabil
        response = model.generate_content(user_message)
        
        return jsonify({"response": response.text})

    except Exception as e:
        # Menampilkan pesan error asli agar kita tahu penyakitnya
        return jsonify({"response": f"Sistem butuh penyesuaian: {str(e)}"}), 500
