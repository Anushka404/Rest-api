import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    const connected = mongoose.connection.readyState;
    if(connected === 1){
        console.log("Already connected");
        return;
    }
    if(connected === 2){
        console.log("Connnecting...");
        return;
    }
    try{
        mongoose.connect(MONGODB_URI!, {
            dbName: 'mongodb-restapis',
            bufferCommands: true
        });
        console.log("Connected");
    } catch(err: any) {
        console.log("Error: ", err);
        throw new Error("Error: ", err);
    }
    
};
 export default connectDB;