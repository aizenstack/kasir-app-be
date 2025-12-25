exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "administrator") {
    return res.status(403).json({ message: "Access Denied. Admin Only!" });
  }

  next();
};
