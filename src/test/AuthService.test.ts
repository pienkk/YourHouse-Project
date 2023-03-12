import axios from "axios";
import jwt from "jsonwebtoken";
import { AuthService } from "../services/AuthService";
import { KakaoInfo, ResponseKaKaoToken } from "../types/KakaoInfo";

describe("AuthService 유저 인증 ", () => {
  let authService: AuthService;

  jest.mock("axios");
  jest.mock("jsonwebtoken");

  beforeEach(() => {
    authService = new AuthService();
    jest.resetAllMocks();
  });

  describe("getKakaoUserInfo() 카카오 소셜로그인 유저 정보 획득", () => {
    const responseKakaoToken: ResponseKaKaoToken = {
      access_token: "accessToken",
      token_type: "access",
      refresh_token: "refreshToken",
      scope: "profile_image",
    };
    const kakaoUserInfo: KakaoInfo = {
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
    it("카카오 소셜로그인 접속 코드를 받아 토큰을 발급받고, 토큰으로 유저 정보를 획득한다.", async () => {
      const axiosPostSpy = jest
        .spyOn(axios, "post")
        .mockResolvedValue({ data: responseKakaoToken });
      const axiosGetSpy = jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: kakaoUserInfo });

      const result = await authService.getKakaoUserInfo("kakaologinCode");

      expect(result).toEqual({
        id: 1234567,
        kakao_account: {
          email: "kisuk623@gmail.com",
          profile: {
            nickname: "기석",
            profile_image_url: "http://naver.com",
          },
        },
      });
    });
  });

  describe("createJwt() 유저id에 대한 Jwt를 발급한다.", () => {
    const userId = 1;

    // 성공
    it("유저 id를 받아 jwt토큰을 생성, 반환한다.", async () => {
      jest.spyOn(jwt, "sign").mockImplementation(() => "accesstoken");

      const result = authService.createJwt(userId);

      expect(result).toBe("accesstoken");
    });
  });
});
