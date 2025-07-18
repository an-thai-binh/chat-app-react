import { ArrowLeftStartOnRectangleIcon, Cog6ToothIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

type ProfileSidebarProps = {
    isDisplay: boolean,
    onClose: () => void;
}

export default function ProfileSidebar({ isDisplay, onClose }: ProfileSidebarProps) {
    return (
        <AnimatePresence>
            {isDisplay &&
                <motion.div
                    className='fixed inset-0 min-h-screen bg-black bg-opacity-50'
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
                            <div className='py-2 flex justify-center items-center hover:bg-gray-100 cursor-pointer'>
                                <div className='px-3'>
                                    <UserCircleIcon className='w-8 text-black' />
                                </div>
                                <div className='flex-1 font-bold'>
                                    My Profile
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
                            <div className='py-2 flex justify-center items-center hover:bg-gray-100 cursor-pointer'>
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