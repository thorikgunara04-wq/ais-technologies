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
    return genai.GenerativeModel('gemini-2.0-flash')

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
            "Sistem kami membantu owner mengontrol CTH (Clear to Home) jam 4 sore secara otomatis. "
            "PORTOFOLIO: "
            "1. Sukabumi Flasher (SF-Manager): Dasbor teknisi (gaji g_hari & opex o_hari, milestone CTS/CTO/CTH harian) dan Portal Pelanggan untuk cek status perbaikan HP secara real-time melintasi 5-Bit Logic (Urutan, Ukuran, Uraian, Urusan, Ulangan) lengkap dengan simulator flashing console log. "
            "2. Rambay Pulsa (RP-Engine): Core transaksi pulsa, kuota, restok, & jasa keuangan (Transfer/Top-up) terintegrasi Digiflazz Gateway. Memiliki simulator Hermes WhatsApp AI Gateway (NLP transaksi bahasa alami) dan printer Struk Thermal Virtual."
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