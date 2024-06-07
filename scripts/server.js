import serverUrl from './server_url.js';

const serverFile = async (url, data = {}, file = []) => {
    const formData = new FormData();

    file.forEach(item => {
        if(item == '') return;

        formData.append('file', {
            uri: item.uri,
            type: item.mimeType,
            name: item.fileName
        })
    })
    formData.append('json', JSON.stringify(data));

    return fetch(serverUrl + url, {method: 'post', headers: { 'Content-Type': 'multipart/form-data' }, body: formData})
    .then(response => response.json())
}

const server = async (url, data = {}) => {
    return fetch(serverUrl + url, {method: 'post', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(data)})
    .then(response => response.json())
}

export { server, serverFile };