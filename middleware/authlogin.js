const jwt = require("jsonwebtoken");

function checkIfLoggedIn(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).json({ message: "No token supplied" });
        }

        const [scheme, token] = authHeader.split(" ");
        if (scheme.toLowerCase() !== "bearer") {
            return res.status(422).json({ message: "Invalid authentication scheme" });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded; // ✅ Store decoded token payload in req.user
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = checkIfLoggedIn;
