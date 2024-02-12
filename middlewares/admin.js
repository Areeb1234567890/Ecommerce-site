const checkAdmin = (req, res, next) => {
  const includedRoutes = ["/api/getUsers"];
  if (includedRoutes.includes(req.path)) {
    console.log("admin middleware is working");
    const isAdmin = req.header("isAdmin");
    if (isAdmin !== "true") {
      return res.status(401).json({ msg: "Unauthorized - You are not admin" });
    } else {
      return next();
    }
  } else {
    return next();
  }
};

module.exports = checkAdmin;
