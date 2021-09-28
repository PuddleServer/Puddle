import { System, Route, SystemRequest, SystemResponse, redirect, ErrorLog } from "./mod.ts";

export async function getAccessToken(client_id: string, client_secret: string, redirect_url: string, code: string): Promise<string> {
	const post = 'client_id=' + client_id + 
				'&redirect_uri=' + redirect_url + 
				'&client_secret=' + client_secret + 
				'&code=' + code + 
				'&grant_type=authorization_code';

	const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: post
	});

	if(response.status != 200)
		throw new Error('Error : Failed to receieve access token'); 

	const json_response = await response.json();
	const access_token: string = json_response['access_token'];

	return access_token;
}

export async function getProfileInfo(access_token: string): Promise<{ [key: string]: string; }>  {
	const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo?fields=name,email,id,picture,verified_email', {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + access_token
		}
	});

	if(response.status != 200)
		throw new Error('Error : Failed to get user information'); 

	const json_response: {[key: string]: string;} = await response.json();

	return json_response;
}

export class GoogleOAuth2 {

    static client: GoogleOAuth2;

    #URL: string;

    #client_id: string;

    #client_secret: string;

    #route_login: Route;

    constructor(client_id: string, client_secret: string, URL: string[] = [], process?: Function) {
        this.#client_id = client_id;
        this.#client_secret = client_secret;
        GoogleOAuth2.client = this;
        this.#URL = `/google_oauth2`;
        this.#route_login = new Route(`${this.#URL}_redirect`, URL);
    }

    setup() {
        const redirect_URL = this.#getGoogleOAuth2_URL(this.#client_id, `${System.URL}${this.#URL}`);
        this.#route_login.GET(redirect(redirect_URL));
    }

    get client_id(): string {
        return this.#client_id;
    }

    get client_secret(): string {
        return this.#client_secret;
    }

    /**
     * URLの取得、設定を行う。
     * @param urls 許可するリクエストURL(可変長引数)。
     * @returns 引数がない場合はURLを、ある場合はthisを返す。
     */
    URL(): string[];
    URL(urls: string[]): GoogleOAuth2;
    URL(...urls: string[]): GoogleOAuth2;
    URL(...urls: string[]|string[][]): string[] | GoogleOAuth2 {
        if(!urls.length) return this.#route_login.URL();
        urls = urls.flat();
        this.#route_login.URL(urls);
        return this;
    }

    LOGIN(process: Function): GoogleOAuth2 {
        new Route(this.#URL, [], async (request: SystemRequest, response: SystemResponse)=>{
            try {
				const access_token = await getAccessToken(this.#client_id, this.#client_secret, System.URL+this.#URL, request.getURL().searchParams.get("code")||"");
				const profile_info = await getProfileInfo(access_token);
                process(request, response, profile_info);
			} catch(error) {
                new ErrorLog("error", error.message);
				process(request, response, undefined);
			}
        });
        return this;
    }

    #getGoogleOAuth2_URL(client_id: string, redirect_url: string): string {
        const google_oauth_url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        google_oauth_url.searchParams.set('scope', 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email');
        google_oauth_url.searchParams.set('redirect_uri', redirect_url);
        google_oauth_url.searchParams.set('response_type', 'code');
        google_oauth_url.searchParams.set('client_id', client_id);
        google_oauth_url.searchParams.set('access_type', 'online');
        return google_oauth_url.toString();
    }
}