import {
    ChatIcon,
    DashboardIcon,
    GuestUserIcon,
    HomeIcon,
    PlaylistIcon,
    RequestIcon,
    SearchIcon,
    UploadIcon
} from "@/src/shared/components/Icons/icons"
import type { NavItems } from "@shared/types/shared.types"
import { UserRole } from "@domains/users/types"

export const ALL_ROLES = Object.values(UserRole)

export const navItems: NavItems = [
    {
        href: "/music",
        icon: HomeIcon,
        label: "Inicio",
        rolAccess: ALL_ROLES
    },

    {
        href: "/music/explore",
        icon: SearchIcon,
        label: "Buscar",
        rolAccess: [UserRole.CANTAUTOR, UserRole.INTERPRETE, UserRole.INVITADO]
    },

    {
        href: "/music/my-music",
        icon: PlaylistIcon,
        label: "Mi Música",
        rolAccess: [UserRole.CANTAUTOR, UserRole.INTERPRETE, UserRole.INVITADO]

    },

    {
        href: "/app/upload",
        icon: UploadIcon,
        label: "Publicar",
        rolAccess: [UserRole.AUTOR, UserRole.CANTAUTOR],
    },

    {
        href: "/music/requests",
        icon: RequestIcon,
        label: "Solicitudes",
        rolAccess: [UserRole.AUTOR, UserRole.EDITOR],
    },

    {
        href: '/music/chat',
        icon: ChatIcon,
        label: "Chat",
        rolAccess: ALL_ROLES

    },
    {
        href: "/music/dashboard",
        icon: DashboardIcon,
        label: "Dashboard",
        rolAccess: ALL_ROLES
    },
    {
        href: "/music/guest-user",
        icon: GuestUserIcon,
        label: "Invitar Usuario",
        rolAccess: [UserRole.CANTAUTOR, UserRole.INTERPRETE],
    },
]

