import React, { useEffect, useState } from "react";
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
  const [editedBook, setEditedBook] = useState<BookType>(book);

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
    navigate("/cart");
  };

  const handleEdit = () => {
    fetch(`http://localhost:5000/Bookstore/books/${editedBook.bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedBook),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Book updated successfully");
        } else {
          console.error("Error updating book");
        }
      })
      .catch((error) => console.error("Error updating book:", error));
    // reload the page to reset modal state and show updated changes
    window.location.reload();
  };

  const handleDelete = () => {
    fetch(`http://localhost:5000/Bookstore/books/${book.bookId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Book deleted successfully");
        } else {
          console.error("Error deleting book");
        }
      })
      .catch((error) => console.error("Error deleting book:", error));
    // reload the page to reset modal state and show updated changes
    window.location.reload();
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
          <strong>Price:</strong> ${book.price}
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => addToCart(book)}>Add To Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Book;
