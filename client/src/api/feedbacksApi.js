import axios from 'axios';

export function getFeedbacks(setFeedbacks, setLoading, token, deleteToken, errorFunction) {
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/recv', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        setFeedbacks(response.data);
        setLoading(false);
    }).catch(error => errorFunction(error));
}
