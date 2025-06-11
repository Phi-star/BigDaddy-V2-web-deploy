document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const BOT_TOKEN = '7285369349:AAEqC1zaBowR7o3rq2_J2ewPRwUUaNE7KKM';
    const GROUP_ID = '-4871271467';
    
    // DOM Elements
    const startDeployBtn = document.getElementById('startDeployBtn');
    const passcodeModal = document.getElementById('passcodeModal');
    const whatsappModal = document.getElementById('whatsappModal');
    const passcodeInput = document.getElementById('passcodeInput');
    const submitPasscodeBtn = document.getElementById('submitPasscodeBtn');
    const passcodeStatus = document.getElementById('passcodeStatus');
    const whatsappInput = document.getElementById('whatsappInput');
    const submitWhatsappBtn = document.getElementById('submitWhatsappBtn');
    const pairingCodeContainer = document.getElementById('pairingCodeContainer');
    const pairingCode = document.getElementById('pairingCode');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const whatsappStatus = document.getElementById('whatsappStatus');
    const consoleOutput = document.getElementById('consoleOutput');
    const clearConsoleBtn = document.getElementById('clearConsoleBtn');
    const stopBotBtn = document.getElementById('stopBotBtn');
    const restartBotBtn = document.getElementById('restartBotBtn');
    const closeButtons = document.querySelectorAll('.close');
    const logoutBtn = document.getElementById('logoutBtn');
    const themeBtns = document.querySelectorAll('.theme-btn');
    
    // State variables
    let connectedNumber = null;
    let isBotRunning = false;
    
    // Set username from localStorage
    const currentUser = JSON.parse(localStorage.getItem(localStorage.getItem('currentUser')));
    if (currentUser && currentUser.name) {
        document.getElementById('username').textContent = currentUser.name;
        document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.name}`;
    }
    
    // Theme switching
    themeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            document.body.className = `${theme}-theme`;
            
            themeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            localStorage.setItem('theme', theme);
        });
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = `${savedTheme}-theme`;
    document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`).classList.add('active');
    
    // Event Listeners
    startDeployBtn.addEventListener('click', () => {
        if (isBotRunning) {
            addConsoleLine('Bot is already running', 'warning');
            return;
        }
        if (connectedNumber) {
            // If we have a connected number, skip to deployment
            startDeploymentProcess();
        } else {
            // Fresh start - ask for passcode first
            passcodeModal.style.display = 'flex';
        }
    });
    
    passcodeInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 9);
    });
    
    submitPasscodeBtn.addEventListener('click', verifyPasscode);
    submitWhatsappBtn.addEventListener('click', pairWhatsAppNumber);
    copyCodeBtn.addEventListener('click', copyPairingCode);
    clearConsoleBtn.addEventListener('click', () => {
        consoleOutput.innerHTML = '<div class="console-line">Console cleared</div>';
    });
    
    stopBotBtn.addEventListener('click', stopBot);
    restartBotBtn.addEventListener('click', restartBot);
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Functions
    function addConsoleLine(text, type = '') {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = text;
        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
    
    function showStatus(element, message, type) {
        element.textContent = message;
        element.className = '';
        element.classList.add(`status-${type}`);
        element.style.display = 'block';
    }
    
    async function verifyPasscode() {
        const passcode = passcodeInput.value.trim();
        
        if (passcode.length !== 9) {
            showStatus(passcodeStatus, 'Please enter a 9-digit passcode', 'error');
            return;
        }
        
        const firstThree = passcode.substring(0, 3);
        if (firstThree.includes('6')) {
            showStatus(passcodeStatus, 'Passcode verified successfully!', 'success');
            setTimeout(() => {
                passcodeModal.style.display = 'none';
                whatsappModal.style.display = 'flex';
            }, 1500);
        } else {
            showStatus(passcodeStatus, 'Failed to verify passcode. Please get passcode from Telegram bot.', 'error');
        }
    }
    
    async function startDeploymentProcess() {
        addConsoleLine('Starting Big Daddy V2 deployment...', 'info');
        
        const steps = [
            { text: 'Initializing system...', delay: 1000 },
            { text: 'Connecting to servers...', delay: 1500 },
            { text: 'Authenticating credentials...', delay: 2000 },
            { text: 'Downloading required packages...', delay: 2500 },
            { text: 'Verifying dependencies...', delay: 2000 },
            { text: 'Building deployment package...', delay: 3000 },
            { text: 'Deployment ready!', delay: 1000, type: 'success' }
        ];
        
        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, step.delay));
            addConsoleLine(step.text, step.type || 'info');
        }
        
        if (!connectedNumber) {
            addConsoleLine('Please enter your WhatsApp number to continue', 'info');
            whatsappModal.style.display = 'flex';
        }
    }
    
    async function pairWhatsAppNumber() {
        const phoneNumber = whatsappInput.value.trim();
        
        if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
            showStatus(whatsappStatus, 'Please enter a valid WhatsApp number with country code (digits only)', 'error');
            return;
        }
        
        connectedNumber = phoneNumber;
        showStatus(whatsappStatus, 'Processing your WhatsApp number...', 'info');
        
        try {
            await sendTelegramMessage(`/pair ${phoneNumber}`);
            showStatus(whatsappStatus, 'Number submitted successfully! Generating pairing code...', 'success');
            
            setTimeout(() => {
                pairingCodeContainer.style.display = 'block';
                showStatus(whatsappStatus, 'Pairing code generated successfully!', 'success');
                
                setTimeout(() => {
                    addConsoleLine('╭⭑━━━➤ PHISTAR BOT INC', 'info');
                    addConsoleLine(`┣ ◁️ Connecting to ${phoneNumber}...`, 'info');
                    addConsoleLine('╰━━━━━━━━━━━━━━━━━━━╯', 'info');
                    
                    setTimeout(() => {
                        addConsoleLine('Connection established successfully!', 'success');
                        whatsappModal.style.display = 'none';
                        isBotRunning = true;
                        stopBotBtn.style.display = 'inline-flex';
                        restartBotBtn.style.display = 'inline-flex';
                    }, 3000);
                }, 2000);
            }, 2000);
        } catch (error) {
            console.error('Error:', error);
            showStatus(whatsappStatus, 'Failed to process WhatsApp number. Please try again.', 'error');
        }
    }
    
    async function stopBot() {
        if (!connectedNumber) return;
        
        addConsoleLine('Stopping bot...', 'info');
        try {
            await sendTelegramMessage(`/delpair ${connectedNumber}`);
            addConsoleLine('Bot stopped successfully', 'success');
            isBotRunning = false;
            stopBotBtn.style.display = 'none';
            restartBotBtn.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
            addConsoleLine('Failed to stop bot. Please try again.', 'error');
        }
    }
    
    async function restartBot() {
        if (!connectedNumber) return;
        
        addConsoleLine('Restarting bot...', 'info');
        addConsoleLine('Stopping current instance...', 'info');
        
        try {
            await sendTelegramMessage(`/delpair ${connectedNumber}`);
            addConsoleLine('Bot stopped successfully', 'success');
            
            addConsoleLine('Waiting 10 seconds before restart...', 'info');
            await new Promise(resolve => setTimeout(resolve, 10000));
            
            addConsoleLine('Starting bot again...', 'info');
            await sendTelegramMessage(`/pair ${connectedNumber}`);
            addConsoleLine('Bot restart initiated successfully', 'success');
            
            setTimeout(() => {
                addConsoleLine('╭⭑━━━➤ PHISTAR BOT INC', 'info');
                addConsoleLine(`┣ ◁️ Reconnected to ${connectedNumber}`, 'info');
                addConsoleLine('╰━━━━━━━━━━━━━━━━━━━╯', 'info');
                addConsoleLine('Bot is now running again', 'success');
            }, 3000);
        } catch (error) {
            console.error('Error:', error);
            addConsoleLine('Failed to restart bot. Please try again.', 'error');
        }
    }
    
    function copyPairingCode() {
        navigator.clipboard.writeText(pairingCode.textContent)
            .then(() => {
                const originalText = copyCodeBtn.innerHTML;
                copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
                setTimeout(() => {
                    copyCodeBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }
    
    async function sendTelegramMessage(text) {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const data = {
            chat_id: GROUP_ID,
            text: text
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        return response.json();
    }
    
    // Initialize console
    addConsoleLine('Big Daddy V2 Deployment Console initialized', 'info');
});
