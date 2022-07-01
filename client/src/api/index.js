import axios from 'axios';
import {useToken} from '../useToken';
import {useNavigate} from "react-router-dom";

export function GetFeedbacks(setFeedbacks, setLoading) {
    const { token, setToken, deleteToken } = useToken();
    const navigate = useNavigate();
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/recv', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        setFeedbacks(response.data);
        setLoading(false);
    }).catch(error => {
        if(error.response.data.error === 'Authentification failed. Check secret token.') {
            deleteToken();
            navigate("/");
        }
    });
}
