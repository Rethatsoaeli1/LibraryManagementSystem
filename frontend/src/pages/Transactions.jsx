
import { useState } from 'react';

function Transactions({ books, setBooks, transactions, setTransactions }) {

  const [bookId, setBookId] = useState('');
  const [action, setAction] = useState('Borrow');
  const [quantity, setQuantity] = useState('');

  const currentUser = JSON.parse(
    localStorage.getItem('currentUser') || 'null'
  );

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
      throw new Error('Failed to refresh books.');
    }

    const data = await response.json();
    setBooks(data);
  }

  // Refresh transaction history from MySQL
  async function refreshTransactions() {
    const token = localStorage.getItem('token');

    const response = await fetch(
      'http://localhost:5000/api/transactions',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to load transaction history.');
    }

    const data = await response.json();

    setTransactions(data.map(transaction => ({
      ...transaction,
      bookTitle: transaction.book_title || 'Deleted book',
      memberName: transaction.user_name || 'N/A',
      date: new Date(transaction.transaction_date).toLocaleDateString()
    })));
  }

  // Complete a transaction
  async function handleSubmit(e) {
    e.preventDefault();

    const selectedBook = books.find(
      book => String(book.id) === String(bookId)
    );

    const amount = Number(quantity);
    const availableQuantity = Number(selectedBook?.quantity) || 0;

    if (!selectedBook) {
      alert('Please select a book.');
      return;
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      alert('Please enter a valid whole-number quantity.');
      return;
    }

    if (!currentUser) {
      alert('Please log in before recording a transaction.');
      return;
    }

    // Calculate copies borrowed by the logged-in user
    const memberBorrowed = transactions
      .filter(transaction =>
        (transaction.bookTitle || transaction.book_title) === selectedBook.title &&
        (transaction.memberName || transaction.user_name) === currentUser.name &&
        transaction.action === 'Borrow'
      )
      .reduce((total, transaction) =>
        total + Number(transaction.quantity), 0
      );

    const memberReturned = transactions
      .filter(transaction =>
        (transaction.bookTitle || transaction.book_title) === selectedBook.title &&
        (transaction.memberName || transaction.user_name) === currentUser.name &&
        transaction.action === 'Return'
      )
      .reduce((total, transaction) =>
        total + Number(transaction.quantity), 0
      );

    const outstandingBorrowed = memberBorrowed - memberReturned;

    if (action === 'Borrow' && amount > availableQuantity) {
      alert('Not enough books available in stock.');
      return;
    }

    if (action === 'Return' && amount > outstandingBorrowed) {
      alert('You have not borrowed that many copies.');
      return;
    }

    if (action === 'Deduct Stock' && amount > availableQuantity) {
      alert('You cannot deduct more books than are available.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:5000/api/transactions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            book_id: selectedBook.id,
            user_id: currentUser.id,
            action,
            quantity: amount
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Transaction failed.');
      }

      await refreshBooks();
      await refreshTransactions();

      setBookId('');
      setAction('Borrow');
      setQuantity('');

      alert(data.message);

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="transactions-page">

      <div className="transactions-header">
        <h1>Transactions</h1>
        <p>Manage book stock, borrowing and returns.</p>
      </div>

      <div className="transaction-form-container">

        <h2>Record Transaction</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Select Book</label>

            <select
              value={bookId}
              onChange={e => setBookId(e.target.value)}
              required
            >
              <option value="">Choose a book</option>

              {books.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} (Available: {book.quantity})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Transaction Type</label>

            <select
              value={action}
              onChange={e => setAction(e.target.value)}
            >
              <option value="Borrow">Borrow Book</option>
              <option value="Return">Return Book</option>
              <option value="Add Stock">Add Stock</option>
              <option value="Deduct Stock">Deduct Stock</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity</label>

            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="form-group">
            <label>Recorded By</label>

            <input
              type="text"
              value={currentUser?.name || ''}
              readOnly
            />
          </div>

          <button type="submit" className="transaction-btn">
            Complete Transaction
          </button>

        </form>
      </div>

      <div className="transaction-history">

        <h2>Transaction History</h2>

        <div className="transaction-table">

          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Action</th>
                <th>Quantity</th>
                <th>Member</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.bookTitle || transaction.book_title}</td>
                    <td>{transaction.action}</td>
                    <td>{transaction.quantity}</td>
                    <td>{transaction.memberName || transaction.user_name || 'N/A'}</td>
                    <td>{transaction.date || new Date(transaction.transaction_date).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>
      </div>

    </div>
  );
}

export default Transactions;
