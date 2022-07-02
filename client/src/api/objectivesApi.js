import axios from 'axios';

export function getMainObjectives(setObjectives, setLoading, token, deleteToken, errorFunction) {
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/main', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        setObjectives(response.data);
        setLoading(false);
    }).catch(error => errorFunction(error));
}