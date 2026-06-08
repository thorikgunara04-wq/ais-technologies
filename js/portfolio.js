// PORTFOLIO SIMULATORS - AIS TECH SYSTEM

// -------------------------------------------------------------
// 1. DATABASE MOCK / SIMULATED DATA
// -------------------------------------------------------------

// Sukabumi Flasher (SF) Mock Database
const sfDatabase = {
    "SF-2026-001": {
        no: "SF-2026-001",
        tanggal: "2026-05-26",
        device: "Poco X3 Pro (vayu)",
        nama: "Bro Farhan",
        noWa: "628123456789",
        kerusakan: "Hardbrick / Qualcomm HS-USB QDLoader 9008",
        tindakan: "Flashing Global ROM & Repair partition via UFI Box",
        teknisi: "erik",
        biaya: 250000,
        laba: 200000,
        status: "Done",
        bitStage: 5 // Bit 5: Ulangan (Tested & Ready)
    },
    "SF-2026-002": {
        no: "SF-2026-002",
        tanggal: "2026-05-26",
        device: "Samsung Galaxy A52",
        nama: "Sist Rina",
        noWa: "628571234567",
        kerusakan: "Bootloop after OTA Update",
        tindakan: "Upgrade Firmware & Re-flash System ROM",
        teknisi: "eja",
        biaya: 150000,
        laba: 120000,
        status: "Repair",
        bitStage: 4 // Bit 4: Urusan (Undergoing Flashing)
    },
    "SF-2026-003": {
        no: "SF-2026-003",
        tanggal: "2026-05-26",
        device: "Xiaomi Redmi Note 10 Pro",
        nama: "Bro Wildan",
        noWa: "628998765432",
        kerusakan: "Mati Total / Short VBat",
        tindakan: "Analisa jalur IC Power & Reballing Chipset",
        teknisi: "dana",
        biaya: 450000,
        laba: 350000,
        status: "Analisa",
        bitStage: 2 // Bit 2: Ukuran (Inspecting)
    }
};

// Rambay Pulsa (RP) Mock Data
let rpMerchantBalance = 2345000;
let rpTodayTransactionsCount = 42;
let rpTodayProfit = 345000;

const rpTransactionsLog = [
    { id: "TX-9901", waktu: "14:45", operator: "Telkomsel", nomor: "081234998822", nominal: "10.000", profit: 2000, status: "Success" },
    { id: "TX-9902", waktu: "14:48", operator: "DANA", nomor: "085811223344", nominal: "50.000", profit: 3000, status: "Success" },
    { id: "TX-9903", waktu: "14:52", operator: "BCA Transfer", nomor: "987654321", nominal: "100.000", profit: 2500, status: "Success" }
];

// -------------------------------------------------------------
// 2. SUKABUMI FLASHER (SF) INTERACTIVE LOGIC
// -------------------------------------------------------------

// Active Service Queue for SF Dashboard Panel
function loadSfDashboardQueue() {
    const tableBody = document.getElementById("sf-queue-table-body");
    if (!tableBody) return;
    
    tableBody.innerHTML = "";
    Object.values(sfDatabase).forEach((s, idx) => {
        let badgeClass = "badge-analisa";
        if (s.status === "Done") badgeClass = "badge-done";
        else if (s.status === "Repair") badgeClass = "badge-repair";
        else if (s.status === "Wait Part") badgeClass = "badge-wait";
        
        tableBody.innerHTML += `
            <tr>
                <td>${idx + 1}</td>
                <td>${s.no}</td>
                <td>${s.device}</td>
                <td>
                    <b>${s.nama}</b><br>
                    <small style="color: #25D366;">${s.noWa}</small>
                </td>
                <td><span class="status-badge ${badgeClass}">${s.status}</span></td>
                <td style="font-size:0.8rem; color:#a3b8b0;">${s.kerusakan}</td>
                <td style="font-size:0.8rem; color:#dfb26c; font-weight:600;">${s.tindakan}</td>
                <td>${s.teknisi}</td>
                <td style="color:#ff5722; font-weight:bold;">Rp ${s.laba.toLocaleString('id-ID')}</td>
                <td>
                    <button class="switch-btn active" style="padding: 4px 10px; font-size:0.7rem;" onclick="simulateSfAction('${s.no}')">
                        ${s.status === 'Repair' ? '💻 Flash ROM' : '👁️ Detail'}
                    </button>
                </td>
            </tr>
        `;
    });
}

// Simulate action click on SF dashboard
function simulateSfAction(notaId) {
    const data = sfDatabase[notaId];
    if (!data) return;
    
    if (data.status === "Repair") {
        // Toggle view to Consumer portal & trigger flashing simulator automatically!
        const sfPortalBtn = document.getElementById("btn-sf-portal");
        if (sfPortalBtn) sfPortalBtn.click();
        
        const searchInput = document.getElementById("sf-nota-input");
        if (searchInput) {
            searchInput.value = notaId;
            checkNotaRepairStatus(notaId);
        }
    } else {
        alert(`Unit: ${data.device}\nOwner: ${data.nama}\nStatus: ${data.status}\nTindakan: ${data.tindakan}\nLaba Bersih: Rp ${data.laba.toLocaleString('id-ID')}`);
    }
}

// Check Repair Status via Nota (Consumer Portal)
function checkNotaRepairStatus(notaIdInput = null) {
    const query = notaIdInput || document.getElementById("sf-nota-input").value.trim().toUpperCase();
    const resultBox = document.getElementById("sf-portal-result");
    
    if (!query) {
        alert("Harap masukkan nomor nota servis!");
        return;
    }
    
    const record = sfDatabase[query];
    if (!record) {
        alert("Maaf, Nomor Nota Servis tidak ditemukan!");
        return;
    }
    
    resultBox.style.display = "block";
    
    // Update basic fields
    document.getElementById("sf-res-nota").innerText = record.no;
    document.getElementById("sf-res-device").innerText = record.device;
    document.getElementById("sf-res-user").innerText = record.nama;
    document.getElementById("sf-res-teknisi").innerText = record.teknisi;
    document.getElementById("sf-res-tindakan").innerText = record.tindakan;
    document.getElementById("sf-res-cost").innerText = "Rp " + record.biaya.toLocaleString("id-ID");
    
    // Set 5-Bit Progress
    const steps = document.querySelectorAll(".sf-timeline-step");
    const progressFill = document.getElementById("sf-timeline-fill");
    
    // Reset all steps first
    steps.forEach(step => {
        step.classList.remove("active", "completed");
    });
    
    const stage = record.bitStage;
    const progressPercentage = ((stage - 1) / 4) * 100;
    progressFill.style.width = progressPercentage + "%";
    
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < stage) {
            step.classList.add("completed");
        } else if (stepNum === stage) {
            step.classList.add("active");
        }
    });
    
    // Manage terminal simulator visibility
    const terminalContainer = document.getElementById("sf-terminal-area");
    if (record.status === "Repair") {
        terminalContainer.style.display = "block";
        startInteractiveFlashing(record.device);
    } else {
        terminalContainer.style.display = "none";
    }
}

// Interactive Flashing Command-Line Logs Simulator (UFI Box/Mi Flash style)
function startInteractiveFlashing(deviceName) {
    const terminal = document.getElementById("sf-terminal-console");
    if (!terminal) return;
    
    terminal.innerHTML = "";
    const logs = [
        `[AIS-GENESIS-EDL-ENGINE] Connecting to device via Qualcomm QDLoader 9008...`,
        `[OK] COM Port 8 detected. Initializing handshake...`,
        `[OK] Device handshake succeeded. CPU ID: Snapdragon 860.`,
        `[INFO] Target: ${deviceName}`,
        `[OK] Sending firehose programmer... OK`,
        `[OK] Reading partition table XML maps... OK`,
        `[WARNING] GPT tables healthy. Secure boot enabled.`,
        `[OK] Erasing partition 'system'... Done (0.84s)`,
        `[PROCESS] Flashing 'boot.img'... Done (0.45s)`,
        `[PROCESS] Flashing 'system.img' (3.4GB Partition)... [30%]`,
        `[PROCESS] Flashing 'system.img' (3.4GB Partition)... [65%]`,
        `[PROCESS] Flashing 'system.img' (3.4GB Partition)... [95%]`,
        `[OK] Flashing 'system.img' finished successfully.`,
        `[PROCESS] Flashing 'userdata.img'... Done (2.12s)`,
        `[PROCESS] Verifying write integrity MD5 check... OK`,
        `[OK] Rebuilding Milestone 5 (Ulangan) parameters.`,
        `[OK] Rebooting system partition. USB Disconnected.`,
        `======================================================`,
        `✅ SUCCESS: Flashing ROM ${deviceName} Completed!`,
        `Estimated technician hours saved: 45 minutes.`
    ];
    
    let currentLine = 0;
    
    function printNextLine() {
        if (currentLine < logs.length) {
            const line = document.createElement("div");
            line.className = "terminal-line";
            line.innerText = logs[currentLine];
            
            // Apply different colors based on tags
            if (logs[currentLine].includes("[OK]") || logs[currentLine].includes("✅")) {
                line.style.color = "#ff5722"; // fiery cyber orange
            } else if (logs[currentLine].includes("[WARNING]")) {
                line.style.color = "#f59e0b"; // cyber amber gold
            } else if (logs[currentLine].includes("SUCCESS")) {
                line.style.color = "#ef4444"; // cyber crimson red
                line.style.fontWeight = "bold";
            }
            
            terminal.appendChild(line);
            terminal.scrollTop = terminal.scrollHeight;
            
            currentLine++;
            
            // Simulate variable speeds for write sectors
            let speed = 400 + Math.random() * 600;
            if (logs[currentLine - 1].includes("system.img")) speed = 1200;
            
            setTimeout(printNextLine, speed);
        } else {
            // Once flashing is complete, upgrade database status from Repair to Done!
            const nota = document.getElementById("sf-res-nota").innerText;
            if (sfDatabase[nota] && sfDatabase[nota].status === "Repair") {
                sfDatabase[nota].status = "Done";
                sfDatabase[nota].bitStage = 5;
                
                // Refresh views
                loadSfDashboardQueue();
                setTimeout(() => {
                    checkNotaRepairStatus(nota);
                }, 1000);
            }
        }
    }
    
    setTimeout(printNextLine, 500);
}

// -------------------------------------------------------------
// 3. RAMBAY PULSA (RP) INTERACTIVE LOGIC
// -------------------------------------------------------------

// Active Transactions Table for RP Agent Dashboard
function loadRpTransactions() {
    const tableBody = document.getElementById("rp-tx-table-body");
    if (!tableBody) return;
    
    tableBody.innerHTML = "";
    rpTransactionsLog.forEach((tx, idx) => {
        tableBody.innerHTML += `
            <tr style="background: rgba(255, 87, 34, 0.02);">
                <td style="color:var(--gold); font-weight:600;">⚡ ${tx.id}</td>
                <td>${tx.waktu}</td>
                <td style="font-weight:600;">${tx.operator}</td>
                <td style="font-family:var(--font-mono);">${tx.nomor}</td>
                <td style="font-family:var(--font-mono); font-weight:600;">${tx.nominal}</td>
                <td style="color:#ff5722; font-weight:bold;">Rp ${tx.profit.toLocaleString('id-ID')}</td>
                <td><span class="status-badge badge-cash">SUCCESS</span></td>
            </tr>
        `;
    });
}

// Handle order form submit & print virtual thermal receipt
function processRpTransaction(event) {
    event.preventDefault();
    
    const provider = document.getElementById("rp-tx-provider").value;
    const phoneNum = document.getElementById("rp-tx-number").value.trim();
    const nominal = document.getElementById("rp-tx-nominal").value;
    
    if (!provider || !phoneNum || !nominal) {
        alert("Harap lengkapi semua isian transaksi!");
        return;
    }
    
    // Simulate transaction delay
    const buyBtn = document.getElementById("rp-tx-submit");
    const originalBtnText = buyBtn.innerHTML;
    
    buyBtn.disabled = true;
    buyBtn.innerHTML = `⏳ MEMPROSES GATEWAY...`;
    
    setTimeout(() => {
        buyBtn.innerHTML = `🛡️ MENGAMBIL CALLBACK...`;
        
        setTimeout(() => {
            buyBtn.disabled = false;
            buyBtn.innerHTML = originalBtnText;
            
            // Calculate profits
            const cost = parseInt(nominal) * 1000;
            const profit = Math.round(cost * 0.05); // 5% profit margin
            const totalJual = cost + 2000; // admin fee Rp 2.000
            
            // Deduct merchant balance & add transactions
            rpMerchantBalance -= cost;
            rpTodayTransactionsCount += 1;
            rpTodayProfit += profit;
            
            // Generate Transaction ID
            const txId = "TX-" + (9900 + rpTransactionsLog.length + 1);
            
            const newTx = {
                id: txId,
                waktu: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
                operator: provider,
                nomor: phoneNum,
                nominal: parseInt(nominal).toLocaleString("id-ID") + ".000",
                profit: profit,
                status: "Success"
            };
            
            rpTransactionsLog.unshift(newTx); // Add to top of logs
            
            // Refresh RP dashboard values
            loadRpDashboardStats();
            loadRpTransactions();
            
            // Show Thermal Receipt Popup!
            showThermalReceipt(newTx, totalJual);
            
            // Reset Form
            document.getElementById("rp-order-form").reset();
        }, 1200);
    }, 1500);
}

// Populate stats tiles on RP agent dashboard
function loadRpDashboardStats() {
    const balEl = document.getElementById("rp-kpi-balance");
    const countEl = document.getElementById("rp-kpi-count");
    const profitEl = document.getElementById("rp-kpi-profit");
    
    if (balEl) balEl.innerText = "Rp " + rpMerchantBalance.toLocaleString("id-ID");
    if (countEl) countEl.innerText = rpTodayTransactionsCount + " Transaksi";
    if (profitEl) profitEl.innerText = "Rp " + rpTodayProfit.toLocaleString("id-ID");
}

// Show beautiful virtual thermal receipt modal
function showThermalReceipt(txData, totalCharge) {
    const backdrop = document.getElementById("receipt-modal-backdrop");
    if (!backdrop) return;
    
    // Populate receipt data
    document.getElementById("receipt-tx-id").innerText = txData.id;
    document.getElementById("receipt-time").innerText = txData.waktu + " WIB";
    document.getElementById("receipt-product").innerText = `Pulsa ${txData.operator} ${txData.nominal}`;
    document.getElementById("receipt-number").innerText = txData.nomor;
    document.getElementById("receipt-price").innerText = "Rp " + totalCharge.toLocaleString("id-ID");
    
    // Set random serial number token for PLN or pulsa
    const snToken = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
    document.getElementById("receipt-sn").innerText = snToken.toString().match(/.{1,4}/g).join(" ");
    
    backdrop.style.display = "flex";
}

function closeReceiptModal() {
    const backdrop = document.getElementById("receipt-modal-backdrop");
    if (backdrop) backdrop.style.display = "none";
}

// Simulated Hermes WhatsApp NLP AI Gateway Controller
function handleWaChatKey(event) {
    if (event.key === "Enter") {
        sendWaGatewayMessage();
    }
}

function sendWaGatewayMessage() {
    const input = document.getElementById("waChatInput");
    const msgArea = document.getElementById("waChatArea");
    
    if (!input || !msgArea) return;
    
    const text = input.value.trim();
    if (!text) return;
    
    // Render user message
    msgArea.innerHTML += `
        <div class="wa-msg-bubble user">
            ${text}
        </div>
    `;
    
    input.value = "";
    msgArea.scrollTop = msgArea.scrollHeight;
    
    // Simulate Hermes typing thinking...
    setTimeout(() => {
        let response = "";
        const cleanText = text.toLowerCase();
        
        if (cleanText.includes("pulsa") && cleanText.includes("xl")) {
            response = `🟢 **[Hermes AI Gateway SUCCESS]**<br>
                        Transaksi otomatis berhasil diproses via Digiflazz Gateway!<br>
                        • **Produk:** Pulsa XL 10.000<br>
                        • **Tujuan:** 08123456789<br>
                        • **Potong Saldo:** Rp 10.200 (Sisa: Rp ${(rpMerchantBalance - 10200).toLocaleString('id-ID')})<br>
                        • **SN:** 2026052600210088921<br>
                        *WhatsApp otomatis dikirim ke pelanggan!*`;
        } else if (cleanText.includes("dana")) {
            response = `🟢 **[Hermes AI Gateway SUCCESS]**<br>
                        Top-up dompet digital sukses!<br>
                        • **Layanan:** DANA Deposit<br>
                        • **Nomor Akun:** 085811223344<br>
                        • **Nominal:** Rp 50.000 (Admin Rp 500)<br>
                        • **Sisa Saldo Merchant:** Rp ${(rpMerchantBalance - 50500).toLocaleString('id-ID')}<br>
                        • **SN:** 5002998311029`;
        } else if (cleanText.includes("transfer") && cleanText.includes("bca")) {
            response = `🟢 **[Hermes AI Gateway SUCCESS]**<br>
                        Layanan Jasa Keuangan otomatis terdaftar di Kas Laci!<br>
                        • **Jenis:** Transfer Bank BCA<br>
                        • **Rekening:** 987654321<br>
                        • **Nominal:** Rp 100.000<br>
                        • **Admin:** Rp 5.000 | **Modal:** Rp 2.500<br>
                        • **Laba Bersih:** Rp 2.500<br>
                        • **Kas Laci:** Bertambah Rp 105.000`;
        } else if (cleanText.includes("opex") || cleanText.includes("listrik")) {
            response = `🟢 **[Hermes AI Gateway RECORDED]**<br>
                        Biaya Operasional (Opex) konter telah didokumentasikan:<br>
                        • **Uraian:** Bayar Listrik Token Konter<br>
                        • **Nominal:** Rp 15.000<br>
                        • **Dampaknya:** Mengurangi Laba Bersih harian konter sebesar Rp 15.000.`;
        } else if (cleanText.includes("laporan") || cleanText.includes("laba")) {
            response = `📊 **[AIS HERMES REPORT SYSTEM]**<br>
                        Laporan Finansial Harian Konter Rambay Pulsa:<br>
                        • **Total Laba Kotor:** Rp ${rpTodayProfit.toLocaleString('id-ID')}<br>
                        • **Beban Ops Harian:** Rp 15.000<br>
                        • **Beban Gaji Staf:** Rp 100.000 (Target CTS)<br>
                        • **Laba Bersih Harian:** Rp ${(rpTodayProfit - 115000).toLocaleString('id-ID')}<br>
                        • **Aliran Status:** 🎯 **CLEAR TO HOME (CTH)** — Pertumbuhan Aset Aktif!`;
        } else {
            response = `🤖 **[Hermes AI Gateway Assistant]**<br>
                        Maaf Bos Owner, perintah tidak dikenali. Saya dilatih menggunakan asisten NLP AIS untuk mengenali format seperti:<br>
                        1. *Kirim pulsa [Operator] [Nominal] ke [No HP]*<br>
                        2. *Catat opex [Nama beban] [Nominal]*<br>
                        3. *Tanya Laporan Finansial harian*`;
        }
        
        msgArea.innerHTML += `
            <div class="wa-msg-bubble bot">
                ${response}
            </div>
        `;
        msgArea.scrollTop = msgArea.scrollHeight;
    }, 1000);
}

// Trigger natural language templates in Hermes chatbot widget
function triggerTemplate(text) {
    const input = document.getElementById("waChatInput");
    if (input) {
        input.value = text;
        sendWaGatewayMessage();
    }
}

// -------------------------------------------------------------
// 4. INTERACTIVE DYNAMIC CASH FLOW CALCULATOR (OWNER PANEL)
// -------------------------------------------------------------

function initCashFlowCalculator() {
    const slider = document.getElementById("owner-revenue-slider");
    if (!slider) return;
    
    // Real-time slider adjustments
    slider.addEventListener("input", function() {
        const val = parseInt(this.value);
        document.getElementById("owner-rev-display").innerText = "Rp " + val.toLocaleString("id-ID");
        
        // Calculate allocations
        // Target: Gaji Harian Karyawan (CTS) = Rp 100.000
        // Target: Operasional Konter (CTO) = Rp 50.000
        // Total Beban = Rp 150.000
        const gajiHarian = 100000;
        const opexHarian = 50000;
        const totalBeban = gajiHarian + opexHarian;
        
        // Render 5-Bit level text & color codes
        const statusTextEl = document.getElementById("owner-milestone-text");
        const statusValEl = document.getElementById("owner-milestone-val");
        const fillBar = document.getElementById("owner-milestone-bar");
        
        let statusText = "";
        let barColor = "#6e757c";
        let barBg = "#6e757c";
        
        if (val >= totalBeban) {
            statusText = "🎯 CLEAR TO HOME (CTH) — Laba Bersih Positif & Aset Berkembang!";
            barColor = "#10b981"; // Success Emerald Green
            barBg = "var(--gradient-solar)"; // Gradient solar (orange-amber-emerald)
        } else if (val >= opexHarian) {
            statusText = "🚀 CLEAR TO OPERATIONAL (CTO) — Beban Ops Terpenuhi!";
            barColor = "#f59e0b"; // Cyber Amber Gold
            barBg = "#f59e0b";
        } else if (val >= gajiHarian) {
            statusText = "⚡ CLEAR TO SALARY (CTS) — Gaji Staf Hari Ini Aman!";
            barColor = "#3b82f6"; // Cyber Blue
            barBg = "#3b82f6";
        } else {
            statusText = "🏃 OTW TARGET MINIMAL (ON PROCESS)";
            barColor = "#ef4444"; // Red
            barBg = "#ef4444";
        }
        
        // Update milestone indicator percentage
        let percentage = (val / totalBeban) * 100;
        if (percentage > 100) percentage = 100;
        
        statusTextEl.innerText = statusText;
        statusTextEl.style.color = barColor;
        statusValEl.innerText = percentage.toFixed(1) + "%";
        statusValEl.style.color = barColor;
        fillBar.style.width = percentage + "%";
        fillBar.style.background = barBg;
        
        // Allocate CTH shares if Laba Bersih is positive
        const labaBersih = val - totalBeban;
        
        const cardKaryawan = document.getElementById("owner-porsi-karyawan");
        const cardAset = document.getElementById("owner-porsi-aset");
        const cardFounder = document.getElementById("owner-porsi-founder");
        const cardInvestor = document.getElementById("owner-porsi-investor");
        
        if (labaBersih > 0) {
            // Allocate 10% employee, 30% asset cash, 30% founder, 30% investor
            const pKaryawan = Math.round(labaBersih * 0.1);
            const pAset = Math.round(labaBersih * 0.3);
            const pFounder = Math.round(labaBersih * 0.3);
            const pInvestor = Math.round(labaBersih * 0.3);
            
            cardKaryawan.innerText = "Rp " + pKaryawan.toLocaleString("id-ID");
            cardAset.innerText = "Rp " + pAset.toLocaleString("id-ID");
            cardFounder.innerText = "Rp " + pFounder.toLocaleString("id-ID");
            cardInvestor.innerText = "Rp " + pInvestor.toLocaleString("id-ID");
            
            // Highlight boxes as active CTH
            document.querySelectorAll(".porsi-card-mini").forEach(c => c.classList.add("active"));
        } else {
            cardKaryawan.innerText = "Rp 0";
            cardAset.innerText = "Rp 0";
            cardFounder.innerText = "Rp 0";
            cardInvestor.innerText = "Rp 0";
            
            // Deactivate highlight
            document.querySelectorAll(".porsi-card-mini").forEach(c => c.classList.remove("active"));
        }
    });
}

// -------------------------------------------------------------
// 5. GLOBAL TAB TOGGLE (PORTFOLIO PANE NAVIGATOR)
// -------------------------------------------------------------

function initPortfolioTabs() {
    const tabTriggers = document.querySelectorAll(".tab-trigger");
    const panes = document.querySelectorAll(".portfolio-pane");
    
    tabTriggers.forEach(trigger => {
        trigger.addEventListener("click", function() {
            const target = this.getAttribute("data-target");
            
            tabTriggers.forEach(t => t.classList.remove("active"));
            panes.forEach(p => p.classList.remove("active"));
            
            this.classList.add("active");
            document.getElementById(target).classList.add("active");
            
            // Load correct sub-panels and queues on activation
            if (target === "pane-sukabumi-flasher") {
                loadSfDashboardQueue();
            } else if (target === "pane-rambay-pulsa") {
                loadRpDashboardStats();
                loadRpTransactions();
            }
        });
    });
    
    // Switch between Dashboard view & Consumer Portal view
    document.querySelectorAll(".switch-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const targetSubId = this.getAttribute("data-target-sub");
            const parentPane = this.closest(".portfolio-pane");
            
            parentPane.querySelectorAll(".switch-btn").forEach(b => b.classList.remove("active"));
            parentPane.querySelectorAll(".sub-pane").forEach(p => p.classList.remove("active"));
            
            this.classList.add("active");
            document.getElementById(targetSubId).classList.add("active");
        });
    });
    
    // RP Dashboard Quick forms tabs toggle
    document.querySelectorAll(".quick-tab-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const formTargetId = this.getAttribute("data-form");
            const parentCard = this.closest(".dashboard-card");
            
            parentCard.querySelectorAll(".quick-tab-btn").forEach(b => b.classList.remove("active"));
            parentCard.querySelectorAll(".form-panel").forEach(p => p.classList.remove("active"));
            
            this.classList.add("active");
            document.getElementById(formTargetId).classList.add("active");
        });
    });
}

// -------------------------------------------------------------
// INITIALIZATION ON DOCUMENT READY
// -------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function() {
    initPortfolioTabs();
    initCashFlowCalculator();
    loadSfDashboardQueue();
    
    // Setup RP Form process events
    const rpForm = document.getElementById("rp-order-form");
    if (rpForm) {
        rpForm.addEventListener("submit", processRpTransaction);
    }
});
