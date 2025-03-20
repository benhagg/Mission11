import { useState, useEffect } from "react";
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
    <>
      <div>
        <label htmlFor="display-num">Display Number</label>
        <input
          id="display-num"
          type="number"
          value={displayNum}
          onChange={(e) => setDisplayNum(Number(e.target.value))}
        />
      </div>
      <div>
        <button
          id="sort-btn"
          onClick={() => {
            setSort(!sort);
          }}
        >
          Sort
        </button>
      </div>
      <div>
        {books.map((book: Book) => (
          <Book book={book} />
        ))}
      </div>
      <div id="pagination">
        <button
          onClick={() => {
            if (page > 1) {
              setPage(page - 1);
            }
          }}
        >
          Previous
        </button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </>
  );
}

export default App;
