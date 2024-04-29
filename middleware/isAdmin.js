module.exports = function(req, res, next) {
    if(req.user.roles.includes("admin")) {
        next()
    }else{
        return res.status(403).send("Access Forbidden")
    }
}