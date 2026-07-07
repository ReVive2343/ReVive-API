const pool = require("../config/db");

const createRequest = async (req, res) => {
  try {
    const productId = req.params.productId;
    const requesterId = req.user.id;
    const { request_type = "buy", message } = req.body;

    const productResult = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResult.rows[0];

    if (product.user_id === requesterId) {
      return res.status(400).json({ message: "You cannot request your own product" });
    }

    const result = await pool.query(
      `INSERT INTO product_requests 
       (product_id, requester_id, owner_id, request_type, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [productId, requesterId, product.user_id, request_type, message]
    );

    res.status(201).json({
      message: "Request created successfully",
      request: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pr.*, p.title, p.price, p.location
       FROM product_requests pr
       JOIN products p ON pr.product_id = p.id
       WHERE pr.requester_id = $1
       ORDER BY pr.created_at DESC`,
      [req.user.id]
    );

    res.json({ count: result.rows.length, requests: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getReceivedRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pr.*, p.title, p.price, p.location, u.name AS requester_name, u.email AS requester_email
       FROM product_requests pr
       JOIN products p ON pr.product_id = p.id
       JOIN users u ON pr.requester_id = u.id
       WHERE pr.owner_id = $1
       ORDER BY pr.created_at DESC`,
      [req.user.id]
    );

    res.json({ count: result.rows.length, requests: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["pending", "accepted", "rejected", "completed", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const result = await pool.query(
      `UPDATE product_requests
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND owner_id = $3
       RETURNING *`,
      [status, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Request not found or unauthorized" });
    }

    res.json({
      message: "Request status updated successfully",
      request: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus,
};