import { ArrowLeftStartOnRectangleIcon, Cog6ToothIcon, UserCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/apiConfig';
import { ApiEndpoints } from '../../../constants/endpoints';
import { getAccessToken, setAccessToken, setRefreshToken } from '../../../utils/localStorageUtils';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../interfaces/UserProfile';
import useAuth from '../../auth/hooks/useAuth';

type ProfileSidebarProps = {
    isDisplay: boolean,
    onClose: () => void;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
}

export default function ProfileSidebar({ isDisplay, onClose, setProfile }: ProfileSidebarProps) {
    const navigate = useNavigate();
    const { sub } = useAuth();

    const onClickMyProfile = async () => {
        try {
            const response = await api.get(ApiEndpoints.GET_USER_PROFILE + "/" + sub);
            if (response.data.success) {
                setProfile(response.data.data);
                onClose();
            }
        } catch (error: any) {
            const message = error.response?.data.message || error.message;
            console.error("Fetch user profile error: " + message);
        }
    }

    const onClickLogout = async () => {
        try {
            const token = getAccessToken();
            setAccessToken("");
            setRefreshToken("");
            navigate("/login");
            await api.post(ApiEndpoints.LOGOUT, {
                token
            });
        } catch (error: any) {
            const message = error.response?.data.message || error.message;
            console.error("Logout Error:", message);
        }
    }

    return (
        <AnimatePresence>
            {isDisplay &&
                <motion.div
                    className='fixed inset-0 z-50 min-h-screen bg-black bg-opacity-50'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className='bg-white w-3/4 md:w-2/12 h-full'
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='grid grid-cols-1'>
                            <div className='py-2 flex justify-center items-center hover:bg-gray-100 cursor-pointer' onClick={onClickMyProfile}>
                                <div className='px-3'>
                                    <UserCircleIcon className='w-8 text-black' />
                                </div>
                                <div className='flex-1 font-bold'>
                                    My Profile
                                </div>
                            </div>
                            <div className='py-2 flex justify-center items-center hover:bg-gray-100 cursor-pointer'>
                                <div className='px-3'>
                                    <UserGroupIcon className='w-8 text-black' />
                                </div>
                                <div className='flex-1 font-bold'>
                                    Friends
                                </div>
                            </div>
                            <div className='py-2 flex justify-center items-center hover:bg-gray-100 cursor-pointer'>
                                <div className='px-3'>
                                    <Cog6ToothIcon className='w-8 text-black' />
                                </div>
                                <div className='flex-1 font-bold'>
                                    Settings
                                </div>
                            </div>
                            <div className='py-2 flex justify-center items-center hover:bg-gray-100 cursor-pointer' onClick={onClickLogout}>
                                <div className='px-3'>
                                    <ArrowLeftStartOnRectangleIcon className='w-8 text-black' />
                                </div>
                                <div className='flex-1 font-bold'>
                                    Logout
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    );
}