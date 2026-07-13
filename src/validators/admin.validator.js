const validateRoleUpdate = (req, res, next) => {
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({
      success: false,
      message: "Role is required",
    });
  }

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Role must be user or admin",
    });
  }

  next();
};

module.exports = {
  validateRoleUpdate,
};