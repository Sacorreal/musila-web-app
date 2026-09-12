import { ADMIN_PLAN_TYPES, UserPlanType } from "@/src/domains/users/types/user.types"
import {
    ActivityIcon,
    ChatIcon,
    DashboardIcon,
    GuestUserIcon,
    HomeIcon,
    MegaphoneIcon,
    PlaylistIcon,
    RequestIcon,
    ShieldIcon,
    UploadIcon,
    WalletIcon,
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
        href: "/music/dashboard",
        icon: DashboardIcon,
        label: "Dashboard",
        rolAccess: [UserPlanType.PLAN_AUTOR, UserPlanType.PLAN_360],
    },

    {
        href: "/music/editorial-command-center",
        icon: ActivityIcon,
        label: "Health Score",
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
        rolAccess: [UserPlanType.PLAN_AUTOR, UserPlanType.PLAN_360, ...ADMIN_PLAN_TYPES, UserPlanType.PLAN_DESCUBRIDOR]
    },
    {
        href: "/music/mis-campanas",
        icon: MegaphoneIcon,
        label: "Mis Campañas",
        rolAccess: [UserPlanType.PLAN_360, UserPlanType.PLAN_DESCUBRIDOR, UserPlanType.INVITADO]
    },
    // {
    //     href: "/music/expedientes",
    //     icon: ExpedienteIcon,
    //     label: "Expedientes",
    //     rolAccess: [UserPlanType.PLAN_AUTOR, UserPlanType.PLAN_360, ...ADMIN_PLAN_TYPES]
    // },
    {
        href: "/music/invitar-usuario",
        icon: GuestUserIcon,
        label: "Invitar Usuario",
        rolAccess: [UserPlanType.PLAN_360, UserPlanType.PLAN_DESCUBRIDOR],
    },
    {
        href: "/music/wallet",
        icon: WalletIcon,
        label: "Wallet",
        rolAccess: [UserPlanType.PLAN_AUTOR, UserPlanType.PLAN_360, UserPlanType.PLAN_DESCUBRIDOR],
    },
    {
        href: "/admin",
        icon: ShieldIcon,
        label: "Panel Admin",
        rolAccess: ADMIN_PLAN_TYPES,
    }
]
