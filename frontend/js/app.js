const API_BASE = "http://localhost:8000/api/";

function redirect_add(){
    window.location.href = "/register.html";
};

function redirect_index(){
    window.location.href = "/index.html";
};

function redirect_book(id){
    window.location.href = `book.html?id=${id}`;
};

function addBook() {
    fetch( API_BASE + 'books/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: document.getElementById("title").value,
            author: document.getElementById("author").value,
            published_year: document.getElementById("published_year").value,
        })
    }).then(async res => {
        const data = await res.json();
        if (res.ok) {
            redirect_index();
        } else {

            let errorText = "";
            Object.entries(data).forEach(([field, messages]) => {
                
                if (!Array.isArray(messages)) {
                    messages = [messages];
                }

                messages.forEach(msg => {
                    errorText += `${field} - ${msg}\n`;
                });
            });

            alert(errorText);
            
        }
    });
}


function getBooks(){
  fetch(API_BASE + 'books/', {
    method: 'GET',
  })
  .then(res => {
      return res.json();
  })
  .then(data => {
    let html = "";

    data.forEach(book => {
      html += `
        <div class="user-item" onclick="redirect_book(${book.id})" style="cursor:pointer;">
          <strong>Title: ${book.title}</strong><br>
          Author: ${book.author}<br>
          Year: ${book.published_year}
        </div>
      `;
    });

    document.getElementById("books-list").innerHTML = html;
  });
}

function showBook(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch(API_BASE + 'books/' + id + '/')
  .then(res => res.json())
  .then(book => {
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("published_year").value = book.published_year;

    document.getElementById("update-btn").onclick = () => updateBook(book.id);
    document.getElementById("delete-btn").onclick = () => deleteBook(book.id);
  });
}

function deleteBook(id){
  if (!confirm("Delete the book?")) return;

  fetch(API_BASE + 'books/' + id + '/', {
    method: 'DELETE'
  })
  .then(res => {
    if (res.status === 204) {
      alert("Deleted!");
      redirect_index(); // odśwież listę
    } else {
      alert("Error");
    }
  });
}


function updateBook(id) {
    fetch(API_BASE + 'books/' + id + '/', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: document.getElementById("title").value,
            author: document.getElementById("author").value,
            published_year: document.getElementById("published_year").value,
        })
    }).then(async res => {
        const data = await res.json();
        if (res.ok) {
            redirect_index();
        } else {

            let errorText = "";
            Object.entries(data).forEach(([field, messages]) => {
                
                if (!Array.isArray(messages)) {
                    messages = [messages];
                }

                messages.forEach(msg => {
                    errorText += `${field} - ${msg}\n`;
                });
            });

            alert(errorText);
            
        }
    });
}


function getBook(){
  const title = document.getElementById("title").value

  fetch(API_BASE + 'books/?search=' + encodeURIComponent(title), {
    method: 'GET',
  })
  .then(res => {
      return res.json();
  })
  .then(data => {
    let html = "";

    data.forEach(book => {
      html += `
        <div class="user-item" onclick="redirect_book(${book.id})" style="cursor:pointer;">
          <strong>Title: ${book.title}</strong><br>
          Author: ${book.author}<br>
          Year: ${book.published_year}
        </div>
      `;
    });

    document.getElementById("search-list").innerHTML = html;
  });
}