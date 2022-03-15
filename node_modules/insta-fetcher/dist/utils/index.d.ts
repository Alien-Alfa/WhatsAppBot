import { formattedShortcode, postType } from '../types/index';
/** Instagram post regex */
export declare const IGPostRegex: RegExp;
/**
 * format instagram long url to get shortcode
 * @param url a instagram post url
 * @returns {formattedShortcode}
 */
export declare const shortcodeFormatter: (url: string) => formattedShortcode;
/**
 * is Instagram Url?
 * @param url instagram post url
 * @returns
 */
export declare const isIgPostUrl: (url: string) => boolean;
/**
 * get instagram post type
 * @param type product_type
 * @returns
 */
export declare const getPostType: (type: string) => postType;
/** get random number in range */
export declare const randInt: (min: number, max: number, q?: number) => number;
