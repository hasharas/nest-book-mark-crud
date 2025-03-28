import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
      
      signin(){
            return {msg: 'I have sign in'};
      };

      signup(){
            return {msg: 'i have sign up'};
      };
}
