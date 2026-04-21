import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  console.log("protect is running");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("Token decoded:", decoded);
    console.log("Looking up user with ID:", decoded.userId);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};