'use client'
import { AuthenticatedUser } from '@/utils/ApiService';
import { useEffect, useState } from 'react';
import LoginModal from './login/page';
import RegisterModal from './register/page';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenRegister, setIsOpenRegister] = useState(false)

  const openModal = () => setIsModalOpen(true);
  const openRegisterModal = () => setIsOpenRegister(true)
  const closeModal = () => { setIsModalOpen(false), setIsOpenRegister(false); }

  useEffect(() => {
    const logedInUser = async () => {
      try {
        const user = await AuthenticatedUser()
        if (user) router.push('/map');
      }
      catch (e) {
        console.log(e);
      }

    }
    logedInUser()
  }, [])

  return (
    <div className='landing-page'>
      <div className='button-container'>
        <button className='auth-button' onClick={openModal}>Login</button>
        <button className='auth-button' onClick={openRegisterModal}>Register</button>
      </div>
      {isModalOpen && <LoginModal onClose={closeModal} />}
      {isOpenRegister && <RegisterModal onClose={closeModal} />}
    </div>
  );
}
