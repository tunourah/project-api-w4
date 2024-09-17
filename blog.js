const puplish = document.getElementById('btn-puplish');
console.log(puplish);

const title = document.getElementById('title-input');
const content = document.getElementById('content-input');

puplish.addEventListener('click', function() {
    console.log("hhh");
    
    if (!title.value.trim()) {
        alert('Title is required');
    } else if (!content.value.trim()) {
        alert('Content is required');
    } else {
        fetch('https://66e7e6b3b17821a9d9da6ff8.mockapi.io/login', {
            method: 'POST',
            body: JSON.stringify({
                title: title.value,
                content: content.value
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
            alert('Blog post created successfully');
            title.value = '';
            content.value = '';

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
}
);

let container = document.getElementById("container");

fetch("https://66e7e6b3b17821a9d9da6ff8.mockapi.io/login")
    .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok.");
        return response.json();
    })
    .then((data) => {
        data.forEach((blog) => {
             
            if (blog.title || blog.content) {
                container.classList.add('d-flex', 'flex-wrap', 'gap-3' , 'justify-content-center');
                let card = document.createElement("div");
                let cardBody = document.createElement("div");
                let title = document.createElement("h2");
                let content = document.createElement("p");
    let deleteButton = document.createElement("button");
                
    card.classList.add("card", "mb-3", "w-25" ,"text-center"  ); 
                cardBody.classList.add("card-body");
                title.classList.add("card-title");
                content.classList.add("card-text");
                deleteButton.classList.add("btn", "btn-danger");
                deleteButton.textContent = "Delete";

    
                title.textContent = blog.title;
                content.textContent = blog.content;
    
                 
                cardBody.appendChild(title);
                cardBody.appendChild(content);
                cardBody.appendChild(deleteButton);
                
                card.appendChild(cardBody);
    
                
                container.appendChild(card);
                deleteButton.addEventListener("click", function() {
                    fetch(`https://66e7e6b3b17821a9d9da6ff8.mockapi.io/login/${blog.id}`, {
                        method: "DELETE"
                    })
                    .then(response => {
                        if (!response.ok) throw new Error("Network response was not ok.");
                        return response.json();
                    })
                    .then(data => {
                        alert("Blog post deleted successfully");
                        card.remove();
                    })
                    .catch(error => {
                        console.error("There was a problem with the fetch operation:", error);
                    });
                } );
            }
        });
    })
    
    
    .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
    });