import type { User } from "../../auth/interfaces/User";

export interface FriendRequest {
    id: string,
    user: User,
    friend: User,
    status: string,
    createdAt: string
}