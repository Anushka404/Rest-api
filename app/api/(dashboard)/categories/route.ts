import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/modals/user"
import Category from "@/lib/modals/categories";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
    try {
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
        await connectDB();
        const user = await User.findById(userID);

        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "user not found in db" }),
                {
                    status: 400,
                }
            );
        }
        const categories = await Category.find({ user: new Types.ObjectId(userID) });

        return new NextResponse(
             JSON.stringify(categories),
                {
                    status: 200,
                }
        )

    } catch (error: any) {
        return new NextResponse("Error in fetching categories" + error.message, {
               status: 500,
          });
    }
}

export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userID = searchParams.get("userID");
        
        const { title } = await request.json();
        if (!userID || !Types.ObjectId.isValid(userID)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
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

        const newCategory = new Category({
            title,
            user: new Types.ObjectId(userID),
        });

        await newCategory.save();
        return new NextResponse(
            JSON.stringify({ message: "category created", category: newCategory }),
            { status: 200 }
        );

    } catch (error: any) {
        return new NextResponse("Error in creating category" + error.message, {
               status: 500,
          });
    }
}