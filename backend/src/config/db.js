import mongoose from "mongoose"
async function connectDB(){
try{    
await mongoose.connect(process.env.MONGODB_URL)
console.log(`Connect to database successfully`)
}
catch(error){
  console.log(`can't connect with DB`,error.message)
}
}

export default connectDB