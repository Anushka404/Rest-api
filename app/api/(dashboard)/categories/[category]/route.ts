import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/modals/user"
import Category from "@/lib/modals/categories";
import { Types } from "mongoose";

//for dynamic PATCH req

export const PATCH = async (request: Request, context: { params: any }) => {
    const categoryID = context.params.category; //getting categroy from url directly after, refering to folder name
    try {
        const body = await request.json();
        const { title } = body; // destructure  
        const { searchParams } = new URL(request.url);
        const userID = searchParams.get("userID");
        
        if (!userID || !Types.ObjectId.isValid(userID)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                {
                    status: 400,
                }
            );
        }
        if (!categoryID || !Types.ObjectId.isValid(categoryID)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing categoryID" }),
                {
                    status: 400,
                }
            );
        }
        await connectDB();
        const user = await User.findById(userID);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "user not found in db" }),
                {
                    status: 404,
                }
            );
        }

        const category = await Category.findOne({_id: categoryID, user: userID });
        if(!category){
            return new NextResponse(
                JSON.stringify({message:"category not found"}),
                {
                    status:404,
                }
            )
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryID,
            {title},
            {new: true}
        );

        return new NextResponse(
            JSON.stringify({message:"category is updated", category:updatedCategory}),
            {status:200}
        )

    } catch(err:any) {
         return new NextResponse("Error in updating category" + err.message, {
               status: 500,
          });
    }
}

export const DELETE = async (request: Request, context: {params:any}) =>{
    const categoryID = context.params.category;
    try{
        const {searchParams}= new URL(request.url);
        const userID = searchParams.get("userID");

        if (!userID || !Types.ObjectId.isValid(userID)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                {
                    status: 400,
                }
            );
        }
        if (!categoryID || !Types.ObjectId.isValid(categoryID)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing categoryID" }),
                {
                    status: 400,
                }
            );
        }
        await connectDB();
        const user = await User.findById(userID);

        if(!user){
            return new NextResponse(
                JSON.stringify({message:"user not found"}),
                {
                    status:404,
                }
            );
        }
        const category = await Category.findOne({_id: categoryID, user: userID});
        if(!category){
            return new NextResponse(
                JSON.stringify({message:"category not found or does not belong to user"}),
                {
                    status:404,
                }
            );
        }

        await Category.findByIdAndDelete(categoryID);

        return new NextResponse(
            JSON.stringify({message:"category deleted successfully"}),
            {
                status:200,
            }
        );
        
    } catch(err:any){
        return new NextResponse("Error in deleting category" + err.message, {
            status: 500,
       });
    }
}