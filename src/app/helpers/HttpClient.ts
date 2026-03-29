import { Injectable, OnInit } from "@angular/core";
import axios, { AxiosInstance } from "axios";

const LOGIN_URL = "/login";
const UNAUTHORIZED_URL = "/unauthorized";
const BASE_URL = 'http://localhost:8080'

@Injectable({
    providedIn: 'root'
})

export class HttpClient {

    axiosHttp: AxiosInstance | undefined; 

    constructor() {
        const baseUrl = BASE_URL;

        this.axiosHttp = axios.create({
            baseURL: baseUrl,
            validateStatus: function (status) {
                return status < 500;
            },
            withCredentials: true,
        });

        this.axiosHttp.interceptors.request.use((config) => {
            config.headers.setAccept("application/json");
            config.headers.setContentType("application/json");
            config.headers.set("Access-Control-Allow-Origin", "*");
            config.headers.set("Access-Control-Allow-Headers", "*");
            config.headers.set("Access-Control-Allow-Mehtods", "*");
            return config;
        });
    }

    getBaseUrl(): string {
        return BASE_URL;
    }

    get = async <TResponse>(url: string, redirectWhenUnauthorized: boolean = true) => {
        try 
        {
            const res = await this.axiosHttp!.get<TResponse>(url);

            if (res.status === 401 && redirectWhenUnauthorized)
                window.location.assign(LOGIN_URL);

            if (res.status !== 200) {
                return {
                    success: false,
                    data: null,
                    statusCode: res.status,
                    error: "Unhandled error", //todo: Fill in error
                } as ApiResponse<TResponse>;
            }

            return {
                success: true,
                data: res.data,
                error: null,
            } as ApiResponse<TResponse>;
        } 
        catch (err) 
        {
            console.error(err);
            return {
                success: false,
                data: null,
                error: "Unhandled error", //todo: Fill in error
            } as ApiResponse<TResponse>;
        }
    }

    post = async <TData = object, TResponse = object>(url: string, data: TData, redirectWhenUnauthorized: boolean = true)
        : Promise<ApiResponse<TResponse>> => {
        try 
        {
            const res = await this.axiosHttp!.post<TResponse>(url, JSON.stringify({ ...data }));

            if (res.status === 401 && redirectWhenUnauthorized)
                window.location.assign(LOGIN_URL);

            if (res.status !== 200 && res.status !== 201) {
                return {
                    success: false,
                    data: null,
                    statusCode: res.status,
                    error: "Unhandled error", //todo: Fill in error
                } as ApiResponse<TResponse>;
            }

            return {
                success: true,
                statusCode: 200,
                data: res.data,
                error: null,
            } as ApiResponse<TResponse>;
        } 
        catch (err) {
            console.log("error", err);
            //window.location.assign("error");
            return {
                success: false,
                data: null,
                error: "Unhandled error", //todo: Fill in error
            } as ApiResponse<TResponse>;
        }
    };

    // documentPoster = async <TResponse = object>(
    //     url: string,
    //     file: any
    // ): Promise<ApiResponse<TResponse>> => {
    //     try {
    //         if (!file) throw new Error("The parameter 'file' cannot be null.");

    //         const axiosHttp = axios.create({
    //             baseURL: this.config.getApiUrl() ?? BASE_URL,
    //             validateStatus: (status) => status < 500,
    //             withCredentials: true,
    //         });

    //         axiosHttp.defaults.headers.common['Authorization'] = this.bearerToken;

    //         const content_ = new FormData();
    //         const fileName = file.name || file.fileName || "upload.jpg";
    //         content_.append("document", file, fileName);

    //         const res = await axiosHttp.post<TResponse>(url, content_, {});

    //         if (res.status !== 200) {
    //             return {
    //                 success: false,
    //                 data: null,
    //                 statusCode: res.status,
    //             } as ApiResponse<TResponse>;
    //         }

    //         return {
    //             success: true,
    //             statusCode: 200,
    //             data: res.data,
    //             error: null,
    //         } as ApiResponse<TResponse>;
    //     } catch (err) {
    //         console.error("Upload error:", err);
    //         return {
    //             success: false,
    //             data: null,
    //             error: err.message || "Unhandled error",
    //         } as ApiResponse<TResponse>;
    //     }
    // };

    // puter = async <TData = object, TResponse = object>(
    //     url: string,
    //     data: TData,
    // ): Promise<ApiResponse<TResponse>> => {
    //     try {
    //         const res = await this.axiosHttp.put<TResponse>(url, JSON.stringify({ ...data }));

    //         if (res.status === 401)
    //             window.location.assign(LOGIN_URL);

    //         if (res.status !== 200) {
    //             return {
    //                 success: false,
    //                 data: null,
    //                 statusCode: res.status,
    //                 error: "Unhandled error", //todo: Fill in error
    //             } as ApiResponse<TResponse>;
    //         }

    //         return {
    //             success: true,
    //             statusCode: 200,
    //             data: res.data,
    //             error: null,
    //         } as ApiResponse<TResponse>;
    //     } catch (err) {
    //         console.log("error", err);
    //         //window.location.assign("error");
    //         return {
    //             success: false,
    //             data: null,
    //             error: "Unhandled error", //todo: Fill in error
    //         } as ApiResponse<TResponse>;
    //     }
    // };

    // deleter = async <TResponse>(url: string) => {
    //     try {
    //         const res = await this.axiosHttp.delete<TResponse>(url);

    //         if (res.status === 401)
    //             window.location.assign(LOGIN_URL);

    //         if (res.status !== 200) {
    //             return {
    //                 success: false,
    //                 data: null,
    //                 statusCode: res.status,
    //                 error: "Unhandled error", //todo: Fill in error
    //             } as ApiResponse<TResponse>;
    //         }

    //         return {
    //             success: true,
    //             data: res.data,
    //             error: null,
    //         } as ApiResponse<TResponse>;
    //     } catch (err) {
    //         console.log("error", err);
    //         //window.location.assign("error");
    //         return {
    //             success: false,
    //             data: null,
    //             error: "Unhandled error", //todo: Fill in error
    //         } as ApiResponse<TResponse>;
    //     }
    // };
}

export interface ApiResponse<TData> {
	success: boolean;
	statusCode: number;
	data: TData;
	error: string | null;
}