import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";
import {
    connectDB,
    syncDatabase
} from "./config/db";
const app = express();



//MIDDLEWARES
app.use(cors());
app.use(express.json({
    limit: "10mb"
}));
app.use(express.urlencoded({
    extended: false
}));

//Connect database
connectDB();
//Sync database models and drop or not if existing (force param);
syncDatabase(true);


//ROUTINGS -- Add module routers here
app.use("/users", routes.users);

// SIMPLE METHODS for root endpoint
app.get("/", (req, res) => {
    res.send("Received a GET HTTP request");
});

app.post("/", (req, res) => {
    //Data on req.body
    res.send("Received a POST HTTP request");
});

app.put("/", (req, res) => {
    res.send("Received a PUT HTTP request");
});

app.delete("/", (req, res) => {
    res.send("Received a DELETE HTTP request");
});

app.listen(process.env.RUNNING_PORT, () => {
    console.log("Server is running on port", process.env.RUNNING_PORT);
});

module.exports = app;