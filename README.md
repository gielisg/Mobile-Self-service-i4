# Mobile-Self-service-i4
Mobile self service - ionic 4


ionic 4.10.0
cordova 8.0.0
node 8.11.2

To solve CORS issue on both of browser and real device, should follow this step.
1. Set proxy on angular.json.
    "server":{
        ...
        "option":{
            ...
            "proxyConfig": "proxy.conf.json"
        }
    }
2. Set proxies on ionic.config.json
    "proxies": [
        {
        "path": "/SelcommWS",
        "proxyUrl": "https://ua.selcomm.com/SelcommWS/"
        }
    ],
3. Set server on package.json
    "start": "ng serve --proxy-config proxy.conf.json"

And then there is other way to solve this problem using third party(Heroku).
Just add "https://cors-anywhere.herokuapp.com" at the first part of request URL.