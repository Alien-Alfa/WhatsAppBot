/// <reference types="node" />
import { session_id } from './types';
import { IGUserMetadata } from './types/UserMetadata';
import { IGStoriesMetadata } from './types/StoriesMetadata';
import { IHighlightsMetadata } from './types/HighlightMediaMetadata';
import { IPostModels } from './types/PostModels';
import { PostFeedResult } from './types/PostFeedResult';
import { PostStoryResult } from './types/PostStoryResult';
import { MediaConfigureOptions } from './types/MediaConfigureOptions';
import { GraphqlUser } from './types/UserGraphQlV2';
export * from './utils';
export * as InstagramMetadata from './types';
export * from './helper/Session';
export declare class igApi {
    session_id: session_id;
    /**
     * Recommended to set session id for most all IG Request
     * @param session_id session id you can get it by using getSessionId function, see README.md or example file
     */
    constructor(session_id?: session_id);
    private cookie;
    private buildHeaders;
    /** Make request to IG API */
    private FetchIGAPI;
    /**
     * Set session id for most all IG Request
     * @param {session_id} session_id
     */
    setCookie: (session_id?: string) => void;
    /**
     * get user id by username
     * @param {username} username
     * @returns
     */
    getIdByUsername: (username: string) => Promise<string>;
    private _formatSidecar;
    fetchPost: (url: string) => Promise<IPostModels>;
    /**
     * fetch profile by username. including email, phone number
     * @param {String} username
     * @returns {Promise<IGUserMetadata>}
     */
    fetchUser: (username: string) => Promise<IGUserMetadata>;
    fetchUserV2: (username: string) => Promise<GraphqlUser>;
    /**
     * simple method to check is user follow me
     * @param username
     * @returns true if user is follow me
     */
    isFollowMe: (username: string) => Promise<boolean>;
    /**
     *
     * @param {StoriesGraphQL} metadata
     * @returns {ItemStories[]}
     */
    private _parseStories;
    /**
     * fetches stories metadata
     * @param {string} username username target to fetch the stories, also work with private profile if you use session id \w your account that follows target account
     * @returns
     */
    fetchStories: (username: string) => Promise<IGStoriesMetadata>;
    /**
     * Fetch all reels/highlight id
     * @param {username} username
     * @returns
     */
    private _getReelsIds;
    /**
     * get media urls from highlight id
     * @param {ids} id of highlight
     * @returns
     */
    private _getReels;
    /**
     * fetches highlight metadata (REQUIRES SESSION ID)
     * @param {string} username username target to fetch the highlights, also work with private profile if you use session id \w your account that follows target account
     * @returns
     */
    fetchHighlights: (username: string) => Promise<IHighlightsMetadata>;
    private uploadPhoto;
    /**
     * Post a photo to instagram
     * @param photo
     * @param type post type
     * @param options
     * @returns
     */
    addPost: (photo: string | Buffer, type: "feed" | "story" | undefined, options: MediaConfigureOptions) => Promise<PostFeedResult | PostStoryResult>;
}
