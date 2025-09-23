import { XMarkIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import { useMainHub } from "../../../contexts/MainHubProvider";
import api from "../../../services/apiConfig";
import { ApiEndpoints } from "../../../constants/endpoints";
import type { UserFriendSearchResult } from "../interfaces/UserFriendSearchResult";

type FriendBoxProps = {
    isDisplay: boolean,
    onClose: () => void
}
export default function FriendBox({ isDisplay, onClose }: FriendBoxProps) {
    const { connection } = useMainHub();
    const [friendRequest, setFriendRequests] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [queryError, setQueryError] = useState<string>("");
    const [userFriendSearchResult, setUserFriendSearchResult] = useState<UserFriendSearchResult | null>(null);

    useEffect(() => {
        if (!connection) return;
        // event list

        return () => {
            // connection.off();
        }
    }, [connection])

    const handleSearchUsername = useCallback(() => {
        let timer: any;

        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setQuery(value);

            clearTimeout(timer);
            timer = setTimeout(async () => {
                if (value) {
                    try {
                        const response = await api.get(ApiEndpoints.SEARCH_USER_IN_FRIEND);
                        if (response.data.success) {
                            setUserFriendSearchResult(response.data.data);
                        }
                    } catch (error: any) {
                        const message = error.response?.data.message || error.message;
                        console.error("Search user failed: ", message);
                        setQueryError("User not found");
                    }
                }
            }, 500);
        };
    }, [])();

    const sendFriendRequest = () => {

    }

    const cancelFriendRequest = () => {

    }

    const acceptFriendRequest = () => {

    }

    const declineFriendRequest = () => {

    }

    return (
        <>
            {isDisplay &&
                <div className="fixed inset-0 flex justify-center items-center min-h-screen bg-opacity-50">
                    <div className="relative w-96 min-h-fit bg-white rounded-md shadow-xl">
                        <XMarkIcon className="absolute right-[-1px] top-[-1px] w-5 text-gray-500 cursor-pointer" onClick={() => onClose()} />
                        <div className="p-4">
                            <input type="text" className="p-2 w-full bg-gray-200 rounded-md outline-gray-400 focus:bg-white" placeholder="Type username..."></input>
                            <p className="mt-3">Friend requests</p>
                            <div className="">
                                {/* <div className="my-1 flex justify-center">
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-medium">binhan0607</p>
                                    </div>
                                    <CheckCircleIcon className="w-8 text-green-400 cursor-pointer hover:text-green-600" />
                                    <XCircleIcon className="w-8 text-red-400 cursor-pointer hover:text-red-600" />
                                </div>
                                <div className="my-1 flex justify-center">
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-medium">binhan0607</p>
                                    </div>
                                    <CheckCircleIcon className="w-8 text-green-400 cursor-pointer hover:text-green-600" />
                                    <XCircleIcon className="w-8 text-red-400 cursor-pointer hover:text-red-600" />
                                </div> */}
                            </div>
                            <p className="text-center text-gray-500">You don't have any request</p>
                            {/* <div className="my-1 flex justify-center">
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-medium">binhan0607</p>
                                </div>
                                <div className="px-3 bg-gray-200 rounded-2xl text-gray-500 hover:bg-gray-300 hover:text-gray-600 cursor-pointer">
                                    <p>Add friend</p>
                                </div>
                                <div className="px-3 bg-red-400 rounded-2xl text-white hover:bg-red-500 hover:text-red-100 cursor-pointer">
                                    <p>Cancel request</p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            }
        </>
    );
}