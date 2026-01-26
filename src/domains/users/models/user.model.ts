import { UserRoleRegister } from '@/src/domains/users/types/user.type';

export interface User {

    id: string
    name: string
    secondName: string
    lastName: string
    secondLastName: string
    rol: UserRoleRegister
    email: string
    password: string;
    countryCode: string;
    phone: string
    typeCitizenID: string;
    citizenID: string;
    avatar: string;
    isVerified: boolean;
    biography: string;
    socialNetworks: Record<string, string>;
    tracks: string[]
    preferredGenres: string[]
    guests: string[]
    playlists: string[]
    requestSent: string[]
    isUserFree: boolean;
    repeatPassword: string
}



