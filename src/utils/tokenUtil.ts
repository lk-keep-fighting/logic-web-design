export const TokenUtil = {
    getTokenFormLocal() {
        return localStorage.getItem('token')
    },
    setTokenToLocal(token: string) {
        return localStorage.setItem('token', token);
    }
}