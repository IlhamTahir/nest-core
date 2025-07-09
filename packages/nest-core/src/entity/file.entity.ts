import { TraceableEntity } from '../entity/traceable.entity';
import { Column, Entity } from 'typeorm';
import { FileStatus } from '../enum/file-status.enum';

@Entity()
export class File extends TraceableEntity {
  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  mineType: string;

  @Column()
  provider: string;

  @Column()
  size: number;

  @Column({
    type: 'enum',
    enum: FileStatus,
    default: FileStatus.UPLOADING,
  })
  status: FileStatus;

  @Column({ nullable: true })
  uploadId: string; // 分片上传的唯一标识

  @Column({ nullable: true })
  fileSum: string;
}
