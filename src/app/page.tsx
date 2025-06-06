'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button"
import ChatDialog from "@/components/ChatDialog";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ToastContainer, toast } from 'react-toastify';


export default function Home() {
  return (
    <div className="flex h-full">
      <ChatDialog />
      <ToastContainer />
    </div>
  );
}
