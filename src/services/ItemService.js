export default class ItemService {

    token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjdXN0b21lckBtYWlsLnJ1IiwiZXhwIjoxNjU0NjAyMjM4fQ.HJrH1juqkFzisw-h7TamnpxS3ItE9T5ut4ycM1krcA8";
    host = "http://localhost:8081";
    url = "/api/v1/items";

    get(fullUrl) {
        return fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Authorization': this.token
            }
        })
        .then(res => res.json())
        .then(data => data.data);
    }

	getItemTree() {
        return this.get(this.host + this.url + "/tree");
    }

    async getItem(date, id) {
        const item = await this.get(this.host + this.url + "?date=" + date + "&id=" + id);
        return item;
    }

}