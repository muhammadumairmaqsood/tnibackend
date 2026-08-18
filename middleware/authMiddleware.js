import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const protectAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ==========================================
    // CHECK TOKEN
    // ==========================================

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized. Please login.",
      });
    }

    // ==========================================
    // GET TOKEN
    // ==========================================

    const token = authHeader.split(" ")[1];

    // ==========================================
    // VERIFY TOKEN
    // ==========================================

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ==========================================
    // CHECK ROLE
    // ==========================================

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // ==========================================
    // SAVE ADMIN DATA
    // ==========================================

    req.admin = decoded;

    next();
  } catch (error) {
    console.log("AUTH MIDDLEWARE ERROR:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
export default protectAdmin;
