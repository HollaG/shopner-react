import { Site } from "./chromeServices/background";

export interface DOMMessageResponse {
    title: string,
    payload: {
        text: string,
        sites: Site[]
    }
}

export interface DOMMessage { 
    type: string
}