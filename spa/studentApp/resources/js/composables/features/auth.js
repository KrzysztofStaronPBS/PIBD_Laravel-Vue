import { ref } from 'vue'
import { useRequest } from '../core/request.js';

const savedUser = localStorage.getItem('user');
const user = ref(savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null);
const isLogged = ref(user.value ? true : false)

export function useAuth() {
    const { error, isLoading, get, post } = useRequest()

    const login = async (form) => {
        try {
            await get('/sanctum/csrf-cookie');
            await post('/api/login', form);
            const userData = await get('/api/user');
            setUserState(true, userData);
        } catch (e) {
            setUserState(false)
            console.log("Login error")
        }
    }

    const getUser = async () => {
        try {
            const userData = await get('/api/user');
            user.value = userData;
            return userData;
        } catch (e) {
            console.log("Auth user fetch error");
        }
    }

    const register = async (form) => {
        try {
            await post('/api/register', form);
            return true;
        } catch (e) {
            return false;
        }
    }

    const logout = async () => {
        try {
            await post('/api/logout');
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            setUserState(false);
        }
    }

    const setUserState = (state, payload = null) => {
        user.value = payload;
        isLogged.value = state;

        if (state && payload) {
            localStorage.setItem("user", JSON.stringify(payload));
            localStorage.setItem("isLogged", "true");
        } else {
            localStorage.removeItem("user");
            localStorage.setItem("isLogged", "false");
        }
    }

    return { user, isLogged, error, isLoading, login, logout, register, getUser, setUserState }
}
