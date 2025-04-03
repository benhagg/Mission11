import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Book from "./Book";
import type BookType from "./types/Book";

interface BookstoreProps {
  cart: { book: BookType; quantity: number }[];
  setCart: React.Dispatch<
    React.SetStateAction<{ book: BookType; quantity: number }[]>
  >;
}

const Bookstore: React.FC<BookstoreProps> = ({ cart, setCart }) => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [displayNum, setDisplayNum] = useState(5);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(true);
  const [category, setCategory] = useState("");
  const [newBook, setNewBook] = useState<BookType>({
    bookId: 0,
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    classification: "",
    category: "",
    pageCount: 0,
    price: 0,
  });

  const navigate = useNavigate();

  // LOAD ALL BOOKS ON PAGE LOAD (and other dependencies)
  useEffect(() => {
    fetch(
      `https://mission13-h5dcdpe0b6abb0ab.eastus-01.azurewebsites.net/Bookstore/books?page=${page}&displayNum=${displayNum}&sort=${sort}&category=${category}`
    )
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, [page, displayNum, sort, category]);

  // ADD A NEW BOOK
  const handleAddBook = (editedBook: BookType) => {
    fetch(
      "https://mission13-h5dcdpe0b6abb0ab.eastus-01.azurewebsites.net/Bookstore/books",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedBook),
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Book added successfully");
        } else {
          console.error("Error adding book");
        }
      })
      .catch((error) => console.error("Error adding book:", error));
    // reload the page to reset modal state and show updated changes
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="cart-summary mb-4 p-3 border rounded shadow-sm bg-light">
        <h5 className="text-center mb-3">Cart Summary</h5>
        <ul className="list-group mb-3">
          {cart.map((item) => (
            <li
              key={item.book.bookId}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{item.book.title}</span>
              <span>Quantity: {item.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="text-center">
          <p className="mb-1">
            <strong>Total Items:</strong>{" "}
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </p>
          <p className="mb-0">
            <strong>Total Price:</strong> $
            {cart
              .reduce(
                (total, item) => total + item.quantity * item.book.price,
                0
              )
              .toFixed(2)}
          </p>
        </div>
      </div>
      <div className="mb-3 d-flex align-items-center justify-content-center gap-3">
        <div className="d-flex flex-column align-items-center">
          <label htmlFor="display-num" className="form-label">
            Display Number
          </label>
          <input
            id="display-num"
            type="number"
            className="form-control w-auto"
            value={displayNum}
            onChange={(e) => setDisplayNum(Number(e.target.value))}
          />
        </div>
        <div className="d-flex flex-column align-items-center">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            className="form-select w-auto"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="Historical">Historical</option>
            <option value="Thrillers">Thrillers</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Biography">Biography</option>
            <option value="Action">Action</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Christian Books">Christian Books</option>
          </select>
        </div>
      </div>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={() => setSort(!sort)}>
          Sort
        </button>
        <button
          className="btn btn-success ms-3"
          onClick={() => navigate("/cart")}
        >
          View Cart ({cart.length} items)
        </button>
        <button
          className="btn btn-warning ms-3"
          onClick={() => navigate("/admin")}
        >
          Admin Panel
        </button>
      </div>
      <div className="row">
        {books.map((book: BookType) => (
          <div className="col-md-4 mb-3" key={book.bookId}>
            <Book book={book} cart={cart} setCart={setCart} />
          </div>
        ))}
      </div>
      <div id="pagination" className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={() => page > 1 && setPage(page - 1)}
        >
          Previous
        </button>
        <button className="btn btn-secondary" onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Bookstore;
