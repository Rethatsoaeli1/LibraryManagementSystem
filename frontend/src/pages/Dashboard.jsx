
function Dashboard({ books, transactions, users }) {

  // Calculate available books
  const availableBooks = books.reduce(
    (total, book) => total + (Number(book.quantity) || 0),
    0
  );

  // Calculate borrowed books
  const borrowedBooks = transactions.reduce((total, transaction) => {
    const quantity = Number(transaction.quantity) || 0;

    if (transaction.action === 'Borrow') {
      return total + quantity;
    }

    if (transaction.action === 'Return') {
      return total - quantity;
    }

    return total;
  }, 0);

  // Calculate total books owned by the library
  const totalBooks = availableBooks + borrowedBooks;

  // Find books with low stock (less than 2 copies)
  const lowStockBooks = books.filter(
    book => Number(book.quantity) < 2
  );

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Ready to manage today's library activity.</p>
      </div>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="card-icon">📚</div>
          <h3>Total Books</h3>
          <h2>{totalBooks}</h2>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📖</div>
          <h3>Available Books</h3>
          <h2>{availableBooks}</h2>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🔄</div>
          <h3>Borrowed Books</h3>
          <h2>{borrowedBooks}</h2>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">👥</div>
          <h3>Registered Users</h3>
          <h2>{users.length}</h2>
        </div>

      </div>

      {/* Low Stock Alert */}
      <div className="low-stock-section">
        <h2>⚠️ Low Stock Alert</h2>

        {lowStockBooks.length > 0 ? (
          <div>
            <p>
              The following books have fewer than 2 copies available:
            </p>

            {lowStockBooks.map(book => (
              <div key={book.id} className="low-stock-item">
                <strong>{book.title}</strong>
                <span>Available quantity: {book.quantity}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>All books have sufficient stock.</p>
        )}
      </div>

    </div>
  );
}

export default Dashboard;
