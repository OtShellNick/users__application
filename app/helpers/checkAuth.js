import * as CookieHelper from '@helpers/cookie';

export const checkAuth = data => {
    const {response} = data;
    if(response && response.status === 401 && location.pathname !== '/login') {
        CookieHelper.del('appSessionId');
        location.replace('/login');
    }
}