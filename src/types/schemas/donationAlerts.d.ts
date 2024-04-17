/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type DonationAlerts = {
	id: string;
	threshold: number;
	/**
	 * This stores a reference based on the 'name' of the asset.
	 */
	sound: string | null;
	volume: number;
	/**
	 * This stores a reference based on the 'name' of the asset.
	 */
	graphic: string | null;
	graphicDisplayTime: number;
}[];