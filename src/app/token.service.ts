import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  tokens = [
    {token: '73db4763234e4741aeb5e65834e4e811', isAvailable: true},
    {token: 'a1a0689a90464eb884d5e8b48782c5d7', isAvailable: true},
    {token: 'cd53b999fa594fa48f979ead7e309456', isAvailable: true},
    {token: '347dcdd698c54c878f832856c8d524f0', isAvailable: true},
    {token: '697644213ee94d909086c723fdaab0fb', isAvailable: true},
    {token: '0ef416bf73bc46d8825686b09433a0bd', isAvailable: true}
  ]
  tokenIndex = 0;

  getHeaders(){
    let headers: HttpHeaders;
    let isHeadersEmpty = true;
    while(isHeadersEmpty){
      if(this.tokens[this.tokenIndex]["isAvailable"]){
        headers = new HttpHeaders({'X-Auth-Token': this.tokens[this.tokenIndex]["token"]});
        isHeadersEmpty = false;
        if(this.tokenIndex == (this.tokens.length - 1)){
          for(let i = 0; i < this.tokens.length; i++){
            this.tokens[i]["isAvailable"] = true;
          }
          this.tokenIndex = 0;
        }
        else {
          this.tokens[this.tokenIndex]["isAvailable"] = false;
        }
      } else {
        this.tokenIndex++;
      }
    }
    return headers;
  }
}