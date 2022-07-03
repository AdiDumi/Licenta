import axios from 'axios';

export function getMainObjectives(responseFunction, token, errorFunction) {
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/main', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function getSecondaryObjectives(data, responseFunction, token, errorFunction) {
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/secondary', {
        params: {
            mainObjective: data
        },
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function getTeamMainObjectives(responseFunction, token, errorFunction) {
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/team/main', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function getTeamSecondaryObjectives(data, responseFunction, token, errorFunction) {
    axios.get(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/team/secondary', {
        params: {
            mainObjective: data
        },
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function markAsDone(objective, responseFunction, token, errorFunction) {
    axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/markAsDone',
        {
            objective: objective
        },
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    ).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function editTeam(data, responseFunction, token, errorFunction) {
    axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/team/edit',
        data,
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    ).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function addMain(data, responseFunction, token, errorFunction) {
    axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/addMain',
        data,
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    ).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function addSecondary(data, responseFunction, token, errorFunction) {
    axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/addSecondary',
        data,
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    ).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}

export function editProgress(data, responseFunction, token, errorFunction) {
    axios.post(process.env.REACT_APP_BACKEND_URL + process.env.REACT_APP_BACKEND_PORT + '/objectives/editProgress',
        data,
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    ).then(response => responseFunction(response)
    ).catch(error => errorFunction(error));
}