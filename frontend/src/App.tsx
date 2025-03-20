import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
// import components
import Book from "./Book.tsx";

function App() {
  const [books, setBooks] = useState([]);
  const [displayNum, setDisplayNum] = useState(5);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(true);

  useEffect(() => {
    fetch(
      `http://localhost:5000/Bookstore/books?page=${page}&displayNum=${displayNum}&sort=${sort}`
    )
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, [page, displayNum, sort]);

  return (
    <div className="container">
      <div className="mb-3">
        <label htmlFor="display-num" className="form-label">
          Display Number
        </label>
        <input
          id="display-num"
          type="number"
          className="form-control"
          value={displayNum}
          onChange={(e) => setDisplayNum(Number(e.target.value))}
        />
      </div>
      <div className="mb-3">
        <button
          id="sort-btn"
          className="btn btn-primary"
          onClick={() => {
            setSort(!sort);
          }}
        >
          Sort
        </button>
      </div>
      <div className="row">
        {books.map((book: Book) => (
          <div className="col-md-4 mb-3" key={book.bookId}>
            <Book book={book} />
          </div>
        ))}
      </div>
      <div id="pagination" className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (page > 1) {
              setPage(page - 1);
            }
          }}
        >
          Previous
        </button>
        <button className="btn btn-secondary" onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
