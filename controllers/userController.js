const getProfile = async (req, res) => {
  res.json({
    message: "Protected profile data",
    user: req.user,
  });
};

module.exports = {
  getProfile,
};
