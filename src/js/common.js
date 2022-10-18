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
    // .then(res => res.data);
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
		state.toast?.add({ severity:'error', summary: 'error', detail: data.error, life: 5000 });
	} else {
		state.toast?.add({ severity:'info', summary: 'Info Message', detail: data.message, life: 2000 });
	}
	return data;
}

/*
{ <script>
    var myMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (myMobile.Android() || 
                    myMobile.BlackBerry() || 
                    myMobile.iOS() || 
                    myMobile.Opera() || 
                    myMobile.Windows());
        }
    };

    if( myMobile.any() ) {
      // это мобильник - делаем что-то
    }
</script>

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // код для мобильных устройств
  } else {
    // код для обычных устройств
} 
}*/
