import axios from "axios";

export const presetAxios = new axios.Axios({
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
    }
})