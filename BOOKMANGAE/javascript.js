async function addBook() {
    const bookId = document.getElementById('bookId').value;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const type = document.getElementById('type').value;

    if (!bookId || !title || !author || !type) {
        alert("Please fill out all fields.");
        return;
    }

    const data = {
        bookId: bookId,
        title: title,
        author: author,
        type: type
    };

    let url = '/add_book';
    let method = 'POST';

    if (editingRow) {
        url = '/edit_book';
        method = 'PUT';
        data.bookId = editingRow.cells[0].innerText;  // Using existing book ID for editing
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        if (editingRow) {
            // Update the row on success
            editingRow.cells[0].innerText = bookId;
            editingRow.cells[1].innerText = title;
            editingRow.cells[2].innerText = author;
            editingRow.cells[3].innerText = type;
            editingRow = null;
            document.querySelector('.btn-add').innerText = "Add Book";
        } else {
            // Insert a new row
            const bookTable = document.getElementById('bookTable').getElementsByTagName('tbody')[0];
            const newRow = bookTable.insertRow();
            newRow.insertCell(0).innerText = bookId;
            newRow.insertCell(1).innerText = title;
            newRow.insertCell(2).innerText = author;
            newRow.insertCell(3).innerText = type;

            const actionsCell = newRow.insertCell(4);
            const editButton = document.createElement('button');
            editButton.className = 'btn-edit';
            editButton.innerText = 'Edit';
            editButton.onclick = () => editBook(newRow);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn-delete';
            deleteButton.innerText = 'Delete';
            deleteButton.onclick = () => deleteBook(newRow);

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        }

        clearForm();
    } else {
        alert("Error with the operation.");
    }
}

async function deleteBook(row) {
    const bookId = row.cells[0].innerText;

    if (confirm("Are you sure you want to delete this book?")) {
        const response = await fetch('/delete_book', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookId: bookId })
        });

        if (response.ok) {
            row.remove();
        } else {
            alert("Failed to delete the book.");
        }
    }
}

async function loadBooks() {
    const response = await fetch('/get_books');
    const books = await response.json();
    
    const bookTable = document.getElementById('bookTable').getElementsByTagName('tbody')[0];
    books.forEach(book => {
        const newRow = bookTable.insertRow();
        newRow.insertCell(0).innerText = book.book_id;
        newRow.insertCell(1).innerText = book.title;
        newRow.insertCell(2).innerText = book.author;
        newRow.insertCell(3).innerText = book.type;

        const actionsCell = newRow.insertCell(4);
        const editButton = document.createElement('button');
        editButton.className = 'btn-edit';
        editButton.innerText = 'Edit';
        editButton.onclick = () => editBook(newRow);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn-delete';
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => deleteBook(newRow);

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
    });
}

window.onload = loadBooks;
