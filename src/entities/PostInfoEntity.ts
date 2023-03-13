import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PostEntity } from "./PostEntity";
import { RoomSizeEntity } from "./RoomEntity";
import { ResidenceEntity } from "./ResidenceEntity";
import { StyleEntity } from "./StyleEntity";
import { SpaceEntity } from "./SpaceEntity";
import { PostProductEntity } from "./PostProductEntity";
import { HashTagsEntity } from "./HashTagEntity";

@Entity("post_infomations")
export class PostInfoEntity {
  @PrimaryGeneratedColumn({ comment: "게시글 정보 인덱스" })
  id!: number;

  @Column({ type: "varchar", comment: "게시글 이미지" })
  image!: string;

  @Column({ type: "varchar", comment: "게시글 내용", nullable: true })
  description!: string;

  @Column({ type: "int", comment: "게시글 참조id", name: "post_id" })
  postId!: number;

  @Column({ type: "int", comment: "방 사이즈 참조id", name: "room_size_id" })
  roomSizeId!: number;

  @Column({ type: "int", comment: "주거공간 참조id", name: "residence_id" })
  residenceId!: number;

  @Column({ type: "int", comment: "방 스타일 참조id", name: "style_id" })
  styleId!: number;

  @Column({ type: "int", comment: "공간 참조id", name: "space_id" })
  spaceId!: number;

  @ManyToOne(() => PostEntity, (post) => post.postInfo)
  @JoinColumn({ name: "post_id" })
  post!: PostEntity;

  @ManyToOne(() => RoomSizeEntity, (room) => room.postInfo)
  @JoinColumn({ name: "room_size_id" })
  roomSize!: RoomSizeEntity;

  @ManyToOne(() => ResidenceEntity, (residence) => residence.postInfo)
  @JoinColumn({ name: "residence_id" })
  residence!: ResidenceEntity;

  @ManyToOne(() => StyleEntity, (style) => style.postInfo)
  @JoinColumn({ name: "style_id" })
  style!: StyleEntity;

  @ManyToOne(() => SpaceEntity, (space) => space.postInfo)
  @JoinColumn({ name: "space_id" })
  space!: SpaceEntity;

  @OneToMany(() => PostProductEntity, (products) => products.postInfo)
  products!: PostProductEntity[];

  @OneToMany(() => HashTagsEntity, (hashtags) => hashtags.postInfo)
  hashtags!: HashTagsEntity[];
}
