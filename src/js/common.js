import { host } from './Constants'

export async function get(url, state) {
	console.log(state)
    return fetch(host + url, {
      method: 'GET',
      headers: {'Authorization': state.token}
    })
	.then(res  => res.json())
	.then(data => handleResponce(data, state))
    .then(data => data.data);
}

export async function post(url, headers, body, state) {
    return fetch(host + url, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(body)
    })
    .then(res => res.json())
	.then(data => handleResponce(data, state))
    .then(data => data);
}

export async function put(url, headers, body, state) {
	return fetch(host + url, {
		method: 'PUT',
		headers: headers,
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.then(data => handleResponce(data, state))
	.then(data => data.data);
}

export async function del(url, headers, body, state) {
	return fetch(host + url, {
		method: 'DELETE',
		headers: headers,
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.then(data => handleResponce(data, state))
	.then(data => data.data);
}

function handleResponce(data, state) {
	if (data.error) {
		state.toast?.add({ severity:'error', summary: 'error', detail: data.error, life: 3000 });
	} else {
		state.toast?.add({ severity:'info', summary: 'Info Message', detail: 'Message Content', life: 1000 });
	}
	return data;
}
