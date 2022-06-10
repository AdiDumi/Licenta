import { useStateWithCallbackLazy } from 'use-state-with-callback';

export function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken?.accessToken;
    };

    const [token, setToken] = useStateWithCallbackLazy(getToken());

    const saveToken = userToken => {
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.accessToken, null);
    };

    const deleteToken = () => {
        localStorage.removeItem('token');
        setToken(null, null);
    }

    return {
        setToken: saveToken,
        token,
        deleteToken: deleteToken
    }
}