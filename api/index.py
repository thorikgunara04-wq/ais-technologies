import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Ambil API KEY dari Vercel Environment Variables nanti
api_key = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=api_key)

def get_working_model():
    # Gunakan model terbaru yang tersedia
    return genai.GenerativeModel('gemini-1.5-flash')

model = get_working_model()

@app.route('/api/chat', methods=['POST']) # Jalur URL Vercel
def chat():
    try:
        user_data = request.json
        user_message = user_data.get('message', '')

        web_content = (
            "AIS Technologies adalah pengembang sistem bisnis berbasis digital milik Bro Thorik. "
            "FOKUS: Sistem '5-Bit Clean Logic', Data Automation, & Agen AI. "
            "FILOSOFI: Membangun Karakter Usaha, bukan sekadar imaji. "
            "Sistem kami membantu owner mengontrol CTH jam 4 sore secara otomatis."
        )

        prompt = (
            f"Kamu adalah AI AIS Technologies. Jawab HANYA berdasarkan data ini: {web_content}. "
            f"Gunakan gaya bahasa profesional tapi santai dengan panggilan Bro/Sist. "
            f"Pertanyaan user: {user_message}"
        )

        response = model.generate_content(prompt)
        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"response": f"Sistem lagi maintenance bro: {str(e)}"}), 500

# Penting: Vercel butuh variabel 'app' untuk dijalankan
# Tidak perlu app.run() di sini
