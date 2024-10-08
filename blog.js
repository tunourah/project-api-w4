const publishButton = document.getElementById("btn-publish");
const titleInput = document.getElementById("title-input");
const contentInput = document.getElementById("content-input");
const messageContainer = document.getElementById("message-container");
const imageInput = document.getElementById("file-input");

publishButton.addEventListener("click", function () {
  // Clear previous messages
  messageContainer.innerHTML = "";

  if (!titleInput.value.trim()) {
    showMessage("Title is required", "text-danger");
  } else if (!contentInput.value.trim()) {
    showMessage("Content is required", "text-danger");
  } else if (!imageInput.files[0]) {
    showMessage("Image is required", "text-danger");
  } else {
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
      const base64Image = reader.result;

      fetch("https://66e7e6b3b17821a9d9da6ff8.mockapi.io/login", {
        method: "POST",
        body: JSON.stringify({
          title: titleInput.value,
          content: contentInput.value,
          image: base64Image,
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
          showMessage("Blog post created successfully", "text-success");
          titleInput.value = "";
          contentInput.value = "";
          imageInput.value = "";
          fetchPosts(); // Refresh posts after a successful publish
        })
        .catch((error) => {
          showMessage("There was a problem with the fetch operation.", "text-danger");
          console.error("There was a problem with the fetch operation:", error);
        });
    };

    reader.readAsDataURL(file); // Converts file to base64 string
  }
});

function showMessage(message, className) {
  const p = document.createElement("p");
  p.textContent = message;
  p.className = className;
  messageContainer.appendChild(p);
}

function fetchPosts() {
  let container = document.getElementById("container");

  fetch("https://66e7e6b3b17821a9d9da6ff8.mockapi.io/login")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok.");
      return response.json();
    })
    .then((data) => {
      container.innerHTML = ""; // Clear previous posts
      data.forEach((blog) => {
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

          image.src = blog.image; // Set the image source
          image.classList.add("card-img-top");
          image.alt = "Image";
          card.appendChild(image);

          title.textContent = blog.title;
          content.textContent = blog.content;

          cardBody.appendChild(title);
          cardBody.appendChild(content);
          cardBody.appendChild(deleteButton);
          card.appendChild(cardBody);
          container.appendChild(card);

          deleteButton.addEventListener("click", function () {
            fetch(
              `https://66e7e6b3b17821a9d9da6ff8.mockapi.io/login/${blog.id}`,
              {
                method: "DELETE",
              }
            )
              .then((response) => {
                if (!response.ok) throw new Error("Network response was not ok.");
                return response.json();
              })
              .then((data) => {
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
