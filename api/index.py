import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# --- BAGIAN KRUSIAL ---
# Kita paksa konfigurasi ke versi v1 agar tidak nyangkut di v1beta
os.environ["GOOGLE_API_USE_MTLS_ENDPOINT"] = "never" 

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message', '')
        
        # Kita panggil model dengan cara yang paling eksplisit
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        
        response = model.generate_content(user_message)
        return jsonify({"response": response.text})

    except Exception as e:
        # Tambahkan kata 'PENETU' biar kita tahu ini hasil kode yang baru
        return jsonify({"response": f"Penentu - Error: {str(e)}"}), 500
