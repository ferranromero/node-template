import "dotenv/config";
const Sequelize = require("sequelize");


export const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {host:"localhost", dialect: "postgres"});

export const connectDB = () =>{
    sequelize
    .authenticate()
    .then(()=>{
        console.log("Connection OK");
    })
    .catch((err)=>{
        console.log("Errror: ", err);
    })
}