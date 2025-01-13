'use client'
import { Calendar, Home, Inbox } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useState } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { setModel } from "@/redux/myAppSlice";
import { Bounce, toast } from "react-toastify";
import { RootState } from "@/redux/store";

// Menu items.
const items = [
  {
    title: "deepseek-chat",
    url: "#",
    icon: Home,
  },
  {
    title: "gpt-4o",
    url: "#",
    icon: Inbox,
  },
  {
    title: "gpt-4o-mini",
    url: "#",
    icon: Calendar,
  },
]

const notify = () => toast.success('The model has been switched.!', {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
});


export function AppSidebar() {

  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  const myApp = useSelector((state: RootState) => state.myApp);

  const dispatch = useDispatch();

  const [currentModel, setCurrentModel] = useState('deepseek-chat');

  const handleModelChange = (str: string) => {
    setCurrentModel(str);
    dispatch(setModel(str))
    notify();
    if (state === "expanded" && isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Model Selection ({myApp.model})</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className={` ${item.title === currentModel
                  ? 'bg-gray-200 font-bold text-black' // 选中态样式
                  : 'text-gray-700 hover:bg-gray-100' // 默认态样式
                  }`} onClick={() => handleModelChange(item.title)}>
                  <SidebarMenuButton asChild>
                    <div className="cursor-pointer">
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
