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
    <div className="book" id={book.bookId.toString()}>
      <h2>{book.title}</h2>
      <p>
        <strong>Author:</strong> {book.author}
      </p>
      <p>
        <strong>Publisher:</strong> {book.publisher}
      </p>
      <p>
        <strong>ISBN:</strong> {book.isbn}
      </p>
      <p>
        <strong>Classification:</strong> {book.classification}
      </p>
      <p>
        <strong>Category:</strong> {book.category}
      </p>
      <p>
        <strong>Page Count:</strong> {book.pageCount}
      </p>
      <p>
        <strong>Price:</strong> {book.price}
      </p>
    </div>
  );
};
export default Book;
