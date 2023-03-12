import { dataSource } from "../config/typeormConfig";
import { UserEntity } from "../entities/UserEntity";
import { PostEntity } from "../entities/PostEntity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { FollowEntity } from "../entities/FollowEntity";

export async function typeormSeed() {
  // 유저 seed
  const userSeedArray: QueryDeepPartialEntity<UserEntity>[] = [
    {
      social_id: 123456,
      email: "kisuk333@gmail.com",
      profile_image: "http://naver.com",
      nickname: "기석",
    },
    {
      social_id: 1234569,
      email: "gildong623@naver.com",
      profile_image: "http://naver.com",
      nickname: "홍길동",
    },
    {
      social_id: 123452,
      email: "kisuk623@kakao.com",
      profile_image: "http://naver.com",
      nickname: "기석2",
    },
    {
      social_id: 123445,
      email: "kisuk310@naver.com",
      profile_image: "http://google.com",
      nickname: "구글기석",
    },
    {
      social_id: 1234456,
      email: "kisuk313@naver.com",
      profile_image: "http://google.com",
      nickname: "세종",
    },
  ];
  const postSeedArray: QueryDeepPartialEntity<PostEntity>[] = [
    { user: userSeedArray[0] },
    { user: userSeedArray[1] },
  ];
  const followSeed: QueryDeepPartialEntity<FollowEntity>[] = [
    {
      followUser: userSeedArray[0],
      followerUser: userSeedArray[2],
    },
    {
      followUser: userSeedArray[0],
      followerUser: userSeedArray[3],
    },
  ];

  await dataSource.getRepository(UserEntity).insert(userSeedArray);
  await dataSource.getRepository(PostEntity).insert(postSeedArray);
  await dataSource.getRepository(FollowEntity).insert(followSeed);
}
