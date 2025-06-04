document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginForm = document.getElementById('loginFormInner');
    const registerForm = document.getElementById('regForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    // Modal elements
    const modal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    // Form toggle functionality
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
    });

    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('loginForm').classList.add('active');
    });

    // Modal close functionality
    function closeModalFunc() {
        modal.style.display = 'none';
    }

    closeModal.addEventListener('click', closeModalFunc);
    modalCloseBtn.addEventListener('click', closeModalFunc);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalFunc();
        }
    });

    // Register form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm').value;
        
        // Validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            showModal('Error', 'Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showModal('Error', 'Passwords do not match');
            return;
        }
        
        if (localStorage.getItem(email)) {
            showModal('Error', 'Email already registered');
            return;
        }
        
        // Save user data
        const user = {
            name,
            email,
            phone,
            password,
            orders: []
        };
        
        localStorage.setItem(email, JSON.stringify(user));
        
        // Update users list
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(email);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success and switch to login
        showModal('Account Created', 'Your Big Daddy V2 account has been created successfully!');
        registerForm.reset();
        setTimeout(() => {
            closeModalFunc();
            document.getElementById('registerForm').classList.remove('active');
            document.getElementById('loginForm').classList.add('active');
        }, 2000);
    });

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const user = JSON.parse(localStorage.getItem(email));
        
        if (user && user.password === password) {
            localStorage.setItem('currentUser', email);
            window.location.href = 'dashboard.html';
        } else {
            showModal('Login Failed', 'Invalid email or password');
        }
    });

    // Modal display function
    function showModal(title, message) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        modal.style.display = 'flex';
    }
});
