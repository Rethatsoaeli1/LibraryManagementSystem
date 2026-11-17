
import { useState } from 'react';

function Books({ books, setBooks }) {
  const [editingBook, setEditingBook] = useState(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState('');

  // Refresh books from MySQL
  async function refreshBooks() {
    const token = localStorage.getItem('token');

    const response = await fetch(
      'http://localhost:5000/api/books',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to load books.');
    }

    const data = await response.json();
    setBooks(data);
  }

  // Add or update a book
  async function handleSubmit(e) {
    e.preventDefault();

    const bookData = {
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      isbn: isbn.trim(),
      quantity: Number(quantity)
    };

    if (
      !bookData.title ||
      !bookData.author ||
      !bookData.genre ||
      !bookData.isbn ||
      !Number.isInteger(bookData.quantity) ||
      bookData.quantity < 1
    ) {
      alert('Please enter valid book details.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        editingBook
          ? `http://localhost:5000/api/books/${editingBook.id}`
          : 'http://localhost:5000/api/books',
        {
          method: editingBook ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bookData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save book.');
      }

      await refreshBooks();

      alert(data.message || 'Book saved successfully!');

      setEditingBook(null);
      setTitle('');
      setAuthor('');
      setGenre('');
      setIsbn('');
      setQuantity('');

    } catch (error) {
      alert(error.message);
    }
  }

  // Edit a book
  function handleEdit(book) {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre || '');
    setIsbn(book.isbn || '');
    setQuantity(String(book.quantity));
  }

  // Delete a book
  async function deleteBook(id) {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          `http://localhost:5000/api/books/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete book.');
        }

        await refreshBooks();

        alert(data.message || 'Book deleted successfully!');

        if (editingBook && editingBook.id === id) {
          setEditingBook(null);
          setTitle('');
          setAuthor('');
          setGenre('');
          setIsbn('');
          setQuantity('');
        }

      } catch (error) {
        alert(error.message);
      }
    }
  }

  return (
    <div className="books-page">

      <div className="books-header">
        <h1>Book Management</h1>
        <p>Add, view and manage library books.</p>
      </div>

      <div className="book-form-container">
        <h2>Add New Book</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Book Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="form-group">
            <label>Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Enter book genre"
              required
            />
          </div>

          <div className="form-group">
            <label>ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="Enter ISBN"
              required
            />
          </div>

          <div className="form-group">
            <label>Initial Quantity</label>
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>

          <button type="submit" className="add-book-btn">
            {editingBook ? 'Update Book' : 'Add Book'}
          </button>

        </form>
      </div>

      <div className="books-table-container">
        <h2>Book List</h2>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="6">No books added yet.</td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.isbn}</td>
                  <td>{book.quantity}</td>

                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(book)}
                      className="edit-book-btn"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteBook(book.id)}
                      className="delete-book-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Books;
