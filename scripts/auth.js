import url from './server_url';

export default async function auth(token) {
    return fetch(url + '/authorization', { method: 'post', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ token }) })
    .then(response => response.json())
}