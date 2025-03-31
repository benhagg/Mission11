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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
          <button onClick={() => setShowEditModal(true)}>Edit</button>
          <button onClick={() => setShowDeleteModal(true)}>Delete</button>
        </div>
      </div>

      {showEditModal && (
        <div
          className="modal"
          style={{
            display: "block",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              margin: "10% auto",
              padding: "20px",
              border: "1px solid #888",
              width: "50%",
            }}
          >
            <h3>Edit Book</h3>
            {Object.keys(book).map(
              (key) =>
                key !== "bookId" && (
                  <div key={key}>
                    <label>{key}:</label>
                    <input
                      type="text"
                      value={(editedBook as any)[key]}
                      onChange={(e) =>
                        setEditedBook({ ...editedBook, [key]: e.target.value })
                      }
                    />
                  </div>
                )
            )}
            <button onClick={handleEdit}>Save</button>
            <button onClick={() => setShowEditModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="modal"
          style={{
            display: "block",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              margin: "10% auto",
              padding: "20px",
              border: "1px solid #888",
              width: "50%",
            }}
          >
            <h3>Are you sure you want to delete this book?</h3>
            <button onClick={handleDelete}>Yes</button>
            <button onClick={() => setShowDeleteModal(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Book;
