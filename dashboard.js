document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const BOT_TOKEN = '7285369349:AAEqC1zaBowR7o3rq2_J2ewPRwUUaNE7KKM';
    const GROUP_ID = '-4815878740';
    const POLL_INTERVAL = 2000; // 2 seconds
    const TIMEOUT = 30000; // 30 seconds
    
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
    const closeButtons = document.querySelectorAll('.close');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Set username from localStorage
    const currentUser = JSON.parse(localStorage.getItem(localStorage.getItem('currentUser')));
    if (currentUser && currentUser.name) {
        document.getElementById('username').textContent = currentUser.name;
        document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.name}`;
    }
    
    // Event Listeners
    startDeployBtn.addEventListener('click', () => {
        passcodeModal.style.display = 'flex';
    });
    
    passcodeInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
    });
    
    submitPasscodeBtn.addEventListener('click', verifyPasscode);
    
    submitWhatsappBtn.addEventListener('click', pairWhatsAppNumber);
    
    copyCodeBtn.addEventListener('click', copyPairingCode);
    
    clearConsoleBtn.addEventListener('click', () => {
        consoleOutput.innerHTML = '<div class="console-line">Console cleared</div>';
    });
    
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
        
        if (passcode.length !== 4) {
            showStatus(passcodeStatus, 'Please enter a 4-digit passcode', 'error');
            return;
        }
        
        showStatus(passcodeStatus, 'Verifying passcode...', 'info');
        
        try {
            // Send passcode to Telegram group
            await sendTelegramMessage(`/passcode ${passcode}`);
            
            // Listen for response
            const response = await listenForTelegramResponse(
                `passcode ${passcode}`,
                ['approved', 'decline'],
                TIMEOUT
            );
            
            if (response && response.toLowerCase().includes('approved')) {
                showStatus(passcodeStatus, 'Passcode verified successfully!', 'success');
                setTimeout(() => {
                    passcodeModal.style.display = 'none';
                    startDeploymentProcess();
                }, 1500);
            } else if (response && response.toLowerCase().includes('decline')) {
                showStatus(passcodeStatus, 'Incorrect passcode. Please get a valid passcode from the Telegram bot.', 'error');
            } else {
                showStatus(passcodeStatus, 'Failed to verify passcode. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showStatus(passcodeStatus, 'Failed to verify passcode. Please try again.', 'error');
        }
    }
    
    async function startDeploymentProcess() {
        addConsoleLine('Starting Big Daddy V2 deployment...', 'info');
        
        // Simulate deployment steps
        const steps = [
            { text: 'Initializing system...', delay: 1000 },
            { text: 'Connecting to servers...', delay: 1500 },
            { text: 'Authenticating credentials...', delay: 2000 },
            { text: 'Downloading required packages...', delay: 2500 },
            { text: 'Verifying dependencies...', delay: 2000 },
            { text: 'Building deployment package...', delay: 3000 },
            { text: 'Deployment ready!', delay: 1000, type: 'success' },
            { text: 'Please pair your WhatsApp number to continue', delay: 0, type: 'info' }
        ];
        
        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, step.delay));
            addConsoleLine(step.text, step.type || 'info');
        }
        
        // Show WhatsApp number modal
        whatsappModal.style.display = 'flex';
    }
    
    async function pairWhatsAppNumber() {
        const phoneNumber = whatsappInput.value.trim();
        
        if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
            showStatus(whatsappStatus, 'Please enter a valid WhatsApp number with country code (digits only)', 'error');
            return;
        }
        
        showStatus(whatsappStatus, 'Pairing your WhatsApp number...', 'info');
        
        try {
            // Send pair command to Telegram group
            await sendTelegramMessage(`/pair ${phoneNumber}`);
            
            // Listen for pairing code
            const pairingResponse = await listenForTelegramResponse(
                `Pairing code for ${phoneNumber}`,
                ['DRAY-'],
                TIMEOUT
            );
            
            if (pairingResponse) {
                // Extract pairing code
                const codeMatch = pairingResponse.match(/DRAY-\d{4}/);
                if (codeMatch) {
                    const pairingCodeValue = codeMatch[0];
                    pairingCode.textContent = pairingCodeValue;
                    pairingCodeContainer.style.display = 'block';
                    showStatus(whatsappStatus, 'Pairing code generated', 'success');
                    
                    // Now listen for connection confirmation
                    const connectionResponse = await listenForTelegramResponse(
                        `Connected successfully to`,
                        [`◁️ ${phoneNumber}`],
                        TIMEOUT
                    );
                    
                    if (connectionResponse) {
                        addConsoleLine('╭⭑━━━➤ PHISTAR BOT INC', 'info');
                        addConsoleLine('┣ ◁️ Connected successfully to', 'info');
                        addConsoleLine(`┣ ◁️ ${phoneNumber}`, 'info');
                        addConsoleLine('╰━━━━━━━━━━━━━━━━━━━╯', 'info');
                        addConsoleLine('Your bot is now live on your WhatsApp!', 'success');
                        
                        // Hide modals
                        whatsappModal.style.display = 'none';
                    } else {
                        const errorResponse = await listenForTelegramResponse(
                            phoneNumber,
                            ['already connected', 'No session found'],
                            TIMEOUT
                        );
                        
                        if (errorResponse && errorResponse.toLowerCase().includes('already connected')) {
                            showStatus(whatsappStatus, 'This WhatsApp is already connected. Please disconnect it first.', 'error');
                            addConsoleLine(`⚠️ ${phoneNumber} is already connected to Big Daddy V1mini. Use /delpair to disconnect first!`, 'error');
                        } else {
                            showStatus(whatsappStatus, 'Failed to establish connection. Please try again.', 'error');
                        }
                    }
                }
            } else {
                showStatus(whatsappStatus, 'Failed to get pairing code. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showStatus(whatsappStatus, 'Failed to pair WhatsApp number. Please try again.', 'error');
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
    
    async function listenForTelegramResponse(triggerText, successKeywords, timeout) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            let lastUpdateId = 0;
            let pollingActive = true;
            
            const pollInterval = setInterval(async () => {
                if (!pollingActive) return;
                
                if (Date.now() - startTime > timeout) {
                    clearInterval(pollInterval);
                    pollingActive = false;
                    resolve(null);
                    return;
                }
                
                try {
                    const updates = await getTelegramUpdates(lastUpdateId);
                    if (updates.ok && updates.result.length > 0) {
                        lastUpdateId = updates.result[updates.result.length - 1].update_id + 1;
                        
                        for (const update of updates.result) {
                            if (!pollingActive) break;
                            
                            if (update.message && update.message.chat.id.toString() === GROUP_ID.toString().replace('-', '')) {
                                const messageText = update.message.text || '';
                                
                                // Check if message contains our trigger text
                                if (messageText.includes(triggerText)) {
                                    // Check for success keywords if provided
                                    if (successKeywords) {
                                        for (const keyword of successKeywords) {
                                            if (messageText.toLowerCase().includes(keyword.toLowerCase())) {
                                                clearInterval(pollInterval);
                                                pollingActive = false;
                                                resolve(messageText);
                                                return;
                                            }
                                        }
                                    } else {
                                        clearInterval(pollInterval);
                                        pollingActive = false;
                                        resolve(messageText);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Polling error:', error);
                    clearInterval(pollInterval);
                    pollingActive = false;
                    reject(error);
                }
            }, POLL_INTERVAL);
        });
    }
    
    async function getTelegramUpdates(offset = 0) {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}`;
        const response = await fetch(url);
        return response.json();
    }
    
    // Initialize console
    addConsoleLine('Big Daddy V2 Deployment Console initialized', 'info');
});
