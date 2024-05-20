'use client';
import { registerUser } from '@/utils/ApiService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../modal.module.css';


export default function RegisterModal({ onClose, isAuth }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({})
    const router = useRouter();

    const validate = () => {
        const errors = {};
        if (!username) errors.username = 'Username is required';
        if (!password) errors.password = 'Password is required';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false)
        setErrors({})
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        }
        try {
            await registerUser(username, password)
            setSuccess({message: 'User Registered'})
            router.push('/login')
        }
        catch (e) {
            setErrors({ message: e.response?.data?.username[0] })
        }

    };
    
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={errors.username ? styles.error : ''}
                        />
                        {errors.username && <p className={styles.errorMessage}>{errors.username}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? styles.error : ''}
                        />
                        {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}

                        {errors.message && <p className={styles.errorMessage}>{errors.message}</p>}
                        {success.message && <p className={styles.successMessage}>{success.message}</p>}
                    </div>
                    <button type="submit" disabled={!username || !password}>Register</button>
                    <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
