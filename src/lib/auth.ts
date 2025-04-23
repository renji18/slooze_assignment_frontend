import api from "@/lib/axios";

export async function getCurrentUser() {
    try {
        const res = await api.get('/user/me');
        return res.data;
    } catch (err: unknown) {
        console.log(err)
        return null;
    }
}

export async function logout() {
    try {
        await api.post('/auth/logout');
    } catch (err: unknown) {
        console.log(err)
        return null;
    }
}