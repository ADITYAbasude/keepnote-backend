const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Unauthorized user" })
    }
    try {

        const data = jwt.verify(token, "13@777adityaKhufhiyaKey");
        req.user = data.user;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).send({ error: "Unauthorized user" })
    }
}



module.exports = fetchUser

