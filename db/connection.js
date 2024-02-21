import mongoose from "mongoose";
const db_connection=async()=>{
    await mongoose.connect(process.env.CONNECTION_URL_LOCAL).then((res)=>console.log("data base connected successfully")).catch((err)=>console.log("data base connection failed",err))
}
export default db_connection