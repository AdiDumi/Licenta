import axios from 'axios';

export function getReceivedFeedbacks(responseFunction, token, errorFunction) {
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/recv', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function getSentFeedbacks(responseFunction, token, errorFunction) {
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/sent', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function getTeamFeedbacks(responseFunction, token, errorFunction) {
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/team', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function markFeedbackAsLiked(data, responseFunction, token, errorFunction) {
    axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/markAsLiked',
        {
            _id: data
        },
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    ).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function markFeedbackAsSeen(data, responseFunction, token, errorFunction) {
    axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/markAsSeen',
        {
            _id: data
        },
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    ).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function addFeedback(data, responseFunction, token, errorFunction) {
    axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/feedback/add',
        data,
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    ).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}
