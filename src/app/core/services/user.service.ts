import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IUserInfo, IUser } from 'src/app/entities';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoints } from 'src/app/constants';

interface ILoginRequest {
    login: string;
    password: string;
}

interface ILoginResponse {
    token: string;
}

interface IUserResponse {
    id: number;
    firstName: string;
    lastName: string;
    createDate: Date;
    updateDate: Date;
}

interface IHttpRequestOptions {
    headers?: HttpHeaders;
}

interface IUserService {
    login(user: IUser): Observable<void>;
}

@Injectable({
    providedIn: 'root'
})
export class UserService implements IUserService {
    private token: string = "";

    constructor(
        private httpService: HttpClient
    ) { }

    public login(user: IUser): Observable<void> {
        return this.httpService
            .post<ILoginResponse>(Endpoints.login, this.toServerUser(user))
            .pipe(
                map((result: ILoginResponse) => {
                    this.token = result.token;
                }))
    }

    public getUserById(id: number): Observable<IUserInfo> {
        const headers: HttpHeaders = new HttpHeaders();
        headers.set("Authorization", `Bearer ${this.token}`);

        const options: IHttpRequestOptions = {
            headers: headers
        };

        return this.httpService
            .get<IUserResponse>(`${Endpoints.userById}${id}`)
            .pipe(
                map((result: IUserResponse) => {
                    return this.toLocalUserInfo(result);
                }))

    }

    private toServerUser(user: IUser): ILoginRequest {
        return {
            login: user.username,
            password: user.password
        }
    }

    private toLocalUserInfo(input: IUserResponse): IUserInfo {
        return {
            id: input.id,
            name: `${input.firstName} ${input.lastName}`
        }
    }
}
