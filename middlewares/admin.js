function adminMiddleware (req, res, next) {
    try {
        if(req.user.role !== "admin") return res.status(403).json({message : "unauthorized access"});
        next()
    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports = adminMiddleware;