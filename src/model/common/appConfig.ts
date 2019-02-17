import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken("app.config");

export interface IAppConfig {
    apiEndpointWeb: string;
    apiEndpointMobile: string;
    WebPrivateKey: string;
    DatabaseUserCode: string;
    DatabasePassword: string;
    Usercode: string;
    Password: string;
}

export const AppConfig: IAppConfig = {
    apiEndpointWeb: "/SelcommWS/1.0267/",
    apiEndpointMobile: "https://ua.selcomm.com/SelcommWS/1.0267/",
    WebPrivateKey: "1234567890",
    DatabaseUserCode: "webuser",
    DatabasePassword: "resubew",
    Usercode: "40001304",
    Password: "sct910"
};
