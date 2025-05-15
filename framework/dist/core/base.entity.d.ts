import { BaseEntity as TypeORMBaseEntity } from 'typeorm';
export declare abstract class BaseEntity extends TypeORMBaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
