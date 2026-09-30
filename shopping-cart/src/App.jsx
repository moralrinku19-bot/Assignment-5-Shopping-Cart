import { useReducer, useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "Wireless Headphones", price: 1499 },
  { id: 2, name: "Smart Watch", price: 2499 },
  { id: 3, name: "Running Shoes", price: 1999 },
  { id: 4, name: "Backpack", price: 999 },
  { id: 5, name: "Sunglasses", price: 799 },
  { id: 6, name: "Coffee Mug", price: 399 },
];

const initialState = {
  cart: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }

    case "INCREASE":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };

    case "DECREASE":
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case "REMOVE":
      return {
        ...state,
        cart: state.cart.filter(
          (item) => item.id !== action.payload
        ),
      };

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discount) / 100;
  const afterDiscount = subtotal - discountAmount;
  const gst = afterDiscount * 0.18;
  const grandTotal = afterDiscount + gst;

   const applyCoupon = () => {
  const code = coupon.trim().toUpperCase();

  if (code === "SAVE10") {
    setDiscount(10);
    alert("10% discount applied!");
  } else if (code === "SAVE20") {
    setDiscount(20);
    alert("20% discount applied!");
  } else {
    setDiscount(0);
    alert("Invalid coupon code!");
  }
};

  return (
    <div className="app">
      <header>
        <h1>🛍️ ShopEasy</h1>
        <p>
          Cart Items:{" "}
          {state.cart.reduce((total, item) => total + item.quantity, 0)}
        </p>
      </header>

      <main>
        <section className="products">
          <h2>Product List</h2>

          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-icon">🛒</div>

                <h3>{product.name}</h3>

                <p className="price">
                  ₹{product.price}
                </p>

                <button
                  onClick={() =>
                    dispatch({
                      type: "ADD_TO_CART",
                      payload: product,
                    })
                  }
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="cart">
          <h2>🛒 Shopping Cart</h2>

          {state.cart.length === 0 ? (
            <p className="empty">Your cart is empty.</p>
          ) : (
            <>
              {state.cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>₹{item.price} × {item.quantity}</p>
                  </div>

                  <div className="quantity">
                    <button
                      onClick={() =>
                        dispatch({
                          type: "DECREASE",
                          payload: item.id,
                        })
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        dispatch({
                          type: "INCREASE",
                          payload: item.id,
                        })
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove"
                    onClick={() =>
                      dispatch({
                        type: "REMOVE",
                        payload: item.id,
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="coupon">
                <h3>Coupon Code</h3>

                <input
                  type="text"
                  placeholder="SAVE10 or SAVE20"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />

                <button onClick={applyCoupon}>
                  Apply Coupon
                </button>
              </div>

              <div className="summary">
                <h2>Order Summary</h2>

                <p>
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </p>

                <p>
                  <span>Discount:</span>
                  <span>- ₹{discountAmount.toFixed(2)}</span>
                </p>

                <p>
                  <span>GST (18%):</span>
                  <span>₹{gst.toFixed(2)}</span>
                </p>

                <hr />

                <h2>
                  <span>Grand Total:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </h2>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;