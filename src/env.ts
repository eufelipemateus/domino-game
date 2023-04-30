import { EnvType, load } from 'ts-dotenv';

export type Env = EnvType<typeof schema>;

export const schema = {
  PORT: Number,
  DEBUG: Boolean
};

export let env: Env;

export function loadEnv(): void {
    env = load(schema);
}