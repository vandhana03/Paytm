require("dotenv").config();
const express = require("express");
const MainRouter=require("./routes/index.js");
const cors=require("cors");


const app=express();
app.use(cors());
//body parser   
app.use(express.json()); 

app.use("/api/v1",MainRouter);


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});



