const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001'

const headers = {
    'Accept': 'application/json'
};

export const doLogin = (payload) =>
    fetch(`${api}/login`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        console.log(res);
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const doSignup = (payload) =>
    fetch(`${api}/signup`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        console.log("API.js - doSignup - " + res);
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const doLogout = () =>
    fetch(`${api}/logout`, {
        method: 'POST',
        headers: {
            ...headers
        },
        credentials: 'include'
    }).then(res => {
        return res.status;
        res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const getImages = () =>
    fetch(`${api}/getImages`, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error.");
            return error;
        });

export const uploadFile = (payload) =>
    fetch(`${api}/uploadFile`, {
        method: 'POST',
        credentials: 'include',
        body: payload
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error.");
            return error;
        });

export const deleteFile = (payload) =>
    fetch(`${api}/deleteFile`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error.");
            return error;
        });

export const shareFile = (payload) =>
    fetch(`${api}/shareFile`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const userAbout = (payload) =>
    fetch(`${api}/about`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const starFile = (payload) =>
    fetch(`${api}/starFile`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error.");
            return error;
        });

export const getDetails = () =>
    fetch(`${api}/getDetails`, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then(res => {
        console.log(res.body);
        console.log("API.js - getDetails - response " + res.overview);
        console.log("API.js - getDetails - response " + res.status);

        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

