const requestService = require("../services/request.service");

const createRequest = async (req, res) => {
  try {
    const request = await requestService.createRequest(
      req.params.productId,
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: request,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await requestService.getMyRequests(req.user.id);

    return res.json({
      success: true,
      message: "Sent requests fetched successfully",
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getReceivedRequests = async (req, res) => {
  try {
    const requests = await requestService.getReceivedRequests(req.user.id);

    return res.json({
      success: true,
      message: "Received requests fetched successfully",
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const request = await requestService.updateRequestStatus(
      req.params.id,
      req.user.id,
      req.body.status
    );

    return res.json({
      success: true,
      message: "Request status updated successfully",
      data: request,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus,
};