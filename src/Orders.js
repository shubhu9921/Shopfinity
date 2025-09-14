import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

function Orders() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8080/user/orders", {
          params: { userId: Number(userId) },
          withCredentials: true,
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        alert("Unable to load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOrders();
  }, [userId]);

  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await axios.get(`http://localhost:8080/user/orders/${orderId}/invoice`, {
        responseType: "blob",
        withCredentials: true,
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading invoice:", err);
      alert("Failed to download invoice.");
    }
  };

  const toggleProductList = (orderId) => {
    setVisibleProducts((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleBuyProductAgain = (productId) => {
    if (!productId) {
      alert("Invalid product ID.");
      return;
    }
    navigate(`/product/${productId}`);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN");
  };

  return (
    <div className="container mt-5">
      <h3>{username ? `${username}'s Orders` : "My Orders"}</h3>

      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <ul className="list-group">
          {orders.map((order) => {
            // Get the first product image from the order items for the main order image
            const firstItem = order.items?.[0];
            const mainImageUrl = firstItem?.product?.imageUrl || firstItem?.imageUrl || null;
            const mainProductName = firstItem?.product?.name || firstItem?.productName || "Order Image";

            return (
              <li key={order.id} className="list-group-item">
                <div className="d-flex align-items-center gap-3">
                  {/* Main Order Product Image on the left */}
                  {mainImageUrl && (
                    <div style={{ flexShrink: 0 }}>
                      <img
                        src={`http://localhost:8080/${mainImageUrl}`}
                        alt={mainProductName}
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        onError={(e) => (e.target.src = "/default.jpg")}
                        className="img-thumbnail"
                      />
                    </div>
                  )}

                  {/* Order details on the right */}
                  <div>
                    {/* Product Name ABOVE Order ID */}
                    <h5>{mainProductName}</h5>

                    <strong>Order ID:</strong> {order.id} <br />
                    <strong>Address:</strong> {order.address} <br />
                    <strong>Time:</strong> {formatDate(order.orderTime)} <br />
                    <strong>Status:</strong>{" "}
                    <span className="badge bg-info">{order.status || "N/A"}</span>

                    <div className="mt-2">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleDownloadInvoice(order.id)}
                      >
                        Download Invoice
                      </button>

                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => toggleProductList(order.id)}
                      >
                        {visibleProducts[order.id] ? "Hide Products" : "Buy Again"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products list (toggle) */}
                {visibleProducts[order.id] && order.items?.length > 0 && (
                  <div className="mt-3">
                    <strong>Products:</strong>
                    <ul className="list-group mt-2">
                      {order.items.map((item, index) => {
                        const productName = item.productName || item.product?.name || "Unnamed Product";
                        const productId = item.productId || item.product?.id || null;
                        const imageUrl = item.product?.imageUrl || item.imageUrl || null;

                        return (
                          <li
                            key={index}
                            className="list-group-item d-flex align-items-center gap-3 flex-wrap"
                          >
                            <img
                              src={
                                imageUrl
                                  ? `http://localhost:8080/${imageUrl}`
                                  : "/default.jpg"
                              }
                              alt={productName}
                              className="img-thumbnail"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                              onError={(e) => (e.target.src = "/default.jpg")}
                            />

                            <div className="flex-grow-1">
                              <strong>{productName}</strong> <br />
                              Qty: {item.quantity} <br />
                              Price: ₹{item.price?.toFixed(2) || "N/A"}
                            </div>

                            {productId && (
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleBuyProductAgain(productId)}
                              >
                                Buy Again
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Orders;
