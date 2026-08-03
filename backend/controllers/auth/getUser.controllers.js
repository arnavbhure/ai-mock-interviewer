const getUserController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: "Unauthorized", success: false });
    }

    return res
      .status(200)
      .json({ user, success: true, message: "User fetched successfully" });
  } catch (err) {
    console.log("Error in getUserController:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

module.exports = { getUserController };
