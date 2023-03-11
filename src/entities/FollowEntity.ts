import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./UserEntity";

@Entity("follows")
@Index(["followId", "followedId"], { unique: true })
export class FollowEntity {
  @PrimaryGeneratedColumn({ comment: "팔로우 인덱스" })
  id!: number;

  @Column({ type: "int", comment: "팔로우 신청한 유저id", name: "follow_id" })
  followId!: number;

  @Column({
    type: "int",
    comment: "팔로우 신청 받은 유저id",
    name: "followed_id",
  })
  followedId!: number;

  @ManyToOne(() => UserEntity, (user) => user.follows)
  @JoinColumn({ name: "follow_id" })
  followUser!: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.followers)
  @JoinColumn({ name: "followed_id" })
  followerUser!: UserEntity;
}
