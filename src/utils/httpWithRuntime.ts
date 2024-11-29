import axios, { AxiosRequestConfig } from "axios";

export class HttpRuntime {
    runtime: string;
    constructor(private _runtime: string) {
        this.runtime = _runtime
    }
    isRuntimeValid() {
        return this.runtime !== "" && this.runtime !== undefined
    }
    public async get(url: string, options?: AxiosRequestConfig) {
        if (this.isRuntimeValid())
            return axios.get(`/papi/${this.runtime}/${url}`, appendOptions(options))
        else return axios.get(url, appendOptions(options))
    }

    public async put(url: string, data: any, options?: AxiosRequestConfig) {
        if (this.isRuntimeValid())
            return axios.put(`/papi/${this.runtime}/${url}`, data, appendOptions(options))
        else
            return axios.put(url, data, appendOptions(options))
    }

    public async del(url: string, options?: AxiosRequestConfig) {
        if (this.isRuntimeValid())
            return axios.delete(`/papi/${this.runtime}/${url}`, appendOptions(options))
        else
            return axios.delete(url, appendOptions(options))
    }

    public async post(url: string, data?: any, options?: AxiosRequestConfig) {
        if (this.isRuntimeValid())
            return axios.post(`/papi/${this.runtime}/${url}`, data, appendOptions(options))
        else
            return axios.post(url, data, appendOptions(options))
    }
}


function appendOptions(options?: AxiosRequestConfig): AxiosRequestConfig {
    let defaultHeader: any = {
        "Content-Type": "application/json;charset=UTF-8",
    }
    if (localStorage.getItem("token")) {
        defaultHeader["Authorization"] = 'Bearer ' + localStorage.getItem("token");
    }
    return {
        ...options,
        headers: {
            ...defaultHeader,
            ...options?.headers,
        }
    }
}