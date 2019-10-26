import {Router} from "express";

const router =  Router();

//Example routing from users
router.get("/",(req,res)=>{
    res.send("Get from users");
})

export default router;