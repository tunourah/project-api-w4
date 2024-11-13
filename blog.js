const publishButton = document.getElementById("btn-publish");
const titleInput = document.getElementById("title-input");
const contentInput = document.getElementById("content-input");
const messageContainer = document.getElementById("message-container");
const imageInput = document.getElementById("file-input");
function resizeImage(file, maxWidth, maxHeight, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = function (event) {
    const img = new Image();
    img.src = event.target.result;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const resizedImage = canvas.toDataURL("image/jpeg", 0.7); // Adjust quality (0.7 for 70%)
      callback(resizedImage);
    };
  };
}

publishButton.addEventListener("click", function () {
  messageContainer.innerHTML = "";

  if (!titleInput.value.trim()) {
    showMessage("Title is required", "text-danger");
  } else if (!contentInput.value.trim()) {
    showMessage("Content is required", "text-danger");
  } else if (!imageInput.files[0]) {
    showMessage("Image is required", "text-danger");
  } else {
    const file = imageInput.files[0];

    resizeImage(file, 800, 800, function (resizedImage) {
      // Retrieve the user ID from localStorage
      const userId = localStorage.getItem("userId");

      // Include the user ID in the blog post data
      fetch("https://6735242a5995834c8a920079.mockapi.io/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId, // Add userId to the blog post data
          title: titleInput.value,
          content: contentInput.value,
          image: resizedImage,
        }),
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
          fetchPosts();
        })
        .catch((error) => {
          showMessage("There was a problem with the fetch operation.", "text-danger");
          console.error("Fetch error:", error);
        });
    });
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

  fetch("https://6735242a5995834c8a920079.mockapi.io/blog")
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
              `https://6735242a5995834c8a920079.mockapi.io/blog/${blog.id}`,
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
