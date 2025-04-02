import { Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
      constructor(private prisma :PrismaService){}

     async  signup(dto: AuthDto){
      //genarate hash password hash
      const hash = await argon.hash(dto.password);
      //save new user in db
      try{
            const user = await this.prisma.user.create({
                  data:{
                        email:dto.email,
                        hash,
                  },
            });
      
            delete user.hash;
            //return the saved user
            return user;
                  
            

      }catch(error){

      }
}
     
      signin(){
            return {msg: 'I have sign in'};
      };
}
