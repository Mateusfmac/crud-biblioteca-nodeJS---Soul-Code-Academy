var mongoose = require("mongoose")

mongoose.connect("mongodb+srv://mateus_machado:mateus_machado@cluster0.nobsl.mongodb.net/biblioteca?retryWrites=true&w=majority").then(()=>{
  console.log("deu bom")
}).catch((err)=>{
  console.log("deu bosta")
})