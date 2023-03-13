import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./UserEntity";
import { PostEntity } from "./PostEntity";

@Entity("likes")
@Index(["userId", "postId"], { unique: true })
export class LikeEntity {
  @PrimaryGeneratedColumn({ comment: "좋아요 인덱스" })
  id!: number;

  @Column({ type: "int", comment: "유저 참조id", name: "user_id" })
  userId!: number;

  @Column({ type: "int", comment: "게시글 참조id", name: "post_id" })
  postId!: number;

  @ManyToOne(() => UserEntity, (user) => user.likes)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.likes)
  @JoinColumn({ name: "post_id" })
  post!: PostEntity;
}
