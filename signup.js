document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const termsCheckbox = document.getElementById("terms");
  
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const termsError = document.getElementById("termsError");
  
    const apiUrl = "https://6735242a5995834c8a920079.mockapi.io/blog";
  
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
     
      nameError.textContent = "";
      emailError.textContent = "";
      passwordError.textContent = "";
      confirmPasswordError.textContent = "";
      termsError.textContent = "";
  
     
      let valid = true;
  
      if (!nameInput.value.trim() || nameInput.value.trim().length < 5) {
          
        nameError.textContent = "Full name is required and must be at least 5 characters long";
        valid = false;
      }
  
      if (!emailInput.value.trim()) {
        emailError.textContent = "Email is required";
        valid = false;
      } else if (!isValidEmail(emailInput.value)) {
        emailError.textContent = "Invalid email format";
        valid = false;
      }
  
      if (!passwordInput.value.trim()) {
        passwordError.textContent = "Password is required";
        valid = false;
      } else if (passwordInput.value.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters long";
        valid = false;
      }
  
      if (!confirmPasswordInput.value.trim()) {
        confirmPasswordError.textContent = "Please confirm your password";
        valid = false;
      } else if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordError.textContent = "Passwords do not match";
        valid = false;
      }
  
      if (!termsCheckbox.checked) {
        termsError.textContent = "You must agree to the terms and conditions";
        valid = false;
      }
  
      if (valid) {
       
        fetch(apiUrl, {
          method: "POST",
          body: JSON.stringify({
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok.");
            return response.json();
          })
          .then((data) => {
           
            console.log("API Response:", data);
  
           
            localStorage.setItem("userName", data.name);
            localStorage.setItem("userId", data.id);
  
            
            console.log("Redirecting to home.html");
            window.location.href = "login.html";
          })
          .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
          });
      }
    });
  
    function isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
  });
  