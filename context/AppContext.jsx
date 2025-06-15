"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

export const useAppContext = ()=>{
    return useContext(AppContext)
}

export const AppContextProvider = ({children})=>{
    const {user} = useUser()
    const {getToken} = useAuth()

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    const createNewChat = async ()=>{
        try{
            if(!user) return null;
            const token = await getToken();

            const {data} = await axios.post('/api/chat/create', {}, {headers: {
                Authorization: `Bearer ${token}`
            }})

            if(data.success){
                return data.chat;
            }


        }catch(error){
            toast.error(error.message)
        }
        
    }

    const fetchUsersChats = async ()=>{
        try{
             const token = await getToken();
             const {data} = await axios.get('/api/chat/get', {}, {headers: {
                Authorization: `Bearer ${token}`
            }})
            if(data.success){
                console.log(data.data);
                setChats(data.data)

                if(data.data.length === 0){
                    const newChat = await createNewChat();
                    if(newChat){
                        setChats([newChat]);
                        setSelectedChat(newChat);
                    }
                }else{
                    data.data.sort((a, b)=> new Date(b.updateAt) - new Date(a. updateAt));

                    setSelectedChat(data.data[0]);
                    console.log(data.data[0]);
                }
            }else{
                toast.error(data.message)
            }
        }catch(error){
             toast.error(error.message)
        }
    }

    useEffect(()=>{
         if(user){
            fetchUsersChats();
         }
    }, [user])
    const value = {
        user, 
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchUsersChats,
        createNewChat,
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}