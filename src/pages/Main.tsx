import { Bars3Icon, UserIcon } from '@heroicons/react/20/solid';

import { useEffect, useState } from 'react'
import ProfileSidebar from '../features/profile/components/ProfileSidebar';
import FriendBox from '../features/friend/components/FriendBox';
import type { FriendRequest } from '../features/friend/interfaces/FriendRequest';
import { useMainHub } from '../contexts/MainHubProvider';
import { ApiEndpoints } from '../constants/endpoints';
import api from '../services/apiConfig';

export default function Main() {
    const { connection } = useMainHub();
    const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
    const [isFriendBoxOpen, setIsFriendBoxOpen] = useState<boolean>(false);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

    // Xử lý sự kiện từ Hub gửi về
    useEffect(() => {
        if (!connection) return;

        const handleSendFriendRequest = (friendRequest: FriendRequest) => {

            setFriendRequests(prev => [...prev, friendRequest]);
        }

        const handleCancelFriendRequest = (fromId: string) => {
            setFriendRequests(prev => prev.filter(request => request.user.id !== fromId));
        }

        connection.on("SendFriendRequest", handleSendFriendRequest);
        connection.on("CancelFriendRequest", handleCancelFriendRequest);

        return () => {
            connection.off("SendFriendRequest", handleSendFriendRequest);
            connection.off("CancelFriendRequest", handleCancelFriendRequest);
        }
    }, [connection]);

    // Lấy danh sách friend request
    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await api.get(ApiEndpoints.GET_FRIEND_REQUESTS);
                if (response.data.success) {
                    setFriendRequests(response.data.data);
                }
            } catch (error: any) {
                const message = error.response?.data.message || error.message;
                console.error("Fetch friend requests failed: ", message);
            }
        }
        fetchFriendRequests();
    }, []);

    return (
        <>
            <ProfileSidebar isDisplay={isProfileOpen} onClose={() => setIsProfileOpen(prev => !prev)} />
            <FriendBox
                isDisplay={isFriendBoxOpen}
                onClose={() => setIsFriendBoxOpen(prev => !prev)}
                friendRequests={friendRequests}
            />
            <div className='grid grid-cols-1 md:grid-cols-4 w-full min-h-screen'>
                <div className='md:col-span-1 bg-white'>
                    <div className='p-2 flex justify-center items-center'>
                        <div className='me-3'>
                            <Bars3Icon className='text-gray-800 w-6 cursor-pointer' onClick={() => setIsProfileOpen(prev => !prev)} />
                        </div>
                        <div className='flex-1'>
                            <input type='text' className='ps-3 h-8 bg-gray-200 rounded-full w-full focus:bg-white focus:outline-gray-200' placeholder='Search' />
                        </div>
                        <div className='ms-3 relative' onClick={() => setIsFriendBoxOpen(prev => !prev)} >
                            <UserIcon className='relative text-gray-800 w-6 cursor-pointer' />
                            {
                                friendRequests.length > 0 ?
                                    <div className='absolute right-0 top-0 w-2 h-2 font-bold bg-red-400 rounded-full cursor-pointer'></div>
                                    :
                                    <div className='absolute right-[2px] top-[-10px] w-2 h-2 font-bold cursor-pointer'>+</div>
                            }
                        </div>
                    </div>
                </div>
                <div className='hidden md:block md:col-span-3 bg-gray-500'>
                </div>
            </div>
        </>
    );
}