import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/modals/user"
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId; //importing objectid from mongoose

export const GET = async () =>{
     try{
          await connectDB();
          const users= await User.find(); //fetch all users
          return new NextResponse(JSON.stringify(users), {status:200});//our response

     } catch (err){
          console.log(err);
          return new NextResponse("Error in fetching" + err, {status:500});
     }
     
};

export const POST = async (request:Request) => {
     try{
          const body = await request.json(); // get data from request body
          await connectDB();
          const newUser = new User(body); //instance of new user
          await newUser.save();  //save user to db

          return new NextResponse(JSON.stringify({message: "User created", user:newUser}), {status:200});
 
     } catch (err){
          console.log(err);
          return new NextResponse("Error in creating user" + err, {status:500});
     }

}

export const PATCH = async (request:Request) => {
     try{
     const body = await request.json(); //get the request
     const {userid, newUserName} = body; //desstructure the body
     await connectDB(); 
          
          if (!userid || !newUserName) {
               return new NextResponse(
                    JSON.stringify({ message: "ID or name not provided" }),
                    { status: 400 }
          );
          }
          if (!Types.ObjectId.isValid(userid)) {
               return new NextResponse(
                    JSON.stringify({ message: "Invalid ID" }),
                    { status: 400 }
          );

          }
          const updatedUser = await User.findOneAndUpdate(
               { _id: new ObjectId(userid) }, 
               { username: newUserName },
               { new: true} //return the updated user
          )
          if (!updatedUser) {
               return new NextResponse(
                    JSON.stringify({ message: "User not found" }),
                    { status: 404 }
               )
          }
          return new NextResponse(
               JSON.stringify({ message: "User updated", user: updatedUser }),
               {status:200}
          )

     } catch (err: any){
          return new NextResponse(
               "Error in updating user" + err.message, {
               status: 500,
          });
     }
}

export const DELETE = async (request: Request) => {
     try {
          const { searchParams } = new URL(request.url);
          const userID = searchParams.get('userID');

           if (!userID) {
               return new NextResponse(
                    JSON.stringify({ message: "ID or name not provided" }),
                    { status: 400 }
          );
          }

          if (!Types.ObjectId.isValid(userID)) {
               return new NextResponse(JSON.stringify({ message: "Inavlid User ID" }), { status: 400, });
          }

          await connectDB();
          
          const deletedUser = await User.findOneAndDelete(
               new Types.ObjectId(userID)
          );

          if (!deletedUser) {
               return new NextResponse(
                    JSON.stringify({ message: "user not found in db" }), { status: 400 }
               );

          }
          return new NextResponse(
               JSON.stringify({ message: "User is deleted", user: deletedUser }), { status: 200 }
          );

     } catch(error:any) {
          return new NextResponse("Error in deleting user" + error.message, {
               status: 500,
          });
     }
} 