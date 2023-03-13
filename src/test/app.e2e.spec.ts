import { dataSource } from "../config/typeormConfig";
import axios from "axios";
import jwt from "jsonwebtoken";
import request from "supertest";
import { Express } from "express-serve-static-core";
import { createApp } from "../app";
import { KakaoInfo, ResponseKaKaoToken } from "../types/KakaoInfo";
import { typeormSeed } from "./seeds";
import { Env } from "../util/env";

let app: Express;
jest.mock("axios");

const env = Env.getInstance();
const accesstoken = jwt.sign({ user_id: 1 }, env.getEnv("JWT_SECRET"));

beforeAll(async () => {
  app = createApp();
  await dataSource.initialize();
  typeormSeed();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("user E2E", () => {
  describe("(GET) /user/auth 소셜 로그인", () => {
    // 성공
    it("소셜 로그인 성공 시 jwt, nickname, profileImage를 반환한다.", async () => {
      const KakaoAccessToken: ResponseKaKaoToken = {
        access_token: "accesstoken",
        token_type: "access_token",
        refresh_token: "RefreshTopken",
        scope: "profile_image, nickname",
      };
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

      // 카카오 api mocking
      const axiosPostSpy = jest
        .spyOn(axios, "post")
        .mockResolvedValue({ data: KakaoAccessToken });
      const axiosGetSpy = jest
        .spyOn(axios, "get")
        .mockResolvedValue({ data: KakaoUserInfo });

      const result = await request(app).get("/user/auth").query({ code: "kakaocode" });

      expect(result.status).toBe(200);
      expect(result.body.nickname).toBe("기석");
      expect(result.body.profileImage).toBe("http://naver.com");
    });
  });

  describe("(POST) /uesr/follow 팔로우 신청", () => {
    // 성공
    it("팔로우 신청 성공 후 팔로우 신청 성공에 대한 메시지를 받는다.", async () => {
      const result = await request(app)
        .post("/user/follow")
        .query({ writerId: 2 })
        .set({ authorization: accesstoken });

      expect(result.status).toBe(201);
      expect(result.body.message).toBe("SUCCESS_FOLLOWING");
    });

    // 실패
    it("팔로우 신청 시 해당 유저가 존재하지 않을 경우 유저가 없다는 예외를 던진다.", async () => {
      const result = await request(app)
        .post("/user/follow")
        .query({ writerId: 10 })
        .set({ authorization: accesstoken });

      expect(result.status).toBe(404);
      expect(result.body.message).toBe("User not found");
    });

    // 실패
    it("팔로우 신청 시 이미 팔로우 중일 경우 팔로우 중이라는 예외를 던진다.", async () => {
      const result = await request(app)
        .post("/user/follow")
        .query({ writerId: 3 })
        .set({ authorization: accesstoken });

      expect(result.status).toBe(409);
      expect(result.body.message).toBe("already followed this user");
    });
  });

  describe("(DELETE) /user/follow 팔로우 취소", () => {
    // 성공
    it("팔로우 삭제 성공 후 팔로우 삭제 성공에 대한 메시지를 받는다.", async () => {
      const result = await request(app)
        .delete("/user/follow")
        .query({ writerId: 4 })
        .set({ authorization: accesstoken });

      expect(result.status).toBe(204);
    });

    // 실패
    it("팔로우 하지 않은 유저를 팔로우 삭제 요청 시 팔로우 하지 않은 유저라는 예외를 던진다.", async () => {
      const result = await request(app)
        .delete("/user/follow")
        .query({ writerId: 5 })
        .set({ authorization: accesstoken });

      expect(result.status).toBe(409);
      expect(result.body.message).toBe("Don't followed this user");
    });
  });
});
