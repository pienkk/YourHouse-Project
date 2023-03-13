import { UserRepository } from "../repositories/UserRepository";
import { ResponseSignInDto, SignInDto } from "../dtos/SignInDto";
import { AuthService } from "./AuthService";
import { KakaoInfo } from "../types/KakaoInfo";
import { FollowRepository } from "../repositories/FollowRepository";
import { BaseError } from "../util/BaseError";
import { FollowEntity } from "../entities/FollowEntity";
import { PostRepository } from "../repositories/PostRepository";
import { LikeRepository } from "../repositories/LikeRepository";
import { PostEntity } from "../entities/PostEntity";
import { UserEntity } from "../entities/UserEntity";
import { DeleteResult } from "typeorm";
import { LikeEntity } from "../entities/LikeEntity";

export class UserService {
  private readonly userRepository = new UserRepository();
  private readonly followRepository = new FollowRepository();
  private readonly postRepository = new PostRepository();
  private readonly likeRepository = new LikeRepository();
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
    // 유저, 팔로우 여부 확인
    await this.validateUser(followId);
    const follow = await this.followRepository.findOne({
      where: { followId: userId, followedId: followId },
    });

    if (follow) {
      throw new BaseError("already followed this user", 409);
    }

    return await this.followRepository.save({ followId: userId, followedId: followId });
  }

  /**
   * 팔로우 삭제
   */
  public async deleteFollow(userId: number, followId: number): Promise<DeleteResult> {
    // 유저, 팔로우 여부 확인
    await this.validateUser(followId);
    const follow = await this.followRepository.findOne({
      where: { followId: userId, followedId: followId },
    });

    if (!follow) {
      throw new BaseError("Don't followed this user", 409);
    }

    return await this.followRepository.delete(follow);
  }

  /**
   * 유저 유효성 검사
   */
  private async validateUser(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BaseError("User not found", 404);
    }

    return user;
  }

  /**
   * 게시글 유효성 검사
   */
  private async validatePost(postId: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new BaseError("Post not found", 404);
    }

    return post;
  }

  /**
   * 게시글 좋아요 추가
   */
  public async createLike(userId: number, postId: number): Promise<LikeEntity> {
    // 게시글, 좋아요 여부 확인
    await this.validatePost(postId);
    const like = await this.likeRepository.findOne({ where: { userId, postId } });

    if (like) {
      throw new BaseError("already like this post", 409);
    }

    return await this.likeRepository.save({ userId, postId });
  }

  /**
   * 게시글 좋아요 삭제
   */
  public async deleteLike(userId: number, postId: number) {
    // 게시글 좋아요 여부 확인
    await this.validatePost(postId);
    const like = await this.likeRepository.findOne({ where: { userId, postId } });

    if (!like) {
      throw new BaseError("Don't like this post", 409);
    }

    return await this.likeRepository.delete(like);
  }
}
