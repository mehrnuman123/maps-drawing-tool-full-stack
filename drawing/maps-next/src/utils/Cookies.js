'use server';
import { cookies } from 'next/headers'

export const createCookies = (token) => {
    console.log(token, 'token');
    cookies().set('token', token, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 })
};

export const getCookies = async () => {
    const cookieStore = cookies()
    const token = cookieStore.get('token')
    return token;
}