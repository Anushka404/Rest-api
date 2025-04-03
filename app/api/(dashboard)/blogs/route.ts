import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/modals/user"
import Category from "@/lib/modals/categories";
import { Types } from "mongoose";
import Blog from "@/lib/modals/blogs";

export const GET = async (request:Request) =>{
    try{
        const {searchParams} = new URL(request.url);
        const userID = searchParams.get("userID");
        const categoryID = searchParams.get("categoryID");

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

        const category = await Category.findById(categoryID);
        if(!category){
            return new NextResponse(
                JSON.stringify({ message: "category not found in db" }),
                {
                    status: 404,
                }
            );
        }
        const filter: any ={
            user: new Types.ObjectId(userID),
            category: new Types.ObjectId(categoryID),
        }

        const blogs =await Blog.find(filter);

        return new NextResponse(JSON.stringify({blogs}),{status:200});

    } catch(err:any){
        return new NextResponse("Error in updating category" + err.message, {
            status: 500,
       });
    }
}
