import {ForbiddenException, Injectable} from '@nestjs/common';
import {User, Bookmark} from '@prisma/client';
import {PrismaService} from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import {AuthDto} from './dto';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
      constructor(private prisma: PrismaService) { }

      async signup(dto: AuthDto) {
            //genarate hash password hash
            const hash = await argon.hash(dto.password);
            //save new user in db
            try {
                  const user = await this.prisma.user.create({
                        data: {
                              email: dto.email,
                              hash,
                        },
                  });

                  delete user.hash;
                  //return the saved user
                  return user;



            } catch (error) {
                  if (error instanceof PrismaClientKnownRequestError) {
                        if (error.code === 'P2002') {
                              throw new ForbiddenException('Credential tacken',)
                        }
                  }
            }
      }

      async signin(dto: AuthDto) {
            //find the user by email
            const user = await this.prisma.user.findUnique({
                  where: {
                        email: dto.email,
                  }
            })

            //if user does not exist thro exception
            if (!user)
                  throw new ForbiddenException('Credentials incorrect',);

            //compare password
            const pwMatches = await argon.verify(
                  user.hash,
                  dto.password,
            );

            //if password icorrect throw exception
            if (!pwMatches)
                  throw new ForbiddenException('Credentials incorrect');

            //send back the user
            delete user.hash;
            return user;
      };
}
