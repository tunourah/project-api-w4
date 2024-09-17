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
           
            fetch('https://66e7e6b3b17821a9d9da6ff8.mockapi.io/login')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok.');
                return response.json();
            })
            .then(users => {
                
                const user = users.find(user => 
                    user.email === emailInput.value && user.password === passwordInput.value
                );

                if (user) {
                   
                    sessionStorage.setItem('userId', user.id);
                    window.location.href = 'blog.html';
                } else {
                     
                    passwordError.textContent = 'Invalid email or password';
                }
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
