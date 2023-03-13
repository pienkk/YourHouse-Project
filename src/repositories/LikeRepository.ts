import { DeepPartial, DeleteResult, FindOneOptions, FindOptionsWhere } from "typeorm";
import { dataSource } from "../config/typeormConfig";
import { LikeEntity } from "../entities/LikeEntity";

export class LikeRepository {
  private readonly likeRepository = dataSource.getRepository(LikeEntity);

  public async findOne(options: FindOneOptions<LikeEntity>): Promise<LikeEntity | null> {
    return await this.likeRepository.findOne(options);
  }

  public async save(entity: DeepPartial<LikeEntity>): Promise<LikeEntity> {
    return await this.likeRepository.save(entity);
  }

  public async delete(options: FindOptionsWhere<LikeEntity>): Promise<DeleteResult> {
    return await this.likeRepository.delete(options);
  }
}
