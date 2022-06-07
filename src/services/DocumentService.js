export default class DocumentService {

    token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjdXN0b21lckBtYWlsLnJ1IiwiZXhwIjoxNjUzMzAyMzI5fQ.JqpFaIF-qs1x32dLYhRrnju1jMBFVM1ZqLlirwqJ-Oc";
    host = "http://localhost:8081";
    url = "/api/v1/docs/list";

	getDocuments() {
        return fetch(this.host + this.url, {
                method: 'GET',
                headers: {
                    'Authorization': this.token
                }
            })
        .then(res => res.json())
        .then(data => data.data);
    }

}