
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const logout = document.getElementById("button-logout");

fetch("https://66e7e6b3b17821a9d9da6ff8.mockapi.io/login")
    .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok.");
        return response.json();
    })
    .then((data) => {
        data.forEach((user) => {
        if (user.name && user.email) {
            userName.textContent = " Name :"+ user.name;
            userEmail.textContent = " Emai : "+ user.email;
            logout.textContent = "Logout";
            logout.classList.add(
                "btn", 
                "btn-dark", 
                "btn-md", 
                "mt-3", 
                "px-4",         
                "py-2",       
                "shadow-lg",    
                "rounded-pill" 
            ,"btn-logout"
            );
            

            logout.addEventListener("click", function () {
                sessionStorage.removeItem("userId");
                window.location.href = "index.html";
            })

        }
        });
    })
    .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
    });