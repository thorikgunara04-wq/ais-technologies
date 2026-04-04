import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Ambil API KEY dari Environment Variables Vercel
api_key = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=api_key)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        user_data = request.json
        user_message = user_data.get('message', '')

        # Pakai model 1.5-flash
        model = genai.GenerativeModel('gemini-2.5-flash')

        web_content = (
            "AIS Technologies adalah pengembang sistem bisnis berbasis digital milik Bro Thorik. "
            "FOKUS: Sistem '5-Bit Clean Logic', Data Automation, & Agen AI."
        )

        prompt = f"Kamu adalah AI AIS Technologies. Jawab berdasarkan data ini: {web_content}. Pertanyaan: {user_message}"
        
        response = model.generate_content(prompt)
        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"response": f"Maintenance bro: {str(e)}"}), 500
