document.addEventListener('DOMContentLoaded', function() {
    // Get current user from localStorage
    const currentUserEmail = localStorage.getItem('currentUser');
    const currentUser = currentUserEmail ? JSON.parse(localStorage.getItem(currentUserEmail)) : null;
    
    // Elements
    const welcomeMessage = document.getElementById('welcomeMessage');
    const viewPanelBtn = document.getElementById('viewPanelBtn');
    const premiumBtn = document.getElementById('premiumBtn');
    const passcodeModal = document.getElementById('passcodeModal');
    const closeModal = document.querySelector('.close');
    const passcodeInput = document.getElementById('passcode');
    const submitPasscodeBtn = document.getElementById('submitPasscode');
    const passcodeStatus = document.getElementById('passcodeStatus');
    const panelPage = document.getElementById('panelPage');
    const consoleOutput = document.getElementById('consoleOutput');
    const startDeployBtn = document.getElementById('startDeployBtn');
    const phoneInputSection = document.getElementById('phoneInputSection');
    const whatsappNumberInput = document.getElementById('whatsappNumber');
    const submitNumberBtn = document.getElementById('submitNumberBtn');
    const pairingCodeSection = document.getElementById('pairingCodeSection');
    const pairingCodeText = document.getElementById('pairingCodeText');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const stopBotBtn = document.getElementById('stopBotBtn');
    
    // Telegram bot configuration
    const botToken = '7285369349:AAEqC1zaBowR7o3rq2_J2ewPRwUUaNE7KKM';
    const groupId = '-4815878740';
    
    // Set welcome message
    if (currentUser) {
        welcomeMessage.textContent = `Welcome back, ${currentUser.name || 'User'}`;
    }
    
    // View Panel button click
    viewPanelBtn.addEventListener('click', function() {
        passcodeModal.style.display = 'flex';
    });
    
    // Premium button click
    premiumBtn.addEventListener('click', function() {
        // Replace with your actual payment link
        window.open('https://your-payment-link.com', '_blank');
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        passcodeModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === passcodeModal) {
            passcodeModal.style.display = 'none';
        }
    });
    
    // Passcode input validation (only numbers, max 4 digits)
    passcodeInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
    });
    
    // Submit passcode
    submitPasscodeBtn.addEventListener('click', function() {
        const passcode = passcodeInput.value.trim();
        
        if (passcode.length !== 4) {
            showPasscodeStatus('Please enter a 4-digit passcode', 'error');
            return;
        }
        
        verifyPasscode(passcode);
    });
    
    // Verify passcode with Telegram bot
    function verifyPasscode(passcode) {
        showPasscodeStatus('Verifying passcode...', 'info');
        
        // Send passcode to Telegram bot
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const data = {
            chat_id: groupId,
            text: `/passcode ${passcode}`
        };
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // Listen for response from bot
                listenForBotResponse(passcode);
            } else {
                showPasscodeStatus('Failed to verify passcode', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showPasscodeStatus('Connection error', 'error');
        });
    }
    
    // Listen for bot response
    function listenForBotResponse(passcode) {
        const startTime = Date.now();
        const timeout = 30000; // 30 seconds
        const checkInterval = 1000; // Check every second
        
        const checkForResponse = setInterval(() => {
            if (Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                showPasscodeStatus('Failed to verify passcode. Please try again.', 'error');
                return;
            }
            
            // In a real implementation, you would use Webhooks or a backend service
            // to receive messages from Telegram. This is a simplified simulation.
            
            // For demo purposes, we'll simulate a response after 3 seconds
            if (Date.now() - startTime > 3000) {
                clearInterval(checkInterval);
                
                // Simulate approved response (in real app, this would come from Telegram)
                const randomApproved = Math.random() > 0.3; // 70% chance of approval for demo
                
                if (randomApproved) {
                    showPasscodeStatus('Passcode approved!', 'success');
                    setTimeout(() => {
                        passcodeModal.style.display = 'none';
                        document.querySelector('.dashboard-container').style.display = 'none';
                        panelPage.style.display = 'block';
                    }, 1500);
                } else {
                    showPasscodeStatus('Incorrect passcode. Please get a valid passcode from the Telegram bot.', 'error');
                }
            }
        }, checkInterval);
    }
    
    // Show passcode status message
    function showPasscodeStatus(message, type) {
        passcodeStatus.textContent = message;
        passcodeStatus.className = 'status-message';
        
        switch (type) {
            case 'success':
                passcodeStatus.classList.add('success-message');
                break;
            case 'error':
                passcodeStatus.classList.add('error-message');
                break;
            case 'warning':
                passcodeStatus.classList.add('warning-message');
                break;
            default:
                passcodeStatus.classList.add('info-message');
        }
    }
    
    // Start deployment process
    startDeployBtn.addEventListener('click', function() {
        startDeployBtn.disabled = true;
        startDeployProcess();
    });
    
    // Start deployment process with console output
    function startDeployProcess() {
        addConsoleLine('Initializing Big Daddy V2 deployment...');
        
        setTimeout(() => {
            addConsoleLine('Getting ready...', 'info');
            
            setTimeout(() => {
                addConsoleLine('Connecting to Big Daddy V2 servers...', 'info');
                
                setTimeout(() => {
                    addConsoleLine('Successfully connected to mainframe', 'success');
                    
                    setTimeout(() => {
                        addConsoleLine('Downloading package.json...', 'info');
                        
                        setTimeout(() => {
                            addConsoleLine('Package downloaded successfully', 'success');
                            
                            setTimeout(() => {
                                addConsoleLine('Preparing deployment environment...', 'info');
                                
                                setTimeout(() => {
                                    addConsoleLine('Deploying resources...', 'info');
                                    
                                    setTimeout(() => {
                                        addConsoleLine('Deployment complete!', 'success');
                                        
                                        setTimeout(() => {
                                            addConsoleLine('Please enter your WhatsApp number to pair the bot', 'info');
                                            phoneInputSection.style.display = 'block';
                                        }, 1000);
                                    }, 2000);
                                }, 2000);
                            }, 1500);
                        }, 1500);
                    }, 1500);
                }, 1500);
            }, 1000);
        }, 500);
    }
    
    // Submit WhatsApp number
    submitNumberBtn.addEventListener('click', function() {
        const phoneNumber = whatsappNumberInput.value.trim();
        
        if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
            addConsoleLine('Please enter a valid WhatsApp number with country code (digits only)', 'error');
            return;
        }
        
        addConsoleLine(`Pairing with WhatsApp number: ${phoneNumber}`, 'info');
        pairWhatsAppNumber(phoneNumber);
    });
    
    // Pair WhatsApp number with Telegram bot
    function pairWhatsAppNumber(phoneNumber) {
        // Send pair command to Telegram bot
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const data = {
            chat_id: groupId,
            text: `/pair ${phoneNumber}`
        };
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // Simulate getting pairing code (in real app, this would come from Telegram)
                const pairingCode = `DRAY-${Math.floor(1000 + Math.random() * 9000)}`;
                
                // Show pairing code
                pairingCodeText.textContent = pairingCode;
                pairingCodeSection.style.display = 'block';
                
                // Listen for bot activation message
                listenForActivation(phoneNumber);
            } else {
                addConsoleLine('Failed to initiate pairing', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addConsoleLine('Connection error', 'error');
        });
    }
    
    // Listen for bot activation
    function listenForActivation(phoneNumber) {
        // In a real implementation, you would use Webhooks or a backend service
        // to receive messages from Telegram. This is a simplified simulation.
        
        setTimeout(() => {
            // Simulate successful activation
            const randomSuccess = Math.random() > 0.2; // 80% chance of success for demo
            
            if (randomSuccess) {
                addConsoleLine('╭⭑━━━➤ PHISTAR BOT INC', 'info');
                addConsoleLine('┣ ◁️ Connected successfully to', 'info');
                addConsoleLine(`┣ ◁️ ${phoneNumber}`, 'info');
                addConsoleLine('╰━━━━━━━━━━━━━━━━━━━╯', 'info');
                addConsoleLine('Your bot is now live on your WhatsApp!', 'success');
                
                // Show stop button
                stopBotBtn.style.display = 'block';
                stopBotBtn.onclick = () => stopBot(phoneNumber);
            } else {
                // Simulate already connected
                addConsoleLine(`⚠️ ${phoneNumber} is already connected to Big Daddy V1mini. Use /delpair to disconnect first!`, 'error');
            }
        }, 3000);
    }
    
    // Stop bot
    function stopBot(phoneNumber) {
        addConsoleLine('Stopping bot...', 'info');
        
        // Send delpair command to Telegram bot
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const data = {
            chat_id: groupId,
            text: `/delpair ${phoneNumber}`
        };
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // Simulate successful stop (in real app, this would come from Telegram)
                setTimeout(() => {
                    const randomSuccess = Math.random() > 0.2; // 80% chance of success for demo
                    
                    if (randomSuccess) {
                        addConsoleLine(`✅ Deleted PhistarBotInc session for ${phoneNumber}`, 'success');
                        addConsoleLine('Bot successfully stopped', 'info');
                        stopBotBtn.style.display = 'none';
                    } else {
                        addConsoleLine(`⚠️ No session found for ${phoneNumber}`, 'error');
                        addConsoleLine('Failed to stop: bot is not active on this number', 'error');
                    }
                }, 2000);
            } else {
                addConsoleLine('Failed to initiate stop command', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addConsoleLine('Connection error', 'error');
        });
    }
    
    // Copy pairing code
    copyCodeBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(pairingCodeText.textContent)
            .then(() => {
                const originalText = copyCodeBtn.textContent;
                copyCodeBtn.textContent = 'COPIED!';
                setTimeout(() => {
                    copyCodeBtn.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    });
    
    // Add line to console
    function addConsoleLine(text, type = '') {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = text;
        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
    
    // Initialize console with some info
    addConsoleLine('Big Daddy V2 Deployment Console', 'info');
    addConsoleLine('--------------------------------', 'info');
});
