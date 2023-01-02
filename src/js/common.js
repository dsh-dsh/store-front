import { host } from './Constants'

export async function get(url, state) {
    return fetch(host + url, {
      method: 'GET',
      headers: {'Authorization': state.token}
    })
	.then(res  => res.json())
	.then(res => handleResponce(res, state))
    .then(res => res.data);
}

export async function post(url, headers, body, state) {
    return fetch(host + url, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(body)
    })
    .then(res => res.json())
	.then(res => handleResponce(res, state));
}

export async function put(url, headers, body, state) {
	return fetch(host + url, {
		method: 'PUT',
		headers: headers,
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.then(res => handleResponce(res, state))
	.then(res => res.data);
}

export async function del(url, headers, body, state) {
	return fetch(host + url, {
		method: 'DELETE',
		headers: headers,
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.then(res => handleResponce(res, state))
	.then(res => res.data);
}

function handleResponce(data, state) {
	if (data.error) {
		state.toast?.add({ severity:'error', summary: 'Ошибка', detail: data.error, life: 5000 });
	} else if (data.warning) {
		state.toast?.add({ severity:'warn', summary: 'Внимание', detail: data.warning });
	} else if (data.info && data.id) {
		state.toast?.add({ severity:'warn', summary: 'Внимание', detail: data.info, list: data.list, docId: data.id });
	}
	return data;
}
