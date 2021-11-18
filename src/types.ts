export interface Site {
    name: string;
    url: string;
    searchUrl: string;
    enabled: boolean;
    index?: number;
}

export interface DOMMessageResponse {
    
    payload: {
        text?: string,
        sites?: Site[],
        title?: string,
        searchUrl?: string,
        [key:string]:any
    }
}

export interface DOMMessage { 
    type: string,
    // payload?: {
    //     index?: number,
    //     name?: string,
    //     url?: string,
    //     searchUrl?: string,
    //     enabled?: boolean
    // }
    payload?: any
}