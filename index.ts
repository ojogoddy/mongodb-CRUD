import express, {Application, Request, Response} from "express"
import mongoose from "mongoose";

const port:number = 4040;

const url:string ="mongodb://0.0.0.0:27017/"

const app:Application= express();

interface client{
    name : string ,
    email: string,
    isActive:boolean,
    age: number
}
interface iClient extends client, mongoose.Document{}

const schemaClient = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type: String
    },
    isActive:{
        type:Boolean
    },
    age:{
        type:Number
    }
})
const dataModel = mongoose.model<iClient>("client", schemaClient)
// create an endpoint

app.use(express.json()) //middleware can be used to parse JSON data in request bodies for any route in an Express.js application. It is a useful middleware for APIs that receive JSON data in their request bodies.
app.post("/api/v1/post-client", async(req:Request, res:Response)=>{
    try{
        const {name, email, isActive, age} =req.body
        if(!name || !email || !isActive || !age)
        {
            res.status(404).json({
                message: "fill all field"
            })
        }
        const data = await dataModel.create({
            name,
            email,
            isActive,
            age
        })
        return res.status(201).json({
            message: "created successfully",
            result: data
        })
    }catch(error:any)
    {
 return res.status(404).json({
    message:error.message
})
    }
})

app.get("/api/v1/get-all", async(req:Request, res:Response)=>{
    try{
        const dataAll = await dataModel.find()
        return res.status(200).json({
            message: "all data",
            result: dataAll
        })
    }catch(error:any)
    {
        return res.status(404).json({
            message: error.message
        })

    }
})

app.delete("/api/v1/delete-one/:id", async(req:Request, res:Response)=>{
    try{
        const dataId = req.params.id
        const deletedData = await dataModel.findByIdAndDelete(dataId)
        

        if (!deletedData){
            return res.status(404).json({
                status: "failed to update",
                message: "no data with the id: " + dataId + "was found to delete"
            })
        }
        return res.status(200).json({
            status: "success",
            message: "data deleted successfully",
            result: deletedData
        })
    }catch(error:any)
    {
        return res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
})

// app.put("/api/v1/update-data/:id", async(req: Request, res: Response)=>{
//     try{
//         const dataId = req.params.id
//         const {name, email, isActive, age} = req.body

//         const updateData = await dataModel.findByIdAndUpdate()
//         if(!updateData)
//         {
//             return res.status(404).json({
//                 status: "failed to update",
//                 message: "No data with the ID: " + dataId + " was found to update"
//             })
//         }
//         return  res.status(200).json({
//             status:"updated succesfully",
//             message: "data updated successfully",
//             result : updateData
//         })
//     }catch(error:any)
//     {
//         return res.status(500).json({
//             message: error.message
//         })
//     }
// })

mongoose.connect(url).then(()=>{
    console.log("database connected successfully");
}).catch((error:any)=>{
    console.log(`Error in connecting to database ${error}`);
})

const server= app.listen(port, ()=>{
    console.log("listening to port", port)
})
process.on("uncaughtException", (error:Error)=>{
    console.log("stop here: UncaughtException")
    console.log(error)
    process.exit(1)
})
process.on("unhandledRejection", (reason:any)=>{ //read about unhandledRejection
    console.log("stop here: unhandleRejection")
    console.log(reason)

    server.close(()=>{
        process.exit(1)
    })
})

//before sending data to database.. we create a structure for it... we use mongoose to create the structure for it
//schema definition..HoW? before we define schema we need to define our model... schema means u are defining the model....
//ones the model is created, we need to define the path of the model...
//the values are the schema

//assignment.. getbyID and delete by ID