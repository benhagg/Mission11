import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import type BookType from "./types/Book";
import { useNavigate } from "react-router-dom";

interface BookProps {
  book: BookType;
  cart: { book: BookType; quantity: number }[];
  setCart: React.Dispatch<
    React.SetStateAction<{ book: BookType; quantity: number }[]>
  >;
}

const Book: React.FC<BookProps> = ({ book, cart, setCart }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, [setCart]);

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book: BookType) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.book.bookId === book.bookId
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.book.bookId === book.bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { book, quantity: 1 }];
      }
    });

    navigate("/cart"); // Navigate to the Cart page
  };

  return (
    <div className="card mb-3" id={book.bookId.toString()}>
      <div className="card-body">
        <h2 className="card-title">{book.title}</h2>
        <p className="card-text">
          <strong>Author:</strong> {book.author}
        </p>
        <p className="card-text">
          <strong>Publisher:</strong> {book.publisher}
        </p>
        <p className="card-text">
          <strong>ISBN:</strong> {book.isbn}
        </p>
        <p className="card-text">
          <strong>Classification:</strong> {book.classification}
        </p>
        <p className="card-text">
          <strong>Category:</strong> {book.category}
        </p>
        <p className="card-text">
          <strong>Page Count:</strong> {book.pageCount}
        </p>
        <p className="card-text">
          <strong>Price:</strong> {book.price}
        </p>
        <button onClick={() => addToCart(book)}>Add To Cart</button>
      </div>
    </div>
  );
};

export default Book;
