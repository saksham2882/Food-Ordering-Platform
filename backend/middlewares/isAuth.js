import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: "Token not found" })
        }

        // decode token
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!decodeToken) {
            return res.status(400).json({ message: "Token not verify" })
        }

        // get and store user id
        req.userId = decodeToken.userId
        next()
    } catch (error) {
        return res.status(500).json({ message: `Authentication error: ${error}` })
    }
}

export default isAuth