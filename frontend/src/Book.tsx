import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

interface BookProps {
  book: Book;
}

const Book: React.FC<BookProps> = ({ book }) => {
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
      </div>
    </div>
  );
};

export default Book;
