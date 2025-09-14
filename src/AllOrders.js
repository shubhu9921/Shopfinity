import React, { useEffect, useState } from "react";
import axios from "axios";


function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    "Pending",
    "Processing",
    "Packed",
    "Dispatched",
    "Delivered",
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/all-orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      alert("❌ Error loading orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/admin/update-order-status`,
        null,
        {
          params: { orderId, status: newStatus },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("❌ Could not update status.");
    }
  };

  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleString("en-IN");

  return (
    <div className="container mt-4">
      <h3
        className="mb-3"
        style={{ color: "#5a3476", fontWeight: "700", userSelect: "none" }}
      >
        🧾 All Orders
      </h3>

      {/* Filter Section */}
      <div
        className="mb-3 d-flex align-items-center gap-2 flex-wrap"
        style={{ userSelect: "none" }}
      >
        <label
          className="fw-bold"
          style={{ color: "#5a3476", minWidth: "130px" }}
          htmlFor="filterStatus"
        >
          Filter by Status:
        </label>
        <select
          id="filterStatus"
          className="form-select select-filter"
          style={{ maxWidth: "250px" }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p>No orders found for selected filter.</p>
      ) : (
        <div className="table-responsive">
          <table
            className="table table-bordered align-middle"
          >
            <thead className="table-header">
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Address</th>
                <th>Time</th>
                <th>Status</th>
                <th>Products</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="order-row"
                >
                  <td>{order.id}</td>
                  <td>{order.username || order.user?.username || "N/A"}</td>
                  <td>{order.address}</td>
                  <td>{formatDate(order.orderTime)}</td>
                  <td style={{ minWidth: "140px" }}>
                    <select
                      className="form-select select-status"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <ul className="list-unstyled mb-0">
                      {order.items?.map((item, i) => (
                        <li key={i}>
                          🛍 <strong>{item.productName}</strong> x {item.quantity} — ₹
                          {Number(item.price).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AllOrders;
