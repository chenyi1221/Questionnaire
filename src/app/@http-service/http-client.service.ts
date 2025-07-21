import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private httpClient: HttpClient) { }

  getApi(url: string) {
    return this.httpClient.get(url);
  }

  postApi(url: string, postData: any) {
    return this.httpClient.post(url, postData);
  }

  putApi(url: string, postData: any) {
    return this.httpClient.put(url, postData);
  }

  deleteApi(url: string) {
    return this.httpClient.delete(url);
  }
}
