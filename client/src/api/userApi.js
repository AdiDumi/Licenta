import axios from 'axios';

export function getUserInfo(responseFunction, token, errorFunction) {
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/user', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function getTeam(data, responseFunction, token, errorFunction) {
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/teamUsers', {
        params: {
            username: data
        },
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function getOthers(data, responseFunction, token, errorFunction) {
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/otherUsers', {
        params: {
            username: data
        },
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function getManager(responseFunction, token, errorFunction) {
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/manager', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}