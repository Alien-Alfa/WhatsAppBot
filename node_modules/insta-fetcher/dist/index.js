"use strict";
/* Muhamad Ristiyanto _ https://github.com/Gimenz
 * Created, Published at Selasa, 9 Maret 2021
 * Modified, Updated at Minggu, 20 Februari 2022
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.igApi = exports.InstagramMetadata = void 0;
const axios_1 = __importDefault(require("axios"));
const index_1 = require("./utils/index");
const CookieHandler_1 = require("./helper/CookieHandler");
const types_1 = require("./types");
const query_1 = require("./helper/query");
const config_1 = require("./config");
const fs_1 = __importDefault(require("fs"));
const Session_1 = require("./helper/Session");
__exportStar(require("./utils"), exports);
exports.InstagramMetadata = __importStar(require("./types"));
__exportStar(require("./helper/Session"), exports);
class igApi {
    /**
     * Recommended to set session id for most all IG Request
     * @param session_id session id you can get it by using getSessionId function, see README.md or example file
     */
    constructor(session_id = '') {
        this.session_id = session_id;
        this.cookie = new CookieHandler_1.CookieHandler(this.session_id);
        this.buildHeaders = (agent = config_1.config.android, options) => {
            return Object.assign({ 'user-agent': agent, 'cookie': `sessionid=${this.cookie.get() || this.session_id};`, 'authority': 'www.instagram.com', 'content-type': 'application/x-www-form-urlencoded', 'origin': 'https://www.instagram.com', 'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7', 'sec-fetch-site': 'same-origin', 'sec-fetch-mode': 'cors', 'sec-fetch-dest': 'empty', 'x-ig-app-id': 936619743392459, 'x-ig-www-claim': 'hmac.AR3W0DThY2Mu5Fag4sW5u3RhaR3qhFD_5wvYbOJOD9qaPjIf', 'x-instagram-ajax': 1, 'x-requested-with': 'XMLHttpRequest' }, options);
        };
        /** Make request to IG API */
        this.FetchIGAPI = (baseURL, url = '', agent = config_1.config.android, options = {}) => {
            return (0, axios_1.default)(Object.assign({ baseURL,
                url, headers: options.headers ? options.headers : this.buildHeaders(agent), method: options.method || 'GET' }, options));
        };
        /**
         * Set session id for most all IG Request
         * @param {session_id} session_id
         */
        this.setCookie = (session_id = this.session_id) => {
            try {
                if (!this.cookie.check()) {
                    this.cookie.save(session_id);
                }
                else {
                    this.cookie.update(session_id);
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        };
        /**
         * get user id by username
         * @param {username} username
         * @returns
         */
        this.getIdByUsername = (username) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.FetchIGAPI(config_1.config.instagram_base_url, `/${username}/?__a=1`, config_1.config.iPhone);
                return data.graphql.user.id;
            }
            catch (error) {
                if (error.response.status == 403) {
                    throw new Error('Forbidden, try set cookie first');
                }
                else if (error.response.status == 401) {
                    throw new Error('Unauthorized, try set cookie first');
                }
                else if (error.request) {
                    throw new Error(error.request);
                }
                else {
                    throw new Error(error.message);
                }
            }
        });
        // /**
        //  * format metadata
        //  * @param {PostGraphQL} metadata
        //  * @returns
        //  */
        // private _formatSidecar = (metadata: PostGraphQL): Array<links> => {
        // 	const graphql = metadata.shortcode_media;
        // 	let links: links[] = [];
        // 	if (graphql.__typename == 'GraphSidecar') {
        // 		graphql.edge_sidecar_to_children.edges.forEach(doc => {
        // 			let obj = {} as links;
        // 			obj.type = doc.node.is_video ? 'video' : 'image';
        // 			obj.url = doc.node.is_video ? doc.node.video_url : doc.node.display_url;
        // 			obj.dimensions = doc.node.dimensions
        // 			links.push(obj);
        // 		})
        // 	} else if (graphql.__typename == 'GraphVideo') {
        // 		let obj = {} as links;
        // 		obj.type = graphql.is_video ? 'video' : 'image';
        // 		obj.url = graphql.is_video ? graphql.video_url : graphql.display_url;
        // 		obj.dimensions = graphql.dimensions
        // 		links.push(obj);
        // 	} else if (graphql.__typename == 'GraphImage') {
        // 		let obj = {} as links;
        // 		obj.type = graphql.is_video ? 'video' : 'image';
        // 		obj.url = graphql.is_video ? graphql.video_url : graphql.display_url;
        // 		obj.dimensions = graphql.dimensions
        // 		links.push(obj);
        // 	}
        // 	return links;
        // }
        // /**
        //  * fetch instagram post by url
        //  * @param {url} url url of instagram post, you can get metadata from private profile if you use session id \w your account that follows target account
        //  * @returns {Promise<IGPostMetadata>}
        //  */
        // public fetchPost = async (url: url): Promise<IGPostMetadata> => {
        // 	try {
        // 		if (!this.cookie.check()) throw new Error('set cookie first to use this function');
        // 		const post = shortcodeFormatter(url);
        // 		const req = (await IGFetchDesktop.get(`/${post.type}/${post.shortcode}/?__a=1`))
        // 		console.log(req.data);
        // 		const graphql: PostGraphQL = req.data.graphql;
        // 		const metaData = graphql.shortcode_media;
        // 		return {
        // 			username: metaData.owner.username,
        // 			name: metaData.owner.full_name,
        // 			media_id: metaData.id,
        // 			shortcode: metaData.shortcode,
        // 			taken_at_timestamp: metaData.taken_at_timestamp,
        // 			likes: metaData.edge_media_preview_like.count,
        // 			caption: metaData.edge_media_to_caption.edges.length >= 1
        // 				? metaData.edge_media_to_caption.edges[0].node.text
        // 				: '',
        // 			media_count:
        // 				metaData.__typename == 'GraphSidecar'
        // 					? metaData.edge_sidecar_to_children.edges.length
        // 					: 1,
        // 			comment_count: metaData.edge_media_to_parent_comment.count,
        // 			links: this._formatSidecar(graphql),
        // 		};
        // 	} catch (error: any | AxiosError) {		
        // 		if (axios.isAxiosError(error)) {
        // 			if (error.response?.status == 404) {
        // 				throw new Error('Post Not Found');
        // 			} else if (error.response?.status == 403) {
        // 				throw new Error('Forbidden, try set cookie first');
        // 			} else if (error.response?.status == 401) {
        // 				throw new Error('Unauthorized, try set cookie first');
        // 			} else {
        // 				throw error.toJSON()
        // 			}
        // 		} else {
        // 			throw error;
        // 		}
        // 	}
        // }
        this._formatSidecar = (data) => {
            var _a, _b, _c;
            const gql = data.items[0];
            let urls = [];
            if (gql.product_type == types_1.ProductType.CAROUSEL) {
                gql.carousel_media.forEach((v, i, a) => {
                    var _a, _b, _c;
                    urls.push({
                        id: v.id,
                        url: v.media_type == types_1.MediaType.IMAGE ? v.image_versions2.candidates[0].url : ((_a = v.video_versions) === null || _a === void 0 ? void 0 : _a[0].url) || '',
                        type: v.media_type == types_1.MediaType.IMAGE ? 'image' : 'video',
                        dimensions: {
                            height: v.media_type == types_1.MediaType.IMAGE ? v.image_versions2.candidates[0].height : ((_b = v.video_versions) === null || _b === void 0 ? void 0 : _b[0].height) || 0,
                            width: v.media_type == types_1.MediaType.IMAGE ? v.image_versions2.candidates[0].width : ((_c = v.video_versions) === null || _c === void 0 ? void 0 : _c[0].width) || 0
                        }
                    });
                });
            }
            else if (gql.product_type == types_1.ProductType.REEL) {
                urls.push({
                    id: gql.id,
                    url: gql.video_versions[0].url,
                    type: 'video',
                    dimensions: {
                        height: gql.video_versions[0].height,
                        width: gql.video_versions[0].width
                    }
                });
            }
            else if (gql.product_type == types_1.ProductType.TV) {
                urls.push({
                    id: gql.id,
                    url: gql.video_versions[0].url,
                    type: 'video',
                    dimensions: {
                        height: gql.video_versions[0].height,
                        width: gql.video_versions[0].width
                    }
                });
            }
            else if (gql.product_type == types_1.ProductType.SINGLE) {
                urls.push({
                    id: gql.id,
                    url: gql.media_type == types_1.MediaType.IMAGE ? gql.image_versions2.candidates[0].url : ((_a = gql.video_versions) === null || _a === void 0 ? void 0 : _a[0].url) || '',
                    type: gql.media_type == types_1.MediaType.IMAGE ? 'image' : 'video',
                    dimensions: {
                        height: gql.media_type == types_1.MediaType.IMAGE ? gql.image_versions2.candidates[0].height : ((_b = gql.video_versions) === null || _b === void 0 ? void 0 : _b[0].height) || 0,
                        width: gql.media_type == types_1.MediaType.IMAGE ? gql.image_versions2.candidates[0].width : ((_c = gql.video_versions) === null || _c === void 0 ? void 0 : _c[0].width) || 0
                    }
                });
            }
            return urls;
        };
        this.fetchPost = (url) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (!this.session_id)
                throw new Error('set cookie first to use this function');
            const post = (0, index_1.shortcodeFormatter)(url);
            //const req = (await IGFetchDesktop.get(`/${post.type}/${post.shortcode}/?__a=1`))
            const req = yield this.FetchIGAPI(config_1.config.instagram_base_url, `/${post.type}/${post.shortcode}/?__a=1`, config_1.config.desktop);
            const metadata = req.data;
            const item = metadata.items[0];
            try {
                return {
                    username: item.user.username,
                    name: item.user.full_name,
                    postType: (0, index_1.getPostType)(item.product_type),
                    media_id: item.id,
                    shortcode: item.code,
                    taken_at_timestamp: item.taken_at,
                    likes: item.like_count,
                    caption: ((_a = item.caption) === null || _a === void 0 ? void 0 : _a.text) || null,
                    media_count: item.product_type == types_1.ProductType.CAROUSEL ? item.carousel_media_count : 1,
                    comment_count: item.comment_count,
                    video_duration: (item === null || item === void 0 ? void 0 : item.video_duration) || null,
                    music: (item === null || item === void 0 ? void 0 : item.clips_metadata) || null,
                    links: this._formatSidecar(metadata),
                };
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) == 404) {
                        throw new Error('Post Not Found');
                    }
                    else if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) == 403) {
                        throw new Error('Forbidden, try set cookie first');
                    }
                    else if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) == 401) {
                        throw new Error('Unauthorized, try set cookie first');
                    }
                    else {
                        throw error.toJSON();
                    }
                }
                else {
                    throw error;
                }
            }
        });
        /**
         * fetch profile by username. including email, phone number
         * @param {String} username
         * @returns {Promise<IGUserMetadata>}
         */
        this.fetchUser = (username) => __awaiter(this, void 0, void 0, function* () {
            var _e, _f, _g;
            try {
                const userID = yield this.getIdByUsername(username);
                // const { data } = await IGUser.get(`/${userID}/info/`);
                const { data } = yield this.FetchIGAPI(config_1.config.instagram_user_url, `/${userID}/info/`);
                const graphql = data;
                const isSet = typeof graphql.user.full_name !== 'undefined';
                if (!this.session_id)
                    throw new Error('set cookie first to use this function');
                if (!isSet && this.cookie.check())
                    throw new Error('Invalid cookie, pls update with new cookie');
                return {
                    id: graphql.user.pk,
                    username: graphql.user.username,
                    fullname: graphql.user.full_name,
                    followers: graphql.user.follower_count,
                    following: graphql.user.following_count,
                    post_count: graphql.user.media_count,
                    is_private: graphql.user.is_private,
                    is_verified: graphql.user.is_verified,
                    biography: graphql.user.biography,
                    external_url: graphql.user.external_url,
                    total_igtv_videos: graphql.user.total_igtv_videos,
                    has_videos: graphql.user.has_videos,
                    hd_profile_pic_url_info: graphql.user.hd_profile_pic_url_info,
                    has_highlight_reels: graphql.user.has_highlight_reels,
                    has_guides: graphql.user.has_guides,
                    is_business: graphql.user.is_business,
                    contact_phone_number: graphql.user.contact_phone_number,
                    public_email: graphql.user.public_email,
                    account_type: graphql.user.account_type,
                };
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    if (((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) == 404) {
                        throw new Error('User Not Found');
                    }
                    else if (((_f = error.response) === null || _f === void 0 ? void 0 : _f.status) == 403) {
                        throw new Error('Forbidden, try set cookie first');
                    }
                    else if (((_g = error.response) === null || _g === void 0 ? void 0 : _g.status) == 401) {
                        throw new Error('Unauthorized, try set cookie first');
                    }
                    else {
                        throw error.toJSON();
                    }
                }
                else {
                    throw error;
                }
            }
        });
        this.fetchUserV2 = (username) => __awaiter(this, void 0, void 0, function* () {
            var _h, _j, _k;
            try {
                const { data } = yield this.FetchIGAPI(config_1.config.instagram_base_url, `/${username}/?__a=1`);
                const { graphql } = data;
                return graphql.user;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    if (((_h = error.response) === null || _h === void 0 ? void 0 : _h.status) == 404) {
                        throw new Error('User Not Found');
                    }
                    else if (((_j = error.response) === null || _j === void 0 ? void 0 : _j.status) == 403) {
                        throw new Error('Forbidden, try set cookie first');
                    }
                    else if (((_k = error.response) === null || _k === void 0 ? void 0 : _k.status) == 401) {
                        throw new Error('Unauthorized, try set cookie first');
                    }
                    else {
                        throw error.toJSON();
                    }
                }
                else {
                    throw error;
                }
            }
        });
        /**
         * simple method to check is user follow me
         * @param username
         * @returns true if user is follow me
         */
        this.isFollowMe = (username) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.fetchUserV2(username);
            return user.follows_viewer;
        });
        /**
         *
         * @param {StoriesGraphQL} metadata
         * @returns {ItemStories[]}
         */
        this._parseStories = (metadata) => {
            const items = metadata.items;
            let storyList = new Array();
            for (let i = 0; i < items.length; i++) {
                if (items[i].media_type == 1) {
                    storyList.push({
                        type: 'image',
                        mimetype: 'image/jpeg',
                        url: items[i].image_versions2.candidates[0].url,
                        taken_at: items[i].taken_at,
                        expiring_at: items[i].expiring_at,
                        id: items[i].id,
                        original_width: items[i].original_width,
                        original_height: items[i].original_height,
                        has_audio: items[i].has_audio !== undefined ? items[i].has_audio : null,
                        video_duration: items[i].video_duration !== undefined
                            ? items[i].video_duration
                            : null,
                        caption: items[i].caption,
                    });
                }
                else {
                    storyList.push({
                        type: 'video',
                        mimetype: 'video/mp4',
                        url: items[i].video_versions[0].url,
                        taken_at: items[i].taken_at,
                        expiring_at: items[i].expiring_at,
                        id: items[i].id,
                        original_width: items[i].original_width,
                        original_height: items[i].original_height,
                        has_audio: items[i].has_audio !== undefined ? items[i].has_audio : false,
                        video_duration: items[i].video_duration !== undefined
                            ? items[i].video_duration
                            : null,
                        caption: items[i].caption,
                    });
                }
            }
            return storyList;
        };
        /**
         * fetches stories metadata
         * @param {string} username username target to fetch the stories, also work with private profile if you use session id \w your account that follows target account
         * @returns
         */
        this.fetchStories = (username) => __awaiter(this, void 0, void 0, function* () {
            var _l, _m, _o;
            try {
                if (!this.session_id)
                    throw new Error('set cookie first to use this function');
                const userID = yield this.getIdByUsername(username);
                //const { data } = await IGStories.get(`/${userID}/reel_media/`);
                const { data } = yield this.FetchIGAPI(config_1.config.instagram_stories_url, `/${userID}/reel_media/`, config_1.config.iPhone);
                const graphql = data;
                const isFollowing = typeof graphql.user.friendship_status !== 'undefined';
                if (!isFollowing && graphql.user.is_private)
                    throw new Error('Private profile');
                if (graphql.items.length == 0)
                    throw new Error('Stories not available');
                return {
                    username: graphql.user.username,
                    stories_count: graphql.media_count,
                    stories: this._parseStories(graphql),
                };
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    if (((_l = error.response) === null || _l === void 0 ? void 0 : _l.status) == 404) {
                        throw new Error('Stories Not Found');
                    }
                    else if (((_m = error.response) === null || _m === void 0 ? void 0 : _m.status) == 403) {
                        throw new Error('Forbidden, try set cookie first');
                    }
                    else if (((_o = error.response) === null || _o === void 0 ? void 0 : _o.status) == 401) {
                        throw new Error('Unauthorized, try set cookie first');
                    }
                    else {
                        throw error.toJSON();
                    }
                }
                else {
                    throw error;
                }
            }
        });
        /**
         * Fetch all reels/highlight id
         * @param {username} username
         * @returns
         */
        this._getReelsIds = (username) => __awaiter(this, void 0, void 0, function* () {
            var _p, _q, _r;
            try {
                const userID = yield this.getIdByUsername(username);
                // const { data } = await IGHighlight.get('', {
                // 	params: highlight_ids_query(userID)
                // })
                const { data } = yield this.FetchIGAPI(config_1.config.instagram_graphql, '', config_1.config.iPhone, { params: (0, query_1.highlight_ids_query)(userID) });
                const graphql = data;
                let items = new Array();
                graphql.data.user.edge_highlight_reels.edges.map((edge) => {
                    items.push({
                        highlight_id: edge.node.id,
                        cover: edge.node.cover_media.thumbnail_src,
                        title: edge.node.title
                    });
                });
                return items;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    if (((_p = error.response) === null || _p === void 0 ? void 0 : _p.status) == 404) {
                        throw new Error('Post Not Found');
                    }
                    else if (((_q = error.response) === null || _q === void 0 ? void 0 : _q.status) == 403) {
                        throw new Error('Forbidden, try set cookie first');
                    }
                    else if (((_r = error.response) === null || _r === void 0 ? void 0 : _r.status) == 401) {
                        throw new Error('Unauthorized, try set cookie first');
                    }
                    else {
                        throw error.toJSON();
                    }
                }
                else {
                    throw error;
                }
            }
        });
        /**
         * get media urls from highlight id
         * @param {ids} id of highlight
         * @returns
         */
        this._getReels = (ids) => __awaiter(this, void 0, void 0, function* () {
            var _s, _t, _u;
            try {
                // const { data } = await IGHighlight.get('', { params: highlight_media_query(ids) })
                const { data } = yield this.FetchIGAPI(config_1.config.instagram_graphql, '', config_1.config.iPhone, { params: (0, query_1.highlight_media_query)(ids) });
                const graphql = data;
                let result = graphql.data.reels_media[0].items.map((item) => ({
                    media_id: item.id,
                    mimetype: item.is_video ? 'video/mp4' || 'video/gif' : 'image/jpeg',
                    taken_at: item.taken_at_timestamp,
                    type: item.is_video ? 'video' : 'image',
                    url: item.is_video ? item.video_resources[0].src : item.display_url,
                    dimensions: item.dimensions
                }));
                return result;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    if (((_s = error.response) === null || _s === void 0 ? void 0 : _s.status) == 404) {
                        throw new Error('Post Not Found');
                    }
                    else if (((_t = error.response) === null || _t === void 0 ? void 0 : _t.status) == 403) {
                        throw new Error('Forbidden, try set cookie first');
                    }
                    else if (((_u = error.response) === null || _u === void 0 ? void 0 : _u.status) == 401) {
                        throw new Error('Unauthorized, try set cookie first');
                    }
                    else {
                        throw error.toJSON();
                    }
                }
                else {
                    throw error;
                }
            }
        });
        /**
         * fetches highlight metadata (REQUIRES SESSION ID)
         * @param {string} username username target to fetch the highlights, also work with private profile if you use session id \w your account that follows target account
         * @returns
         */
        this.fetchHighlights = (username) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.session_id)
                    throw new Error('set cookie first to use this function');
                const ids = yield this._getReelsIds(username);
                const reels = yield Promise.all(ids.map(x => this._getReels(x.highlight_id)));
                let data = [];
                for (let i = 0; i < reels.length; i++) {
                    data.push({
                        title: ids[i].title,
                        cover: ids[i].cover,
                        media_count: reels[i].length,
                        highlights_id: ids[i].highlight_id,
                        highlights: reels[i]
                    });
                }
                let json = {
                    username,
                    highlights_count: ids.length,
                    data: data
                };
                return json;
            }
            catch (error) {
                throw error;
            }
        });
        this.uploadPhoto = (photo) => __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadId = Date.now();
                const file = Buffer.isBuffer(photo)
                    ? photo
                    : fs_1.default.existsSync(photo)
                        ? fs_1.default.readFileSync(photo)
                        : photo;
                const uploadParams = {
                    media_type: 1,
                    upload_id: uploadId.toString(),
                    upload_media_height: 1080,
                    upload_media_width: 1080,
                    xsharing_user_ids: JSON.stringify([]),
                    image_compression: JSON.stringify({
                        lib_name: 'moz',
                        lib_version: '3.1.m',
                        quality: '80'
                    })
                };
                const nameEntity = `${uploadId}_0_${(0, index_1.randInt)(1000000000, 9999999999)}`;
                const ndas = {
                    'x-entity-type': 'image/jpeg',
                    offset: 0,
                    'x-entity-name': nameEntity,
                    'x-instagram-rupload-params': JSON.stringify(uploadParams),
                    'x-entity-length': Buffer.byteLength(file),
                    'Content-Length': Buffer.byteLength(file),
                    'Content-Type': 'application/octet-stream',
                    'x-ig-app-id': `1217981644879628`,
                    'Accept-Encoding': 'gzip',
                    'X-Pigeon-Rawclienttime': (Date.now() / 1000).toFixed(3),
                    'X-IG-Connection-Speed': `${(0, index_1.randInt)(3700, 1000)}kbps`,
                    'X-IG-Bandwidth-Speed-KBPS': '-1.000',
                    'X-IG-Bandwidth-TotalBytes-B': '0',
                    'X-IG-Bandwidth-TotalTime-MS': '0',
                };
                const headersPhoto = this.buildHeaders(config_1.config.android, ndas);
                const result = yield this.FetchIGAPI(`${config_1.config.instagram_base_url}`, `/rupload_igphoto/fb_uploader_${nameEntity}`, config_1.config.android, { headers: headersPhoto, data: file, method: 'POST' });
                return result.data;
            }
            catch (error) {
                throw error;
            }
        });
        /**
         * Post a photo to instagram
         * @param photo
         * @param type post type
         * @param options
         * @returns
         */
        this.addPost = (photo, type = 'feed', options) => __awaiter(this, void 0, void 0, function* () {
            if (!this.session_id)
                throw new Error('set cookie first to use this function');
            try {
                const dateObj = new Date();
                const now = dateObj
                    .toISOString()
                    .replace(/T/, ' ')
                    .replace(/\..+/, ' ');
                const offset = dateObj.getTimezoneOffset();
                const responseUpload = yield this.uploadPhoto(photo);
                const payloadForm = Object.assign({ upload_id: responseUpload.upload_id, timezone_offset: offset, date_time_original: now, date_time_digitalized: now, source_type: '4' }, options);
                let headers = {
                    'authority': 'www.instagram.com',
                    'x-ig-www-claim': 'hmac.AR2-43UfYbG2ZZLxh-BQ8N0rqGa-hESkcmxat2RqMAXejXE3',
                    'x-instagram-ajax': 'adb961e446b7-hot',
                    'content-type': 'application/x-www-form-urlencoded',
                    'accept': '*/*',
                    'user-agent': config_1.config.desktop,
                    'x-requested-with': 'XMLHttpRequest',
                    'x-csrftoken': yield (0, Session_1.getCsrfToken)(),
                    'x-ig-app-id': '1217981644879628',
                    'origin': 'https://www.instagram.com',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://www.instagram.com/create/details/',
                    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'cookie': `sessionid=${this.cookie.get() || this.session_id};`,
                };
                //let payload = `upload_id=${responseUpload.upload_id}&caption=${caption}&usertags=&custom_accessibility_caption=&retry_timeout=`
                const result = yield this.FetchIGAPI(`${config_1.config.instagram_base_url}`, `/create/${type === 'feed' ? 'configure/' : 'configure_to_story/'}`, config_1.config.android, { data: new URLSearchParams(Object.entries(payloadForm)).toString(), method: 'POST', headers: headers });
                return result.data;
            }
            catch (error) {
                throw error;
            }
        });
        this.session_id = session_id;
        this.setCookie(this.session_id);
    }
}
exports.igApi = igApi;
