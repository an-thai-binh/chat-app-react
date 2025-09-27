import { XMarkIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import { useMainHub } from "../../../contexts/MainHubProvider";
import api from "../../../services/apiConfig";
import { ApiEndpoints } from "../../../constants/endpoints";
import type { UserFriendSearchResult } from "../interfaces/UserFriendSearchResult";
import _, { debounce } from "lodash";
import type { FriendRequest } from "../interfaces/FriendRequest";
import useAuth from "../../auth/hooks/useAuth";

type FriendBoxProps = {
    isDisplay: boolean,
    onClose: () => void,
    friendRequests: FriendRequest[]
}
export default function FriendBox({ isDisplay, onClose, friendRequests }: FriendBoxProps) {
    const { sub } = useAuth();
    const { connection } = useMainHub();
    const [query, setQuery] = useState<string>("");
    const [userFriendSearchResult, setUserFriendSearchResult] = useState<UserFriendSearchResult | null>(null);

    const handleCloseFriendBox = () => {
        // reset state
        setQuery("");
        setUserFriendSearchResult(null);
        onClose();
    }

    const searchUserInFriend = async (value: string) => {
        try {
            const response = await api.get(ApiEndpoints.SEARCH_USER_IN_FRIEND, {
                params: { query: value }
            });
            if (response.data.success) {
                setUserFriendSearchResult(response.data.data);
            }
        } catch (error: any) {
            const message = error.response?.data.message || error.message;
            console.error("Search user failed: ", message);
            setUserFriendSearchResult(null);
        }
    }

    const debounceSearch = useCallback(debounce((value) => searchUserInFriend(value), 450), []);

    /**
     * Xử lý sự kiện khi nhập vào khung tìm kiếm bạn bè
     * @param e onChange
     * @returns void
     */
    const handleOnSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUserFriendSearchResult(null);
        setQuery(value);
        if (!value) return;
        debounceSearch(value);
    }

    /**
     * Xử lý response gửi về từ hub
     */
    useEffect(() => {
        if (!connection) return;

        const handleSendFriendRequestStatus = (success: boolean) => {
            if (success) {
                setUserFriendSearchResult(prev => prev ? { ...prev, friendStatus: "PENDING", isSender: true } : prev);
            }
        }

        const handleCancelFriendRequestStatus = (toId: string) => {
            setUserFriendSearchResult(prev => prev && prev.id === toId ? { ...prev, friendStatus: "NONE", isSender: false } : prev);
        }

        connection.on("SendFriendRequestStatus", handleSendFriendRequestStatus);

        connection.on("CancelFriendRequestStatus", handleCancelFriendRequestStatus);

        return () => {
            connection.off("SendFriendRequestStatus", handleSendFriendRequestStatus);
            connection.off("CancelFriendRequestStatus", handleCancelFriendRequestStatus);
        }
    }, [connection])

    const sendFriendRequest = async (toId: string) => {
        if (connection) {
            try {
                await connection.send("SendFriendRequest", toId);
            } catch (error: any) {
                console.error("Error sending friend request: ", error.message);
            }
        }
    }

    const cancelFriendRequest = async (toId: string) => {
        if (connection) {
            try {
                await connection.send("CancelFriendRequest", toId);
            } catch (error: any) {
                console.error("Error cancel friend request: ", error.message);
            }
        }
    }

    const acceptFriendRequest = () => {

    }

    const declineFriendRequest = () => {

    }

    const renderSearchFriendResult = (userFriendSearchResult: UserFriendSearchResult) => {
        if (userFriendSearchResult.id === sub) {
            return <div className="px-2 bg-gray-200 rounded-md">You</div>;
        }

        switch (userFriendSearchResult.friendStatus) {
            case "NONE":
                return (
                    <button
                        onClick={() => sendFriendRequest(userFriendSearchResult.id)}
                        className="px-2 bg-gray-200 rounded-md hover:bg-gray-300"
                        type="button"
                    >
                        <span className="font-bold">+</span>Add friend
                    </button>
                );
            case "PENDING":
                if (userFriendSearchResult.isSender) {
                    return (
                        <button
                            onClick={() => cancelFriendRequest(userFriendSearchResult.id)}
                            className="px-2 bg-red-200 rounded-md hover:bg-red-300"
                            type="button"
                        >
                            Cancel request
                        </button>
                    );
                } else {
                    return (
                        <>
                            <CheckCircleIcon className="w-8 text-green-400 cursor-pointer hover:text-green-600" />
                            <XCircleIcon className="w-8 text-red-400 cursor-pointer hover:text-red-600" />
                        </>
                    );
                }
            case "FRIEND":
                return <div className="px-2 bg-gray-200 rounded-md">Friend</div>;
            default:
                return null;
        }
    }

    return (
        <>
            {isDisplay &&
                <div className="fixed inset-0 flex justify-center items-center min-h-screen bg-opacity-50">
                    <div className="relative w-96 min-h-fit bg-white rounded-md shadow-xl">
                        <XMarkIcon className="absolute right-[-1px] top-[-1px] w-5 text-gray-500 cursor-pointer" onClick={handleCloseFriendBox} />
                        <div className="p-4">
                            <input value={query} onChange={(e) => handleOnSearchInputChange(e)} type="text" className="p-2 w-full bg-gray-200 rounded-md outline-gray-400 focus:bg-white" placeholder="Type username..."></input>
                            {userFriendSearchResult ?
                                <div className="mt-3 px-2 flex justify-center">
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-medium">{userFriendSearchResult.username}</p>
                                    </div>
                                    {renderSearchFriendResult(userFriendSearchResult)}
                                </div>
                                :
                                <>
                                    {!query ?
                                        <div className="mt-3 px-2">
                                            <p className="">Friend requests</p>
                                            {friendRequests.length > 0 ?
                                                friendRequests.map((request) => {
                                                    return (
                                                        <div className="my-1 flex justify-center" key={request.id}>
                                                            <div className="flex-1 overflow-hidden">
                                                                <p className="font-medium">{request.user.username}</p>
                                                            </div>
                                                            <CheckCircleIcon className="w-8 text-green-400 cursor-pointer hover:text-green-600" />
                                                            <XCircleIcon className="w-8 text-red-400 cursor-pointer hover:text-red-600" />
                                                        </div>
                                                    )
                                                })
                                                :
                                                <p className="text-center text-gray-500">You don't have any request</p>
                                            }
                                        </div>
                                        :
                                        <div className="mt-3 flex justify-center">
                                            <p>User not found</p>
                                        </div>
                                    }
                                </>
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    );
}