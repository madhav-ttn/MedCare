import express from "express";

const app=express();
const port=process.env.PORT || 8001;

app.listen(port,()=>console.log(`Server is running at port ${port}`));