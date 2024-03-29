/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    users: User;
    thread: Thread;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {};
}
export interface User {
  id: string;
  assistantId: string;
  name?: string | null;
  username: string;
  phone_number: string;
  profile_picture?: string | null;
  uses_social_login: boolean;
  occupation?: string | null;
  education?:
    | (
        | ''
        | 'tidak-belum-sekolah'
        | 'tidak-tamat-sd-sederajat'
        | 'tamat-sd-sederajat'
        | 'smp-sederajat'
        | 'sma'
        | 'smk'
        | 'diploma_1_3'
        | 'diploma_4_s1'
        | 'strata_2'
        | 'strata_3'
      )
    | null;
  gender?: ('' | 'laki-laki' | 'perempuan' | 'memilih_untuk_tidak_menyebutkan') | null;
  birthdate?: string | null;
  birthplace?: string | null;
  bio?: string | null;
  roles?: ('admin' | 'user')[] | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
}
export interface Thread {
  id: number;
  user?: (string | User)[] | null;
  assistantId: string;
  threadId: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadPreference {
  id: number;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadMigration {
  id: number;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}