document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

       
        emailError.textContent = '';
        passwordError.textContent = '';

         
        if (!emailInput.value.trim()) {
            emailError.textContent = 'Email is required';
        } else if (!isValidEmail(emailInput.value)) {
            emailError.textContent = 'Invalid email format';
        }
        if (!passwordInput.value.trim()) {
            passwordError.textContent = 'Password is required';
        }

        if (!emailError.textContent && !passwordError.textContent) {
            fetch('https://66e7e6b3b17821a9d9da6ff8.mockapi.io/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok.');
                return response.json();
            })
            .then(data => {
                
                const userId = data.id;
                
                
                sessionStorage.setItem('userId', userId);

            
                window.location.href = 'blog.html';
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }
    });

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});

 
