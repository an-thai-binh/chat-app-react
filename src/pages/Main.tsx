import { Bars3Icon, UserPlusIcon } from '@heroicons/react/20/solid';

import { useState } from 'react'
import ProfileSidebar from '../features/profile/components/ProfileSidebar';
import FriendBox from '../features/friend/components/FriendBox';

export default function Main() {
    const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
    const [isFriendBoxOpen, setIsFriendBoxOpen] = useState<boolean>(false);

    return (
        <>
            <ProfileSidebar isDisplay={isProfileOpen} onClose={() => setIsProfileOpen(prev => !prev)} />
            <FriendBox isDisplay={isFriendBoxOpen} onClose={() => setIsFriendBoxOpen(prev => !prev)} />
            <div className='grid grid-cols-1 md:grid-cols-4 w-full min-h-screen'>
                <div className='md:col-span-1 bg-white'>
                    <div className='p-2 flex justify-center items-center'>
                        <div className='me-3'>
                            <Bars3Icon className='text-gray-800 w-6 cursor-pointer' onClick={() => setIsProfileOpen(prev => !prev)} />
                        </div>
                        <div className='flex-1'>
                            <input type='text' className='ps-3 h-8 bg-gray-200 rounded-full w-full focus:bg-white focus:outline-gray-200' placeholder='Search' />
                        </div>
                        <div className='ms-3'>
                            <UserPlusIcon className='text-gray-800 w-6 cursor-pointer' onClick={() => setIsFriendBoxOpen(prev => !prev)} />
                        </div>
                    </div>
                </div>
                <div className='hidden md:block md:col-span-3 bg-gray-500'>
                </div>
            </div>
        </>
    );
}