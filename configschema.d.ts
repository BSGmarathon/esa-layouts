/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface Configschema {
  streamdeck?: {
    enable?: boolean;
    port?: number;
    key?: string;
    debug?: boolean;
  };
  rabbitmq: {
    remote: {
      protocol: string;
      hostname: string;
      username: string;
      password: string;
      vhost: string;
    };
    local?: {
      protocol: string;
      hostname?: string;
      username?: string;
      password?: string;
      vhost?: string;
    };
  };
  obs?: {
    enable?: boolean;
    address?: string;
    password?: string;
    names?: {
      scenes?: {
        ads?: string;
      };
    };
  };
  tracker: {
    username: string;
    password: string;
  };
  fcb?: {
    postKey?: string;
  };
  mpd?: {
    enable?: boolean;
    address?: string;
    port?: number;
    volume?: number;
  };
}