import { decode } from "jwt-simple";

export function checkAuthentication(req, res, next) {
    if (!req.headers.authorization) {
        return res
            .status(403)
            .send({
                message: "No Authorization header attached"
            });
    }
    let token = req.headers.authorization;
    let payload = decode(token, process.env.APIKEY);

    req.user = payload;
    next();
}