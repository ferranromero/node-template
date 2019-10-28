import "dotenv/config";
import {
    hashSync,
    compareSync
} from "bcrypt";
import {
    encode,
} from "jwt-simple";
import User from "../models/User";


export const login = (req, res) => {
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
            res.status(500).send(err);
        })
}

export const register = (req, res) => {
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
            token: encode(req.body.userName, process.env.APIKEY)
        })
        .then((user) => {
            res.status(201).send(user);
        })
        .catch((err) => {
            switch (err.errors[0].type) {
                case "unique violation":
                    res.status(409).send({
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
                    res.status(500).send({
                        status: "Not handled",
                        message: err
                    });
                    break;
            }
        });
}