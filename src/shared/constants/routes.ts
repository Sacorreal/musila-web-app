import { UserPlanType } from "@/src/domains/users/types/user.types"
import {
    ChatIcon,
    DashboardIcon,
    GuestUserIcon,
    HomeIcon,
    PlaylistIcon,
    RequestIcon,
    ShieldIcon,
    UploadIcon,
    UserIcon,
} from "@/src/shared/components/Icons/icons"
import type { NavItems } from "@shared/types/shared.types"

export const ALL_ROLES = Object.values(UserPlanType)

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
        rolAccess: [UserPlanType.PLAN_360, UserPlanType.PLAN_DESCUBRIDOR, UserPlanType.INVITADO]

    },

    {
        href: "/music/publicar",
        icon: UploadIcon,
        label: "Publicar",
        rolAccess: [UserPlanType.PLAN_AUTOR, UserPlanType.PLAN_360],
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
        rolAccess: [UserPlanType.PLAN_AUTOR, UserPlanType.PLAN_360, UserPlanType.ADMIN, UserPlanType.PLAN_DESCUBRIDOR]
    },
    {
        href: "/music/invitar-usuario",
        icon: GuestUserIcon,
        label: "Invitar Usuario",
        rolAccess: [UserPlanType.PLAN_360, UserPlanType.PLAN_DESCUBRIDOR],
    },
    {
        href: "/music/mi-cuenta",
        icon: UserIcon,
        label: "Mi Cuenta",
        rolAccess: [UserPlanType.PLAN_AUTOR, UserPlanType.PLAN_360, UserPlanType.PLAN_DESCUBRIDOR],
    },
    {
        href: "/admin",
        icon: ShieldIcon,
        label: "Panel Admin",
        rolAccess: [UserPlanType.ADMIN],
    }
]
