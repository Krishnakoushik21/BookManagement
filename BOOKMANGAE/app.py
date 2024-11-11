from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# Database connection setup
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',  # Replace with your MySQL username
        password='password',  # Replace with your MySQL password
        database='library_db'  # Replace with your database name
    )

@app.route('/add_book', methods=['POST'])
def add_book():
    data = request.json
    book_id = data['bookId']
    title = data['title']
    author = data['author']
    type = data['type']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO books (book_id, title, author, type) VALUES (%s, %s, %s, %s)',
                   (book_id, title, author, type))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Book added successfully'}), 200

@app.route('/get_books', methods=['GET'])
def get_books():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM books')
    books = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify(books), 200

@app.route('/edit_book', methods=['PUT'])
def edit_book():
    data = request.json
    book_id = data['bookId']
    title = data['title']
    author = data['author']
    type = data['type']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE books SET title = %s, author = %s, type = %s WHERE book_id = %s',
                   (title, author, type, book_id))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Book updated successfully'}), 200

@app.route('/delete_book', methods=['DELETE'])
def delete_book():
    data = request.json
    book_id = data['bookId']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM books WHERE book_id = %s', (book_id,))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Book deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
