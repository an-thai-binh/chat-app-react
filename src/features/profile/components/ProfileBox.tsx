import { UserIcon, XMarkIcon } from "@heroicons/react/20/solid";
import type { UserProfile } from "../interfaces/UserProfile";
import { formatDateOnly } from "../../../utils/Formatter";
import { useEffect, useState } from "react";
import useAuth from "../../auth/hooks/useAuth";
import { ApiEndpoints } from "../../../constants/endpoints";
import api from "../../../services/apiConfig";

type ProfileBoxProps = {
    onClose: () => void
}

export default function ProfileBox({ onClose }: ProfileBoxProps) {
    const { sub } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (!sub) return;
        const fetchUserProfile = async () => {
            try {
                const response = await api.get(ApiEndpoints.GET_USER_PROFILE + "/" + sub);
                if (response.data.success) {
                    setUserProfile(response.data.data);
                }
            } catch (error: any) {
                const message = error.response?.data.message || error.message;
                console.error("Fetch user profile error: " + message);
            }
        }
        fetchUserProfile();
    }, [sub]);

    return (
        <>
            {userProfile &&
                <div className="fixed inset-0 z-50 flex justify-center items-center min-h-screen">
                    <div className="relative w-80 min-h-fit bg-white rounded-md shadow-lg">
                        <XMarkIcon className="absolute right-0 size-4 text-gray-500 cursor-pointer" onClick={() => onClose()} />
                        <div className="p-3 grid grid-cols-1 gap-2">
                            <div className="flex flex-col items-center">
                                <div className="flex justify-center items-center size-16 rounded-full bg-white shadow-lg">
                                    <UserIcon className="size-14 text-black" />
                                </div>
                                <div className="w-full break-words">
                                    <p className="line-clamp-4 text-center font-bold">{userProfile.username}</p>
                                </div>
                            </div>
                            <div className="w-full flex break-words">
                                <p className="font-medium">Email:</p>
                                <p className="ms-2 line-clamp-3">{userProfile.email}</p>
                            </div>
                            <div className="w-full flex">
                                <p className="font-medium">Gender:</p>
                                <p className="ms-2 line-clamp-3">{userProfile.isFemale ? "Female" : "Male"}</p>
                            </div>
                            <div className="w-full flex">
                                <p className="font-medium">Birth date:</p>
                                <p className="ms-2 line-clamp-3">{formatDateOnly(userProfile.birthDate)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}