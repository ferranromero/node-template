import "dotenv/config";
import {
    Router
} from "express";
import User from "../models/User";
import {
    hashSync,
    compareSync
} from "bcrypt";
import {
    encode,
    decode
} from "jwt-simple";
import {
    errorMessage
} from "../utils/ErrorMessage";
const router = Router();


router.post("/login", (req, res) => {
    User.findOne({
            where: {
                userName: req.body.userName
            }
        })
        .then((user) => {
            if (user !== null && compareSync(req.body.password, user.password)) {
                res.status(200).send({
                    user: user.userName,
                    token: user.token
                })
            } else {
                res.status(400).send("Bad credentials");
            }
        })
        .catch((err) => {
            res.send(err);
        })
})

router.get("/privat", checkAuthentication, (req, res) => {

})


router.post("/register", (req, res) => {
    if (req.body.userName === undefined || req.body.password === undefined) {
        return res.status(400).send({
            message: "Missing user or password"
        })
    }
    User.create({
            userName: req.body.userName,
            password: hashSync(req.body.password, 5),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            token: generateToken(req.body.userName),
        })
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            switch (err.errors[0].type) {
                case "unique violation":
                    res.status(400).send({
                        message: "User already exists"
                    });
                    break;
                case "notNull Violation":
                    res.status(400).send({
                        message: err.errors[0].path + " not provided"
                    });
                    break;
                case "Validation error":
                    res.status(400).send({
                        message: "Cannot validate " + err.errors[0].path
                    })
                    break;
                default:
                    res.status(400).send({
                        status: "Not handled",
                        message: err.errors[0].type
                    });
                    break;
            }

        });
})

function checkAuthentication(req, res, next) {
    if (!req.headers.authorization) {
        return res
            .status(403)
            .send({
                message: "Tu petición no tiene cabecera de autorización"
            });
    }
    let token = req.headers.authorization;
    let payload = decodeToken(token);

    req.user = payload;
    next();
}

const generateToken = (userName) => {
    return encode(userName, process.env.APIKEY)
}

const decodeToken = (token) => {
    return (decode(token, process.env.APIKEY));
}

export default router;