import { AIModel, Prompt, Variable } from '@promptus/server/models';
import { BaseEntity } from 'typeorm';

type InstanceTypeWithoutBaseEntity<T extends new () => Prompt | AIModel | Variable> = Omit<InstanceType<T>, keyof BaseEntity>;

export type PromptDTO = InstanceTypeWithoutBaseEntity<typeof Prompt>;
