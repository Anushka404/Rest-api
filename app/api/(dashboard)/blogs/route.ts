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
        const searchKeywords = searchParams.get("keywords") as string;
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

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

        if(searchKeywords){
            filter.$or =[ // or means search keyword can be in title or description
                {
                    title: {$regex: searchKeywords, $options: "i"}, // i means case insestive
                },
                {
                    description: {$regex: searchKeywords, $options: "i"},
                }

            ]
        }

        if(startDate && endDate){
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            }
        }
        else if(startDate){
            filter.createdAt ={
                $gte: new Date(startDate),
            }
        }
        else if(endDate){
            filter.createdAt ={
                $lte:new Date(endDate),
            }
        }

        const blogs =await Blog.find(filter);

        return new NextResponse(JSON.stringify({blogs}),{status:200});

    } catch(err:any){
        return new NextResponse("Error in updating category" + err.message, {
            status: 500,
       });
    }
}

export const POST = async (request: Request) => {
    try{
        const {searchParams} = new URL(request.url);
        const userID = searchParams.get("userID");
        const categoryID = searchParams.get("categoryID");

        const body= await request.json();
        const {title, description} = body;

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

        const newBlog = new Blog({
            title,
            description,
            user: new Types.ObjectId(userID),
            category: new Types.ObjectId(categoryID),
        });

        await newBlog.save();
        return new NextResponse(
            JSON.stringify({message:"Blog is created Successfully", blog: newBlog }),
            {status:200}
            );

    } catch(err:any){
        return new NextResponse("Error in creating blogs" + err.message, {
            status:500,
        })
    }
}

