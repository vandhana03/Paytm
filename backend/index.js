require("dotenv").config();
const express = require("express");
const MainRouter=require("./routes/index.js");
const cors=require("cors");


const app=express();
app.use(cors());
//body parser   
app.use(express.json()); 

app.use("/api/v1",MainRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



