exports.isAdmin = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. Please login first." });
  }

  // Check if user has administrator role
  if (req.user.role !== "administrator") {
    return res.status(403).json({ 
      message: "Access Denied. Admin Only!",
      currentRole: req.user.role,
      requiredRole: "administrator"
    });
  }

  next();
};
