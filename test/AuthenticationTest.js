import 'dotenv/config';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { before } from 'mocha';
import { hashSync } from 'bcrypt';
import { encode } from 'jwt-simple';
import server from '../src/index';
import User from '../src/models/User';

const srv = server;

chai.use(chaiHttp);
chai.should();

describe('Authentication Service', () => {
  before(done => {
    setTimeout(done, 500);
  });
  beforeEach(done => {
    User.destroy({
      where: {},
      truncate: true,
    }).then(() => done());
  });
  describe('--> Register', () => {
    it('--> When a email format is invalid, must not register user.', done => {
      chai
        .request(srv)
        .post('/users/register')
        .send({
          userName: 'ferran.romero',
          password: '12345',
          email: 'ferranroomerogmail.com',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Cannot validate email');
          done();
        });
    });
    it('--> When all fields are correct, user must be registered.', done => {
      chai
        .request(srv)
        .post('/users/register')
        .send({
          userName: 'pepito',
          password: '1234',
          email: 'smxfromero@gmail.com',
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.userName).to.equal('pepito');
          done();
        });
    });
    it('--> When username field is not provided, user is not registered.', done => {
      chai
        .request(srv)
        .post('/users/register')
        .send({
          password: '12345',
          email: 'ferran.romero@est.fib.upc.edu',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Missing user or password');
          done();
        });
    });
    it('--> When password field is missing, user is not registered.', done => {
      chai
        .request(srv)
        .post('/users/register')
        .send({
          userName: 'ferran.romero',
          email: 'ferran.romero@est.fib.upc.edu',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Missing user or password');
          done();
        });
    });
    it('--> When email field is missing, user is not registered', done => {
      chai
        .request(srv)
        .post('/users/register')
        .send({
          userName: 'ferran.romero',
          password: '12345',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('email not provided');
          done();
        });
    });
    it('--> When another user with same username already exists, user is not registered.', done => {
      User.create({
        userName: 'ferran.romero',
        password: '12345',
        email: 'ferranromero@gmail.com',
        token: 'añldkjssfañ',
      }).then(() => {
        chai
          .request(srv)
          .post('/users/register')
          .send({
            userName: 'ferran.romero',
            password: '12345',
            email: 'ferranroomero@gmail.com',
          })
          .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.message).to.equal('User already exists');
            done();
          });
      });
    });
  });
  describe('--> Login', () => {
    before(done => {
      setTimeout(done, 100);
    });
    beforeEach(done => {
      User.destroy({
        where: {},
        truncate: true,
      }).then(() => {
        User.create({
          userName: 'ferran.romero',
          password: hashSync('1234', 5),
          firstName: 'ferran',
          email: 'ferran@gmail.com',
          token: encode('ferran.romero', process.env.APIKEY),
        }).then(() => {
          done();
        });
      });
    });
    it('--> When a user validates OK, it must receive a token', done => {
      chai
        .request(srv)
        .post('/users/login')
        .send({
          userName: 'ferran.romero',
          password: '1234',
        })
        .end((err, res) => {
          expect(res.body.user).to.equal('ferran.romero');
          expect(res.body.token).to.equal(
            encode('ferran.romero', process.env.APIKEY),
          );
          done();
        });
    });
    it('--> WHen a users validates with bad credentials, must show error.', done => {
      chai
        .request(srv)
        .post('/users/login')
        .send({
          userName: 'ferran',
          password: '1234',
        })
        .end((err, res) => {
          expect(res.body.message).to.equal('Bad credentials');
          expect(res.status).to.equal(400);
          done();
        });
    });
  });
});
