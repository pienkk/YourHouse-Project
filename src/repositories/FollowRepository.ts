import { dataSource } from "../config/typeormConfig";
import { FollowEntity } from "../entities/FollowEntity";
import { DeepPartial, FindOneOptions, FindOptionsWhere } from "typeorm";

export class FollowRepository {
  private readonly followRepository = dataSource.getRepository(FollowEntity);

  public async findOne(
    options: FindOneOptions<FollowEntity>
  ): Promise<FollowEntity | null> {
    return await this.followRepository.findOne(options);
  }

  public async save(entity: DeepPartial<FollowEntity>): Promise<FollowEntity> {
    return await this.followRepository.save(entity);
  }

  public async delete(options: FindOptionsWhere<FollowEntity>) {
    return await this.followRepository.delete(options);
  }
}
