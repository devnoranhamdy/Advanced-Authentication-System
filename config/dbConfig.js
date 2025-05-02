const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;

const dataBaseConnection = () =>{
    mongoose.connect(url);
    const DB = mongoose.connection;
    
    DB.on("error", () => {
      console.log("Error on DB connection");
    });
    
    DB.once("open", () => {
      console.log("Connected to DB");
    });
    
}

    


module.exports = dataBaseConnection