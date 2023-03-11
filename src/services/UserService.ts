import { UserRepository } from "../repositories/UserRepository";
import { ResponseSignInDto, SignInDto } from "../dtos/SignInDto";
import { AuthService } from "./AuthService";
import { KakaoInfo } from "../types/KakaoInfo";
import { FollowRepository } from "../repositories/FollowRepository";
import { BaseError } from "../util/BaseError";
import { FollowEntity } from "../entities/FollowEntity";

export class UserService {
  private readonly userRepository = new UserRepository();
  private readonly followRepository = new FollowRepository();
  private readonly authService = new AuthService();

  /**
   * 소셜 로그인 / 회원가입
   */
  public async signIn({ code }: SignInDto): Promise<ResponseSignInDto> {
    // 카카오 소셜 로그인 / 유저 정보 획득
    const userInfo: KakaoInfo = await this.authService.getKakaoUserInfo(code);

    // 회원가입 여부 확인
    let user = await this.userRepository.findOne({
      where: { email: userInfo.kakao_account.email },
    });

    // 회원가입되지 않은 유저의 경우
    if (!user) {
      // 회원 가입 후 유저 정보 반환
      user = await this.userRepository.save({
        social_id: userInfo.id,
        email: userInfo.kakao_account.email,
        nickname: userInfo.kakao_account.profile.nickname,
        profile_image: userInfo.kakao_account.profile.profile_image_url,
      });
    }

    // Jwt 발급
    const accessToken = this.authService.createJwt(user.id);

    return {
      accessToken,
      nickname: user.nickname,
      profileImage: user.profile_image,
    };
  }

  /**
   * 유저 팔로우
   */
  public async createFollow(userId: number, followId: number): Promise<FollowEntity> {
    const followed = await this.followRepository.findOne({
      where: { followId: userId, followedId: followId },
    });

    // 이미 팔로우 한 유저인 경우
    if (followed) {
      throw new BaseError("already followed this user", 409);
    }

    return await this.followRepository.save({ followId: userId, followedId: followId });
  }

  /**
   * 팔로우 삭제
   */
  public async deleteFollow(userId: number, followId: number) {
    const followed = await this.followRepository.findOne({
      where: { followId: userId, followedId: followId },
    });

    // 팔로우 하지 않은 유저인 경우
    if (!followed) {
      throw new BaseError("already followed this user", 409);
    }

    return await this.followRepository.delete(followed);
  }
}
