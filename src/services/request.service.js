const pool = require("../config/db");

const createRequest = async (productId, requesterId, requestData) => {
  const { request_type = "buy", message } = requestData;

  const allowedTypes = ["buy", "donate", "exchange", "claim"];

  if (!allowedTypes.includes(request_type)) {
    const error = new Error("Invalid request type");
    error.statusCode = 400;
    throw error;
  }

  const productResult = await pool.query(
    "SELECT id, user_id, status FROM products WHERE id = $1",
    [productId]
  );

  if (productResult.rows.length === 0) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const product = productResult.rows[0];

  if (product.user_id === requesterId) {
    const error = new Error("You cannot request your own product");
    error.statusCode = 400;
    throw error;
  }

  if (product.status !== "available") {
    const error = new Error("Product is not available");
    error.statusCode = 400;
    throw error;
  }

  const duplicateResult = await pool.query(
    `SELECT id
     FROM product_requests
     WHERE product_id = $1
       AND requester_id = $2
       AND status = 'pending'`,
    [productId, requesterId]
  );

  if (duplicateResult.rows.length > 0) {
    const error = new Error("A pending request already exists");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO product_requests
      (product_id, requester_id, owner_id, request_type, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [productId, requesterId, product.user_id, request_type, message]
  );

  return result.rows[0];
};

const getMyRequests = async (userId) => {
  const result = await pool.query(
    `SELECT
       pr.*,
       p.title,
       p.price,
       p.location,
       p.status AS product_status,
       u.name AS owner_name
     FROM product_requests pr
     JOIN products p ON pr.product_id = p.id
     JOIN users u ON pr.owner_id = u.id
     WHERE pr.requester_id = $1
     ORDER BY pr.created_at DESC`,
    [userId]
  );

  return result.rows;
};

const getReceivedRequests = async (ownerId) => {
  const result = await pool.query(
    `SELECT
       pr.*,
       p.title,
       p.price,
       p.location,
       u.name AS requester_name,
       u.email AS requester_email
     FROM product_requests pr
     JOIN products p ON pr.product_id = p.id
     JOIN users u ON pr.requester_id = u.id
     WHERE pr.owner_id = $1
     ORDER BY pr.created_at DESC`,
    [ownerId]
  );

  return result.rows;
};

const updateRequestStatus = async (requestId, ownerId, status) => {
  const allowedStatuses = [
    "pending",
    "accepted",
    "rejected",
    "completed",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    const error = new Error("Invalid request status");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `UPDATE product_requests
     SET status = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND owner_id = $3
     RETURNING *`,
    [status, requestId, ownerId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Request not found or unauthorized");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

module.exports = {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus,
};
