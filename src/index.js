import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { connectDB } from "./config/db";
const app = express();
//MIDDLEWARES
app.use(cors());
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:false}));

connectDB();
//ROUTINGS
app.use("/users",routes.users);

const test = () => {
    let test = {name:"Ferran"}
    return test;
}

// SIMPLE METHODS
app.get("/",(req,res)=>{
    
    //res.end(JSON.stringify(test()));
    res.send("Received a GET HTTP request");
});

app.post("/",(req,res)=>{
    //Data on req.body
    res.send("Received a POST HTTP request");
});

app.put("/",(req,res)=>{
    res.send("Received a PUT HTTP request");
});

app.delete("/",(req,res)=>{
    res.send("Received a DELETE HTTP request");
});





app.listen(process.env.RUNNING_PORT,()=>{
    console.log("Server is running on port", process.env.RUNNING_PORT);
})
