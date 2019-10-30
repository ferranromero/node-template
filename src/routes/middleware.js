 import {
    decode
} from "jwt-simple";

export function checkAuthentication(req, res, next) {
    if (!req.headers.authorization) {
        return res
            .status(401)
            .send({
                message: "No Authorization header attached"
            });
    }
    let token = req.headers.authorization;
    let payload = decode(token, process.env.APIKEY);
    User.findOne({
            where: {
                userName: payload
            }
        })
        .then((user) => {
            if (user !== null) {
                req.user = user;
                next();
            } else {
                return res.status(401).send({
                    message: "Invalid token"
                })
            }

        })
        .catch((err)=>{
            return res.status(500).send({
                message: err
            })
        })

}