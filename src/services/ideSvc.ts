import axios from "axios";

export async function publishLogicFromDevToTest(id: string) {
    return axios.post(`/api/ide/pub/logic/dev-to-test${id}`);
}