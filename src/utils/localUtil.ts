export const localUtil = {
    getKey(key: string) {
        return localStorage.getItem(key)
    },
    setKey(key: string, val: string) {
        return localStorage.setItem(key, val);
    }
}