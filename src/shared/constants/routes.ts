import { UserRole } from "@/src/domains/users/types/user.types"
import {
    ChatIcon,
    DashboardIcon,
    GuestUserIcon,
    HomeIcon,
    PlaylistIcon,
    RequestIcon,
    UploadIcon
} from "@/src/shared/components/Icons/icons"
import type { NavItems } from "@shared/types/shared.types"

export const ALL_ROLES = Object.values(UserRole)

export const navItems: NavItems = [
    {
        href: "/music",
        icon: HomeIcon,
        label: "Inicio",
        rolAccess: ALL_ROLES
    },

    {
        href: "/music/mi-musica",
        icon: PlaylistIcon,
        label: "Mis Playlists",
        rolAccess: [UserRole.CANTAUTOR, UserRole.INTERPRETE, UserRole.INVITADO]

    },

    {
        href: "/music/publicar",
        icon: UploadIcon,
        label: "Publicar",
        rolAccess: [UserRole.AUTOR, UserRole.CANTAUTOR],
    },

    {
        href: '/music/chat',
        icon: ChatIcon,
        label: "Chat",
        rolAccess: ALL_ROLES

    },
    {
        href: "/music/solicitudes",
        icon: RequestIcon,
        label: "Solicitudes",
        rolAccess: ALL_ROLES
    },
    {
        href: "/music/invitar-usuario",
        icon: GuestUserIcon,
        label: "Invitar Usuario",
        rolAccess: [UserRole.CANTAUTOR, UserRole.INTERPRETE],
    },
]

