import { UserIcon, XMarkIcon } from "@heroicons/react/20/solid";
import type { UserProfile } from "../interfaces/UserProfile";
import { formatDateOnly } from "../../../utils/Formatter";

type ProfileBoxProps = {
    profile: UserProfile | null,
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
}

export default function ProfileBox({ profile, setProfile }: ProfileBoxProps) {
    return (
        <>
            {profile &&
                <div className="fixed inset-0 z-50 flex justify-center items-center min-h-screen">
                    <div className="relative w-80 min-h-fit bg-white rounded-md shadow-lg">
                        <XMarkIcon className="absolute right-0 size-4 text-gray-500 cursor-pointer" onClick={() => setProfile(null)} />
                        <div className="p-3 grid grid-cols-1 gap-2">
                            <div className="flex flex-col items-center">
                                <div className="flex justify-center items-center size-16 rounded-full bg-white shadow-lg">
                                    <UserIcon className="size-14 text-black" />
                                </div>
                                <div className="w-full break-words">
                                    <p className="line-clamp-4 text-center font-bold">{profile.username}</p>
                                </div>
                            </div>
                            <div className="w-full flex break-words">
                                <p className="font-medium">Email:</p>
                                <p className="ms-2 line-clamp-3">{profile.email}</p>
                            </div>
                            <div className="w-full flex">
                                <p className="font-medium">Gender:</p>
                                <p className="ms-2 line-clamp-3">{profile.isFemale ? "Female" : "Male"}</p>
                            </div>
                            <div className="w-full flex">
                                <p className="font-medium">Birth date:</p>
                                <p className="ms-2 line-clamp-3">{formatDateOnly(profile.birthDate)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}