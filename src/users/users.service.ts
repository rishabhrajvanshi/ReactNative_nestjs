/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Twilio } from 'twilio';
import * as dotenv from 'dotenv';
import { randomInt } from 'crypto';
import { User, UserDocument } from './schema/users.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/jwt-auth/jwt-auth.service';
dotenv.config();

@Injectable()
export class UsersService {
  private readonly twilioClient: Twilio;
  private readonly verifyServiceSid: string;
  private readonly logger = new Logger(UsersService.name);
  // private readonly jwtAuthService: JwtAuthService;
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @Inject(forwardRef(() => JwtAuthService))
    private readonly jwtAuthService: JwtAuthService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    // Initialize Twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioClient = new Twilio(accountSid, authToken);
    this.verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  }
  private getUserCacheKeyById(_id: string) {
    return `user:id:${_id}`;
  }

  private getUserCacheKeyByPhone(phoneNumber: string) {
    return `user:phone:${phoneNumber}`;
  }
  async findPhone(phoneNumber: string) {
    const key = this.getUserCacheKeyByPhone(phoneNumber);
    //Try Redis Cache first
    const cached = await this.cacheManager.get<any>(key);
    console.log("find cache data", cached)
    if (cached) {
      return cached;
    }
    //fall back to DB
    const user = await this.userModel.findOne({ phoneNumber: phoneNumber }).exec();
    // Cache the user data for future requests
    if (user) {
      await this.cacheManager.set(key, user,);
      const idKey = this.getUserCacheKeyById(String(user['_id']));
      await this.cacheManager.set(idKey, user);
    }
    return user;

  }
  // Method to send OTP via SMS using Twilio
  async sendOtpToMobile(phoneNumber: string): Promise<void> {
    try {
      // Send OTP via SMS using Twilio
      const otpSender = await this.twilioClient.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({ to: phoneNumber, channel: 'sms' });
      console.log('OTP sent via SMS:', otpSender.sid);
      return;
      // Return OTP to save it for verification
    } catch (error) {
      console.error('Error sending OTP via SMS', error);
      throw new Error('Failed to send OTP via SMS');
    }
  }

  // Method to generate and send OTP to both mobile and email
  async sendOtp(phoneNumber: string): Promise<void> {
    await this.sendOtpToMobile(phoneNumber);
    // Store OTP in a cache, database, or memory for verification (with expiry)
    return;
  }
  async verifyOtp(phoneNumber: string, code: string) {
    console.log('verifyOtp called with:', phoneNumber, code);

    const verification = await this.twilioClient.verify.v2
      .services(this.verifyServiceSid)
      .verificationChecks.create({ code: code, to: phoneNumber });
    console.log('VERIFICATION:', verification);
    if (verification.status !== 'approved') {
      return { msg: 'not verified' };
    }
    else {

      let user = await this.findPhone(phoneNumber);
      if (!user) {
        console.log('User with this phone number does not exist\n');
        const newUser = new this.userModel({ phoneNumber: phoneNumber });
        const createUser = await newUser.save();
        this.logger.log(`Created new user for ${phoneNumber}`);

        const plainUser = createUser.toObject();
        console.log(plainUser, 'plainUser');

        const idKey = this.getUserCacheKeyById(String(createUser._id));
        const cachedId = await this.cacheManager.set(idKey, plainUser,);
        console.log(plainUser, cachedId, 'cachedId and plainUser');


        if (plainUser.phoneNumber) {
          const phoneKey = this.getUserCacheKeyByPhone(String(plainUser.phoneNumber));
          const cachedNumber = await this.cacheManager.set(phoneKey, plainUser);
          console.log(plainUser, cachedNumber, 'cachedNumber and plainUser');
        }
        user = plainUser;
        return { message: 'User created', user };
      }
      else if (user) {
        //then let user login in system with it real name and issue JWT token
        console.log(
          'User logged in successfully with phone number:',
        );
      }
      const tokenObj = await this.jwtAuthService.createtokenForUser(user);
      console.log({ tokenObj }, 'tokenObj');
      return {
        message: 'OK',
        user,
        token: tokenObj.accessToken,
        expiresIn: tokenObj.expiresIn,
      };
    }
  }

  async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    const updated = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true, runValidators: true })
      .exec();
    console.log("Inside User Service's update user function", updated)

    return updated;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: any) {
    const findUserInfo = await this.userModel.findById(id).exec();
    console.log('User found with ID:', findUserInfo);

    return findUserInfo;
  }



  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
