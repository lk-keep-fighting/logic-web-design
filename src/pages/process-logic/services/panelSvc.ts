import axios from "axios";

export async function getPanelData() {
    return axios('/api/mes/asm-system/bbs/v1/common/dictionaries/list', {
        method: 'post',
        data: {
            "applicationCode": "bbs",
            "dictionaryCategoryCode": "GROUP-TYPES",
            "isEnabled": true
        }
    }).then(res => {
        if (res.data) {
            const data = res.data
            return data;
        } else {
            return [];
        }
    })
}