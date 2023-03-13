import { FindOneOptions } from "typeorm";
import { dataSource } from "../config/typeormConfig";
import { PostEntity } from "../entities/PostEntity";

export class PostRepository {
  private readonly postRepository = dataSource.getRepository(PostEntity);

  public async findOne(options: FindOneOptions<PostEntity>): Promise<PostEntity | null> {
    return await this.postRepository.findOne(options);
  }
}
