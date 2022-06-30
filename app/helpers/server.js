import axios from 'axios'
import * as CookieHelper from '@helpers/cookie'
const server = 'http://localhost:3112'
const Authorization = CookieHelper.get('appSessionId') || '';
axios.defaults.headers.common.authorization = Authorization;

export const Server = (method, url, data) => {
    axios.defaults.headers.common.authorization = CookieHelper.get('appSessionId') || '';
    return axios[method](`${server}${url}`, data)
        .then(resp => {
            if (resp.status === 200) return resp.data;
        })
};