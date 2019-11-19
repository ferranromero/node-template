import { decode } from 'jwt-simple';
import User from '../models/User';

// eslint-disable-next-line consistent-return
export default function checkAuthentication(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'No Authorization header attached',
    });
  }
  const token = req.headers.authorization;
  const payload = decode(token, process.env.APIKEY);
  User.findOne({
    where: {
      userName: payload,
    },
  })
    .then(user => {
      if (user !== null) {
        req.user = user;
        return next();
      }
      return res.status(401).send({
        message: 'Invalid token',
      });
    })
    .catch(err => {
      return res.status(500).send({
        message: err,
      });
    });
}
