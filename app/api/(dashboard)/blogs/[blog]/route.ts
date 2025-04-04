import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/modals/user"
import Category from "@/lib/modals/categories";
import { Types } from "mongoose";
import Blog from "@/lib/modals/blogs";


export const GET =async (request:Request, context:{params:any}) =>{
    const blogID = context.params.blog;
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
        if (!blogID || !Types.ObjectId.isValid(blogID)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing blogID" }),
                {
                    status: 400,
                }
            );
        }
        await connectDB();

        const blog = await Blog.findOne({
            _id: blogID,
            user: userID,
            category: categoryID,
        });

        if(!blog){
            return new NextResponse(
                JSON.stringify({message: "Blog not found"}),
                {status: 404}
            );
        }

        return new NextResponse(
            JSON.stringify({message:"Blog found", blog}),
            {status: 200}
        );

    } catch(err:any){
        return new NextResponse("Error in creating a blog" + err.message, {
            status:500,
        })
    }
}

export const PATCH = async (request: Request, context: {params:any}) => {
    const blogID= context.params.blog;
    try{
        const body = await request.json();
        const {title, description} = body;

        const {searchParams} = new URL(request.url);
        const userID = searchParams.get("userID");
        if (!userID || !Types.ObjectId.isValid(userID)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                {
                    status: 400,
                }
            );
        }
        if (!blogID || !Types.ObjectId.isValid(blogID)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing blogID" }),
                {
                    status: 400,
                }
            );
        }
        await connectDB();

        const user= await User.findById(userID);
        if(!user){
            return new NextResponse(JSON.stringify({message:"User not found"}),
            {status: 404}
            );
        }

        const blog = await Blog.findOne({ _id: blogID, user: userID});
        if(!blog){
            return new NextResponse(JSON.stringify({message:"Blog not found"}),
            {status: 404}
            );
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogID,
            {title, description},
            {new: true}
        );

        return new NextResponse(JSON.stringify({message: "Blog updated", blog: updatedBlog}),
        {status: 200}
        );

    } catch(err:any){
        return new NextResponse("Error in updating blog" + err.message, {
            status:500,
        })
    }
}

export const DELETE = async (request: Request, context: {params:any}) => {
    const blogID = context.params.blog;
    try{
        const body = await request.json();
        const {title, description} = body;

        const {searchParams} = new URL(request.url);
        const userID = searchParams.get("userID");
        if (!userID || !Types.ObjectId.isValid(userID)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                {
                    status: 400,
                }
            );
        }
        if (!blogID || !Types.ObjectId.isValid(blogID)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing blogID" }),
                {
                    status: 400,
                }
            );
        }
        await connectDB();

        const user= await User.findById(userID);
        if(!user){
            return new NextResponse(JSON.stringify({message:"User not found"}),
            {status: 404}
            );
        }

        const blog = await Blog.findOne({ _id: blogID, user: userID});
        if(!blog){
            return new NextResponse(JSON.stringify({message:"Blog not found"}),
            {status: 404}
            );
        }
        
        await Blog.findByIdAndDelete(blogID);
        return new NextResponse(JSON.stringify({message:"Blog deleted successfully"}),
        {status:200}
        );

    } catch(err:any){
        return new NextResponse("Error in deleting blog" + err.message, {
            status:500,
        })
    }
}
