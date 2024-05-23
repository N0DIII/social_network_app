import url from './server_url';

export default async function auth(token) {
    return fetch(url + '/auth/authorization', {method: 'post', headers: {'Content-Type': 'application/json; charset=utf-8', 'authorization': token}})
    .then(response => response.json())
}