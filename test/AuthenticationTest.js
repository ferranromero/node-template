import "dotenv/config";
import chai, {
  assert,
  expect
} from "chai";
import chaiHttp from "chai-http";
import server from "../src/index";
import User from "../src/models/User";

let srv = server;

chai.use(chaiHttp);
chai.should();

describe("Authentication", (done) => {
  before((done) => {
    setTimeout(done, 400);
  })
  beforeEach((done) => {
    User.destroy({
        where: {},
        truncate: true
      })
      .then((res) => done());
  })
  describe("Endpoint: /users/register", () => {
    it("Return 400 when bad email input", (done) => {
      chai.request(srv)
        .post("/users/register")
        .send({
          userName: "ferran.romero",
          password: "12345",
          email: "ferranroomerogmail.com"
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal("Cannot validate email");
          done();
        })
    });
    it("Return 201 when all Ok!", (done) => {
      chai.request(srv)
        .post("/users/register")
        .send({
          userName: "pepito",
          password: "1234",
          email: "smxfromero@gmail.com"
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.userName).to.equal("pepito");
          expect(res.body.email).to.equal("smxfromero@gmail.com");
          done();
        })
    });
    it("Return 400 when missing username", (done) => {
      chai.request(srv)
        .post("/users/register")
        .send({
          password: "12345",
          email: "ferran.romero@est.fib.upc.edu"
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal("Missing user or password");
          done();
        })
    });
    it("Return 400 when missing password", (done) => {
      chai.request(srv)
        .post("/users/register")
        .send({
          userName: "ferran.romero",
          email: "ferran.romero@est.fib.upc.edu"
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal("Missing user or password");
          done();
        })
    });
    it("Return 400 when missing email", (done) => {
      chai.request(srv)
        .post("/users/register")
        .send({
          userName: "ferran.romero",
          password: "12345",
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal("email not provided");
          done();
        })
    });
    it("Return 409 when duplicated!", (done) => {
      User.create({
          userName: "ferran.romero",
          password: "12345",
          email: "ferranromero@gmail.com",
          token: "añldkjssfañ"
        })
        .then((user) => {
          chai.request(srv)
            .post("/users/register")
            .send({
              userName: "ferran.romero",
              password: "12345",
              email: "ferranroomero@gmail.com"
            })
            .end((err, res) => {
              expect(res.status).to.equal(409);
              expect(res.body.message).to.equal("User already exists")
              done();
            })
        })
    });
  });
});