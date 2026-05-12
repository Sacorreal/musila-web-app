"use client"

import { Bell, Check, CheckCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useNotificationsStore, Notification } from "../store/use-notifications-store"
import { useNotificationsSocket } from "../hooks/use-notifications-socket"
import { Button } from "@/src/shared/components/UI/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/src/shared/components/UI/dropdown-menu"
import { cn } from "@/src/shared/libs/cn"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export function NotificationMenu() {
  // Inicializamos el socket y cargamos notificaciones al montar
  useNotificationsSocket();

  const router = useRouter()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationsStore()

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Bell className="h-5 w-5 transition-transform group-hover:scale-110" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[min(calc(100vw-1rem),24rem)] max-h-[85vh] flex flex-col p-0 overflow-hidden border border-border shadow-2xl rounded-xl">
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
          <DropdownMenuLabel className="font-bold text-base p-0">Notificaciones</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead()}
              className="h-auto p-1 text-xs font-medium text-muted-foreground hover:text-primary gap-1"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Marcar todas leídas
            </Button>
          )}
        </div>
        
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Bell className="h-8 w-8 opacity-20" />
              <p className="text-sm font-medium">No tienes notificaciones</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div key={notification.id} className="relative">
                  <DropdownMenuItem
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "flex flex-col items-start gap-1 p-4 cursor-pointer transition-colors focus:bg-accent",
                      !notification.isRead ? "bg-primary/5" : ""
                    )}
                  >
                    <div className="flex items-start justify-between w-full gap-2">
                      <span className={cn(
                        "text-sm leading-tight",
                        !notification.isRead ? "font-bold text-foreground" : "font-medium text-foreground/80"
                      )}>
                        {notification.title}
                      </span>
                      {!notification.isRead && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1" />
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <span className="text-[10px] text-muted-foreground/60 mt-1 font-medium">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="m-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
