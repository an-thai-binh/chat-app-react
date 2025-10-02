import { ChatBubbleLeftEllipsisIcon, UserMinusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import type { UserFriend } from "../interfaces/UserFriend";
import useAuth from "../../auth/hooks/useAuth";
import { ApiEndpoints } from "../../../constants/endpoints";
import api from "../../../services/apiConfig";
import ConfirmDialog from "../../app/components/ConfirmDialog";

type FriendListBoxProps = {
    onClose: () => void
}

export default function FriendListBox({ onClose }: FriendListBoxProps) {
    const { sub } = useAuth();
    const [userFriends, setUserFriends] = useState<UserFriend[]>([]);
    const [displayFriends, setDisplayFriends] = useState<UserFriend[]>([]);
    const [query, setQuery] = useState<string>("");
    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>("");

    useEffect(() => {
        if (!sub) return;
        const fetchUserFriends = async () => {
            try {
                const response = await api.get(ApiEndpoints.GET_USER_FRIENDS + "/" + sub);
                if (response.data.success) {
                    const data = response.data.data;
                    setUserFriends(data);
                    setDisplayFriends(data);
                }
            } catch (error: any) {
                const message = error.response?.data.message || error.message;
                console.error("Fetch user friends failed: " + message);
            }
        }
        fetchUserFriends();
    }, [sub]);

    const handleOnQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const str = e.target.value;
        setQuery(str);
        if (str === "") {
            setDisplayFriends(userFriends);
        }
    }

    const handleSearchByUsername = () => {
        setDisplayFriends(userFriends.filter(friend => friend.username.includes(query)));
    }

    const handleOnClickDeleteBtn = (friendId: string) => {
        setDeleteId(friendId);
        setConfirmDialogOpen(true);
    }

    const handleDeleteFriendship = async (friendId: string) => {
        try {
            const response = await api.delete(`${ApiEndpoints.DELETE_FRIENDSHIP}/${sub}?friendId=${friendId}`);
            if (response.data.success) {
                setUserFriends(prev => prev.filter(friend => friend.id !== friendId));
                setDisplayFriends(prev => prev.filter(friend => friend.id !== friendId));
            }
        } catch (error: any) {
            const message = error.response?.data.message || error.message;
            console.error("Delete friendship failed: " + message);
        }
    }

    return (
        <>
            <div className="fixed inset-0 z-40 flex justify-center items-center min-h-screen">
                <div className="relative w-[420px] md:w-[600px] h-[400px] bg-white rounded-md shadow-md">
                    <XMarkIcon className="absolute right-[-1px] top-[-1px] w-5 text-gray-500 cursor-pointer" onClick={() => onClose()} />
                    <div className="p-2">
                        <p className="text-center font-bold text-xl">Friends</p>
                        <div className="flex items-center">
                            <input type="text" value={query} onChange={(e) => handleOnQueryChange(e)} className="flex-1 px-2 py-1 bg-gray-200 rounded-s-md outline-none" placeholder="Type username here to find your friend" />
                            <button onClick={handleSearchByUsername} className="my-2 px-2 py-1 bg-gray-200 border-s border-white rounded-e-md font-medium" type="button">Search</button>
                        </div>
                        {displayFriends.length > 0 ?
                            <div className="grid grid-cols-2 max-h-[310px] overflow-y-scroll">
                                {displayFriends.map((friend) => {
                                    return (
                                        <div key={friend.id} className="p-2 basis-1/2 max-h-fit flex items-center hover:bg-gray-100 gap-0">
                                            <div className="flex-1 overflow-hidden">
                                                <p className="font-medium">{friend.username}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <ChatBubbleLeftEllipsisIcon className="size-5 hover:text-blue-400 cursor-pointer" />
                                                <UserMinusIcon className="ms-2 size-5 hover:text-red-500 cursor-pointer" onClick={() => handleOnClickDeleteBtn(friend.id)} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            :
                            <p className="text-center">No results found</p>
                        }
                    </div>
                </div>
            </div>
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(prev => !prev)}
                onConfirm={() => handleDeleteFriendship(deleteId)}
            />
        </>

    );
}