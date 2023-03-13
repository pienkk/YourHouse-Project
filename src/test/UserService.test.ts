import { DeleteResult } from "typeorm";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import { KakaoInfo } from "../types/KakaoInfo";
import { UserRepository } from "../repositories/UserRepository";
import { FollowRepository } from "../repositories/FollowRepository";

describe("UserService 유저 비즈니스 로직", () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let followRepository: FollowRepository;
  let authService: AuthService;

  beforeEach(() => {
    userService = new UserService();
    userRepository = new UserRepository();
    followRepository = new FollowRepository();
    authService = new AuthService();
  });
  const existingUser: any = {
    id: 1,
    social_id: 1234567,
    email: "kisuk623@gmail.com",
    profile_image: "http://naver.com",
    nickname: "기석",
    description: "",
  };

  describe("signIn() 소셜 로그인", () => {
    const KakaoUserInfo: KakaoInfo = {
      id: 1234567,
      kakao_account: {
        email: "kisuk623@gmail.com",
        profile: {
          nickname: "기석",
          profile_image_url: "http://naver.com",
        },
      },
    };

    // 성공
    it("소셜 로그인 성공 시 jwt 토큰, nickname, profileImage를 반환한다.", async () => {
      AuthService.prototype.getKakaoUserInfo = jest.fn();
      const authServiceGetKakaoUserInfoSpy = jest
        .spyOn(authService, "getKakaoUserInfo")
        .mockResolvedValue(KakaoUserInfo);
      UserRepository.prototype.findOne = jest.fn();
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(null);
      UserRepository.prototype.save = jest.fn();
      const userRepositorySaveSpy = jest
        .spyOn(userRepository, "save")
        .mockResolvedValue(existingUser);
      AuthService.prototype.createJwt = jest.fn();
      const authServiceCreateJwtSpy = jest
        .spyOn(authService, "createJwt")
        .mockReturnValue("eyasd");

      const result = await userService.signIn({ code: "accesscode" });

      expect(authServiceGetKakaoUserInfoSpy).toHaveBeenCalledWith("accesscode");
      expect(result).toEqual({
        accessToken: "eyasd",
        nickname: "기석",
        profileImage: "http://naver.com",
      });
    });
  });

  describe("createFollow() 유저 팔로우 추가", () => {
    const userId = 1;
    const followId = 2;
    const existingFollow: any = {
      id: 1,
      followId: 1,
      followedId: 2,
    };

    // 성공
    it("유저에 대한 팔로우 성공시 생성된 팔로우 객체를 반환한다.", async () => {
      UserRepository.prototype.findOne = jest.fn();
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(existingUser);
      FollowRepository.prototype.findOne = jest.fn();
      const followRepositoryFindOneSpy = jest
        .spyOn(followRepository, "findOne")
        .mockResolvedValue(null);
      FollowRepository.prototype.save = jest.fn();
      const followRepositorySaveSpy = jest
        .spyOn(followRepository, "save")
        .mockResolvedValue(existingFollow);

      const result = await userService.createFollow(userId, followId);

      expect(followRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { followId: 1, followedId: 2 },
      });
      expect(followRepositorySaveSpy).toHaveBeenCalledWith({
        followId: 1,
        followedId: 2,
      });
      expect(result).toEqual({
        id: 1,
        followId: 1,
        followedId: 2,
      });
    });

    // // 실패
    it("존재 하지 않는 유저를 팔로우 요청할 시 유저가 없다는 에러를 던진다.", async () => {
      UserRepository.prototype.findOne = jest.fn();
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(null);

      const result = async () => {
        return await userService.createFollow(userId, followId);
      };

      expect(result).rejects.toThrow("User not found");
    });

    // 실패
    it("이미 팔로우한 유저를 팔로우 요청할 시 이미 팔로우한 유저라는 에러를 던진다.", async () => {
      UserRepository.prototype.findOne = jest.fn();
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(existingUser);
      FollowRepository.prototype.findOne = jest.fn();
      const followRepositoryFindOneSpy = jest
        .spyOn(followRepository, "findOne")
        .mockResolvedValue(existingFollow);

      const result = async () => {
        return await userService.createFollow(userId, followId);
      };

      expect(result).rejects.toThrow("already followed this user");
    });
  });

  describe("deleteFollow() 유저 팔로우 삭제", () => {
    const userId = 1;
    const followId = 2;
    const existingFollow: any = {
      id: 1,
      followId: 1,
      followedId: 2,
    };

    // 성공
    it("팔로우 한 유저일 경우 팔로우를 삭제하고 상태를 반환한다", async () => {
      const deleteResult: DeleteResult = { raw: 1, affected: 1 };

      FollowRepository.prototype.findOne = jest.fn();
      const followRepositoryFindOneSpy = jest
        .spyOn(followRepository, "findOne")
        .mockResolvedValue(existingFollow);
      FollowRepository.prototype.delete = jest.fn();
      const followRepositoryDeleteSpy = jest
        .spyOn(followRepository, "delete")
        .mockResolvedValue(deleteResult);

      const result = await userService.deleteFollow(userId, followId);

      expect(followRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { followId: 1, followedId: 2 },
      });
      expect(followRepositoryDeleteSpy).toHaveBeenCalledWith({
        id: 1,
        followId: 1,
        followedId: 2,
      });
      expect(result).toEqual({ raw: 1, affected: 1 });
    });

    // 실패
    it("팔로우 하지 않은 유저를 삭제 요청할 시 팔로우를 하지 않았다는 예외를 던진다", async () => {
      FollowRepository.prototype.findOne = jest.fn();
      const followRepositoryFindOneSpy = jest
        .spyOn(followRepository, "findOne")
        .mockResolvedValue(null);

      const result = async () => {
        return await userService.deleteFollow(userId, followId);
      };

      expect(result).rejects.toThrow("Don't followed this user");
    });
  });
});
