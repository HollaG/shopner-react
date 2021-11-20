export interface SiteStruct {
    name: string;
    url: string;
    searchUrl: string;
    enabled: boolean;
    index?: number;
    icon?: string;
    id?: string;
}

export interface PresetStruct {

}

export interface DOMMessageResponse {
    
    payload: {
        text?: string,
        sites?: SiteStruct[],
        title?: string,
        searchUrl?: string,
        currentUrl? :string,
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