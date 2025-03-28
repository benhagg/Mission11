import { useNavigate } from "react-router-dom";
import type BookType from "./types/Book";

interface CartProps {
  cart: { book: BookType; quantity: number }[];
  setCart: React.Dispatch<
    React.SetStateAction<{ book: BookType; quantity: number }[]>
  >;
}

const Cart: React.FC<CartProps> = ({ cart, setCart }) => {
  const navigate = useNavigate();

  const removeFromCart = (bookId: number) => {
    setCart(cart.filter((item) => item.book.bookId !== bookId));
  };

  const updateQuantity = (bookId: number, quantity: number) => {
    setCart(
      cart.map((item) =>
        item.book.bookId === bookId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const calculateSubtotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) =>
        total + calculateSubtotal(item.book.price, item.quantity),
      0
    );
  };

  return (
    <div className="container">
      <h1>Your Shopping Cart</h1>
      {cart.length === 0 ? <p>Your cart is empty.</p> : null}
      <ul className="list-group">
        {cart.map((item) => (
          <li
            key={item.book.bookId}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <span>
                {item.book.title} (x{item.quantity})
              </span>
              <div>
                <small>Price: ${item.book.price.toFixed(2)}</small>
                <br />
                <small>
                  Subtotal: $
                  {calculateSubtotal(item.book.price, item.quantity).toFixed(2)}
                </small>
              </div>
            </div>
            <div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.book.bookId, parseInt(e.target.value, 10))
                }
                className="form-control form-control-sm"
                style={{
                  width: "60px",
                  display: "inline-block",
                  marginRight: "10px",
                }}
              />
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeFromCart(item.book.bookId)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h3 className="mt-3">Total: ${calculateTotal().toFixed(2)}</h3>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
        Continue Shopping
      </button>
    </div>
  );
};

export default Cart;
