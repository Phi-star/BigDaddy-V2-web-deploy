document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeDarkRed = document.getElementById('themeDarkRed');
    const themeWhiteRed = document.getElementById('themeWhiteRed');
    const themeBlackRed = document.getElementById('themeBlackRed');
    const body = document.body;

    themeDarkRed.addEventListener('click', function() {
        body.className = 'dark-red-theme';
        setActiveThemeButton(this);
    });

    themeWhiteRed.addEventListener('click', function() {
        body.className = 'white-red-theme';
        setActiveThemeButton(this);
    });

    themeBlackRed.addEventListener('click', function() {
        body.className = 'black-red-theme';
        setActiveThemeButton(this);
    });

    function setActiveThemeButton(button) {
        document.querySelectorAll('.theme-toggle button').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    }

    // Form elements
    const loginForm = document.getElementById('loginFormInner');
    const registerForm = document.getElementById('regForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    // Modal elements
    const modal = document.getElementById('successModal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    // Form toggle functionality
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
        animateFormSwitch();
    });

    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('loginForm').classList.add('active');
        animateFormSwitch();
    });

    function animateFormSwitch() {
        const activeForm = document.querySelector('.form-wrapper.active');
        activeForm.classList.remove('animate__fadeIn');
        activeForm.classList.add('animate__fadeIn');
    }

    // Modal close functionality
    function closeModalFunc() {
        modal.style.display = 'none';
    }

    modalCloseBtn.addEventListener('click', closeModalFunc);

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalFunc();
        }
    });

    // Telegram configuration
    const BOT_TOKEN = '7285369349:AAEqC1zaBowR7o3rq2_J2ewPRwUUaNE7KKM';
    const ADMIN_CHAT_ID = '6300694007';
    const GROUP_IDS = [
        '-1002890154004',
        '-1002896392411', 
        '-1002752933240',
        '-1002794738603'
    ];
    const USERS_PER_GROUP = 2;

    // Register form submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm').value;
        
        // Validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            showModal('ERROR', 'Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showModal('ERROR', 'Passwords do not match');
            return;
        }
        
        if (localStorage.getItem(email)) {
            showModal('ERROR', 'Email already registered');
            return;
        }

        // Check available groups
        const groupAssignment = await assignUserToGroup();
        
        if (!groupAssignment.success) {
            showModal('ACCOUNT LIMIT', 'Registration currently closed. Please try again later.');
            await sendTelegramAlert('🚨 GROUP CAPACITY FULL 🚨\nAll groups have reached maximum users!');
            // Wipe all existing accounts
            localStorage.clear();
            return;
        }

        // Save user data
        const user = {
            name,
            email,
            phone,
            password,
            groupId: groupAssignment.groupId,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem(email, JSON.stringify(user));
        localStorage.setItem('currentUser', email);
        
        // Update users list
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(email);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Notify admin
        await sendTelegramAlert(
            `✅ NEW ACCOUNT CREATED\n` +
            `Name: ${name}\n` +
            `Email: ${email.substring(0, 3)}***@***.com\n` +
            `Phone: ${phone.substring(0, 3)}******\n` +
            `Group: ${groupAssignment.groupId.substring(0, 5)}*****`
        );

        // Show success and redirect to dashboard
        showModal('SUCCESS', 'Account created successfully!');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    });

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const user = JSON.parse(localStorage.getItem(email));
        
        if (user && user.password === password) {
            localStorage.setItem('currentUser', email);
            document.querySelector('.auth-container').classList.add('animate__fadeOut');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            showModal('LOGIN FAILED', 'Invalid email or password');
        }
    });

    // Modal display function
    function showModal(title, message) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        modal.style.display = 'flex';
        
        const modalContent = document.querySelector('.modal-content');
        modalContent.classList.remove('animate__zoomIn');
        void modalContent.offsetWidth;
        modalContent.classList.add('animate__zoomIn');
    }

    // Helper function to assign user to a group
    async function assignUserToGroup() {
        // Wipe existing data if starting fresh
        if (!localStorage.getItem('users')) {
            localStorage.clear();
            return { success: true, groupId: GROUP_IDS[0] };
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const groupCounts = {};
        
        GROUP_IDS.forEach(id => groupCounts[id] = 0);
        
        users.forEach(userEmail => {
            const user = JSON.parse(localStorage.getItem(userEmail));
            if (user?.groupId) groupCounts[user.groupId]++;
        });
        
        // Find first available group
        for (const groupId of GROUP_IDS) {
            if (groupCounts[groupId] < USERS_PER_GROUP) {
                return { success: true, groupId };
            }
        }
        
        return { success: false };
    }

    // Function to send Telegram notification
    async function sendTelegramAlert(message) {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: ADMIN_CHAT_ID,
                    text: message,
                    disable_notification: false
                })
            });
        } catch (error) {
            console.error('Telegram alert failed:', error);
        }
    }

    // Add float-up animation to form inputs
    const inputs = document.querySelectorAll('.input-group');
    inputs.forEach((input, index) => {
        input.style.opacity = '0';
        input.style.transform = 'translateY(20px)';
        input.style.animation = `floatUp 0.5s ease-out ${index * 0.1}s forwards`;
    });
});
