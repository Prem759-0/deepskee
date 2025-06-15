import Message from "@/components/Message";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Messages } from "openai/resources/chat/completions";

export async function POST(req){
    try{
       const {userId} = getAuth(req)

       if(!userId){
          return NextResponse.json({success:false, Message: "User not authenticated", })
       }

       const chatData = {
        userId,
        messages: [],
        name: "New Chat",
       };

       await connectDB();
       const chat = await Chat.create(chatData);

       return NextResponse.json({success: true, chat})


    }catch(error){
         return NextResponse.json({success: false, error: error.message});
    }
}