import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.cookies.authToken;

    if(!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(
        token, 
        process.env.JWT_SECRET,
        (err, user) => {
            if(err) 
                return res.status(403).json({
                            message: 'Invalid or expired token'
                        })  
            req.user = user;
            next();
        } 
    )
}

export default authMiddleware;