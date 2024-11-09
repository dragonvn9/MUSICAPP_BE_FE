import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
    
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
      return res.status(403).json({ message: "Token is required" });
    }
    
    try {
      
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
      console.log('Decoded token:', decodedToken);

      req.userId = decodedToken.id;  
      req.role = decodedToken.role;   
      // Console log giá trị userId để kiểm tra
      //console.log('user ID xx:', req.userId);

      return next(); 
    } catch (e) {
      console.error("Token verification failed:", e);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };


export default authMiddleware;
