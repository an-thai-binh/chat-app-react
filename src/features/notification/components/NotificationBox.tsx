import { ApiEndpoints } from "../../../constants/endpoints";
import api from "../../../services/apiConfig";
import { formatTimeAgo } from "../../../utils/Formatter";
import type { Notification } from "../interfaces/Notification";

type NotificationBoxProps = {
    notifications: Notification[],
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
}

export default function NotificationBox({ notifications, setNotifications }: NotificationBoxProps) {

    const handleMaskAsRead = async () => {
        try {
            const response = await api.post(ApiEndpoints.MASK_AS_READ, {});
            if (response.data.success) {
                setNotifications(prev =>
                    prev.map(n => !n.isRead ? { ...n, isRead: true } : n)
                );
            }
        } catch (error: any) {
            const message = error.response?.data.message || error.message;
            console.error("Mask as read notifications failed: " + message);
        }
    }

    return (
        <div className='py-2 w-full min-h-fit bg-white rounded-md shadow-lg'>
            <div className='px-2 pb-2 flex justify-between items-center'>
                <strong>Notification</strong>
                <p className='hover:underline cursor-pointer' onClick={handleMaskAsRead}>Mark as read</p>
            </div>
            <hr className='px-2 ' />
            <div className='max-h-64 overflow-y-scroll'>
                {notifications.length > 0 ?
                    <>
                        {notifications.map((n) => {
                            return (
                                <div className='px-2 hover:bg-gray-200 cursor-pointer' key={n.id}>
                                    <div dangerouslySetInnerHTML={{ __html: n.content }} />
                                    <p className="text-sm text-end">{formatTimeAgo(n.createdAt)}</p>
                                </div>
                            );
                        })}
                    </>
                    :
                    <div className="my-3 text-center">You don't have any notifications</div>
                }
            </div>
        </div>
    );
}