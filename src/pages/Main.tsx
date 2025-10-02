import { Bars3Icon, BellIcon, UserIcon } from '@heroicons/react/20/solid';

import { useEffect, useRef, useState } from 'react'
import ProfileSidebar from '../features/profile/components/ProfileSidebar';
import FriendBox from '../features/friend/components/FriendBox';
import type { FriendRequest } from '../features/friend/interfaces/FriendRequest';
import { useMainHub } from '../contexts/MainHubProvider';
import { ApiEndpoints } from '../constants/endpoints';
import api from '../services/apiConfig';
import NotificationBox from '../features/notification/components/NotificationBox';
import { useClickAway } from 'react-use';
import type { Notification } from '../features/notification/interfaces/Notification';
import ProfileBox from '../features/profile/components/ProfileBox';
import FriendListBox from '../features/friend/components/FriendListBox';

export default function Main() {
    const { connection } = useMainHub();
    const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
    const [isFriendBoxOpen, setIsFriendBoxOpen] = useState<boolean>(false);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [isNotificationBoxOpen, setIsNotificationBoxOpen] = useState<boolean>(false);
    const notificationBoxRef = useRef(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isProfileBoxOpen, setIsProfileBoxOpen] = useState<boolean>(false);
    const [isFriendListBoxOpen, setIsFriendListBoxOpen] = useState<boolean>(false);

    // Xử lý sự kiện từ Hub gửi về
    useEffect(() => {
        if (!connection) return;

        const handleSendFriendRequest = (friendRequest: FriendRequest) => {

            setFriendRequests(prev => [...prev, friendRequest]);
        }

        const handleCancelFriendRequest = (fromId: string) => {
            setFriendRequests(prev => prev.filter(request => request.user.id !== fromId));
        }

        const handleAcceptFriendRequest = (notification: Notification) => {
            setNotifications(prev => [...prev, notification]);
        }

        const handleAcceptFriendRequestStatus = (fromId: string) => {
            setFriendRequests(prev => prev.filter(request => request.user.id !== fromId));
        }

        const handleDeclineFriendRequestStatus = (fromId: string) => {
            setFriendRequests(prev => prev.filter(request => request.user.id !== fromId));
        }

        connection.on("SendFriendRequest", handleSendFriendRequest);
        connection.on("CancelFriendRequest", handleCancelFriendRequest);
        connection.on("AcceptFriendRequest", handleAcceptFriendRequest);
        connection.on("AcceptFriendRequestStatus", handleAcceptFriendRequestStatus);
        connection.on("DeclineFriendRequestStatus", handleDeclineFriendRequestStatus);

        return () => {
            connection.off("SendFriendRequest", handleSendFriendRequest);
            connection.off("CancelFriendRequest", handleCancelFriendRequest);
            connection.off("AcceptFriendRequest", handleAcceptFriendRequest);
            connection.off("AcceptFriendRequestStatus", handleAcceptFriendRequestStatus);
            connection.off("DeclineFriendRequestStatus", handleDeclineFriendRequestStatus);
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

    // Đóng cửa sổ thông báo khi click vào khu vực bên ngoài
    useClickAway(notificationBoxRef, () => {
        setIsNotificationBoxOpen(false);
    });

    // Lấy danh sách notification
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get(ApiEndpoints.GET_LATEST_NOTIFICATIONS);
                if (response.data.success) {
                    setNotifications(response.data.data);
                }
            } catch (error: any) {
                const message = error.response?.data.message || error.message;
                console.error("Fetch notifications failed: ", message);
            }
        }
        fetchNotifications();
    }, [])

    return (
        <>
            <ProfileSidebar
                isDisplay={isSideBarOpen}
                onClose={() => setIsSideBarOpen(prev => !prev)}
                setIsProfileBoxOpen={setIsProfileBoxOpen}
                setIsFriendListBoxOpen={setIsFriendListBoxOpen}
            />
            <FriendBox
                isDisplay={isFriendBoxOpen}
                onClose={() => setIsFriendBoxOpen(prev => !prev)}
                friendRequests={friendRequests}
            />
            {isProfileBoxOpen &&
                <ProfileBox
                    onClose={() => setIsProfileBoxOpen(prev => !prev)}
                />
            }
            {isFriendListBoxOpen &&
                <FriendListBox
                    onClose={() => setIsFriendListBoxOpen(prev => !prev)}
                />
            }
            <div className='grid grid-cols-1 md:grid-cols-4 w-full min-h-screen'>
                <div className='md:col-span-1 bg-white'>
                    <div className='p-2 flex justify-center items-center'>
                        <div className='me-3'>
                            <Bars3Icon className='text-gray-800 w-6 cursor-pointer' onClick={() => setIsSideBarOpen(prev => !prev)} />
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
                        <div className='ms-3 relative' ref={notificationBoxRef} >
                            <BellIcon className='relative text-gray-800 w-6 cursor-pointer' onClick={() => setIsNotificationBoxOpen(prev => !prev)} />
                            {notifications.filter(n => n.isRead == false).length > 0 &&
                                <div className='absolute right-0 top-0 w-2 h-2 font-bold bg-red-400 rounded-full cursor-pointer'></div>
                            }
                            {isNotificationBoxOpen &&
                                <div className='absolute top-[100%] right-0 md:left-[-120px] w-[300px]'>
                                    <NotificationBox notifications={notifications} setNotifications={setNotifications} />
                                </div>
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