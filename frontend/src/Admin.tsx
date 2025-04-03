import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookType from "./types/Book";

const Admin: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [editedBook, setEditedBook] = useState<BookType>({
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `https://mission13-h5dcdpe0b6abb0ab.eastus-01.azurewebsites.net/Bookstore/books?displayNum=100000`
    )
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  const handleAdd = (newBook: BookType) => {
    fetch(
      "https://mission13-h5dcdpe0b6abb0ab.eastus-01.azurewebsites.net/Bookstore/books",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Book added successfully");
          window.location.reload();
        } else {
          console.error("Error adding book");
        }
      })
      .catch((error) => console.error("Error adding book:", error));
    navigate("/");
  };

  const handleEdit = () => {
    if (!editedBook) return;

    fetch(
      `https://mission13-h5dcdpe0b6abb0ab.eastus-01.azurewebsites.net/Bookstore/books/${editedBook.bookId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedBook),
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Book updated successfully");
          window.location.reload();
        } else {
          console.error("Error updating book");
        }
      })
      .catch((error) => console.error("Error updating book:", error));
    navigate("/");
  };

  const handleDelete = () => {
    if (bookToDelete === null) return;

    fetch(
      `https://mission13-h5dcdpe0b6abb0ab.eastus-01.azurewebsites.net/Bookstore/books/${bookToDelete}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Book deleted successfully");
          window.location.reload();
        } else {
          console.error("Error deleting book");
        }
      })
      .catch((error) => console.error("Error deleting book:", error));
    navigate("/");
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <button
        onClick={() => {
          setShowEditModal(true);
        }}
      >
        Add Book
      </button>
      <ul>
        {books.map((book) => (
          <li key={book.bookId}>
            {book.title} by {book.author} (${book.price})
            <button
              onClick={() => {
                setEditedBook(book);
                setShowEditModal(true);
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                setBookToDelete(book.bookId);
                setShowDeleteModal(true);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {showEditModal && editedBook && (
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
            <h3>{editedBook.bookId === 0 ? "Add Book" : "Edit Book"}</h3>
            {Object.keys(editedBook).map(
              (key) =>
                key !== "bookId" && (
                  <div key={key}>
                    <label>{key}:</label>
                    <input
                      type="text"
                      value={(editedBook as any)[key]}
                      onChange={(e) =>
                        setEditedBook({
                          ...editedBook,
                          [key]: e.target.value,
                        })
                      }
                    />
                  </div>
                )
            )}
            <button
              onClick={
                editedBook.bookId === 0
                  ? () => handleAdd(editedBook)
                  : handleEdit
              }
            >
              Save
            </button>
            <button onClick={() => setShowEditModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
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

export default Admin;
