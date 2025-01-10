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
} from "@/components/ui/sidebar"
import { useState } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "@/redix/store";

// Menu items.
const items = [
  {
    title: "DeepSeek",
    url: "#",
    icon: Home,
  },
  {
    title: "Gpt-4o",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Gpt-4o-mini",
    url: "#",
    icon: Calendar,
  },
]

export function AppSidebar() {
  const value = useSelector((state: RootState) => state.example.value);
  const dispatch = useDispatch();

  const [currentModel, setCurrentModel] = useState('DeepSeek');

  const handleModelChange = (model: string) => {
    setCurrentModel(model);
    dispatch({ type: 'INCREMENT', payload: 22 })
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>模型选择{value}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className={` ${
                  item.title === currentModel
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
