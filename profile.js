const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const logout = document.getElementById("button-logout");
const messageContainer = document.getElementById("message-container");

function fetchUserData() {
  // Check if userId is stored in sessionStorage
  const userId = sessionStorage.getItem("userId");
  
  if (!userId) {
    // Redirect to the login page if no user is logged in
    window.location.href = "index.html";
    return;
  }

  fetch(`https://6735242a5995834c8a920079.mockapi.io/blog/${userId}`)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok.");
      return response.json();
    })
    .then((user) => {
      if (user.name && user.email) {
        userName.textContent = "Name: " + user.name;
        userEmail.textContent = "Email: " + user.email;
        logout.textContent = "Logout";
        logout.classList.add(
          "btn",
          "btn-dark",
          "btn-md",
          "mt-3",
          "px-4",
          "py-2",
          "shadow-lg",
          "rounded-pill",
          "btn-logout"
        );

        logout.addEventListener("click", function () {
          sessionStorage.removeItem("userId");
          window.location.href = "index.html";
        });
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function showMessage(message, className) {
  const p = document.createElement("p");
  p.textContent = message;
  p.className = className;
  messageContainer.appendChild(p);
}

function fetchPosts() {
  const userId = sessionStorage.getItem("userId"); // Retrieve userId from sessionStorage
  let container = document.getElementById("container");

  fetch("https://6735242a5995834c8a920079.mockapi.io/blog")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok.");
      return response.json();
    })
    .then((data) => {
      container.innerHTML = ""; // Clear previous posts

      // Filter blogs to display only those created by the logged-in user
      const userBlogs = data.filter((blog) => blog.userId === userId);

      if (userBlogs.length === 0) {
        showMessage("No blog posts found for this user", "text-warning");
        return;
      }

      userBlogs.forEach((blog) => {
        if (blog.title || blog.content) {
          let card = document.createElement("div");
          let cardBody = document.createElement("div");
          let title = document.createElement("h2");
          let content = document.createElement("p");
          let deleteButton = document.createElement("button");
          let image = document.createElement("img");

          card.classList.add("card", "mb-3", "w-25", "text-center");
          cardBody.classList.add("card-body");
          title.classList.add("card-title");
          content.classList.add("card-text");
          deleteButton.classList.add("btn", "btn-danger");
          deleteButton.textContent = "Delete";

          // Check if the blog has an image
          if (blog.image) {
            image.src = blog.image;
            image.classList.add("card-img-top");
            image.alt = "Image";
            card.appendChild(image);
          }

          title.textContent = blog.title;
          content.textContent = blog.content;

          cardBody.appendChild(title);
          cardBody.appendChild(content);
          cardBody.appendChild(deleteButton);
          card.appendChild(cardBody);
          container.appendChild(card);

          deleteButton.addEventListener("click", function () {
            fetch(`https://6735242a5995834c8a920079.mockapi.io/blog/${blog.id}`, {
              method: "DELETE",
            })
              .then((response) => {
                if (!response.ok) throw new Error("Network response was not ok.");
                return response.json();
              })
              .then(() => {
                showMessage("Blog post deleted successfully", "text-success");
                fetchPosts(); // Refresh posts after a successful delete
              })
              .catch((error) => {
                showMessage("There was a problem with the fetch operation.", "text-danger");
                console.error("There was a problem with the fetch operation:", error);
              });
          });
        }
      });
    })
    .catch((error) => {
      showMessage("There was a problem with the fetch operation.", "text-danger");
      console.error("There was a problem with the fetch operation:", error);
    });
}


// Call the function to fetch user data
fetchUserData();
fetchPosts();
