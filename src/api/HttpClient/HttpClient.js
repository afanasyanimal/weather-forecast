import _ from 'lodash';
import * as queryString from '../../lib/queryString';

export class HttpClient {
	/**
	 *
	 * @returns {{DELETE: string, POST: string, GET: string, PATCH: string, PUT: string}}
	 * @constructor
	 */
	get METHOD() {
		return {
			GET: 'get',
			PATCH: 'patch',
			PUT: 'put',
			POST: 'post',
			DELETE: 'delete',
		};
	}

	/**
	 *
	 * @returns {{ACCEPT: string, CONTENT_TYPE: string}}
	 * @constructor
	 */
	get HEADER() {
		return {
			ACCEPT: 'Accept',
			CONTENT_TYPE: 'Content-Type',
		};
	}

	/**
	 *
	 * @returns {{[p: string]: string}}
	 * @constructor
	 */
	get DEFAULT_HEADERS() {
		return {
			[this.HEADER.ACCEPT]: 'application/json',
			[this.HEADER.CONTENT_TYPE]: 'application/json',
		};
	}

	/**
	 *
	 * @param host
	 */
	constructor(host) {
		this.host = host;
	}

	/**
	 *
	 * @param requestUrl
	 * @param params
	 * @returns {Promise<*>}
	 */
	get(requestUrl, params = {}) {
		return this.request({
			url: requestUrl,
			method: this.METHOD.GET,
			params,
		});
	}

	/**
	 *
	 * @param requestUrl
	 * @param payload
	 * @returns {Promise<*>}
	 */
	put(requestUrl, payload = {}) {
		return this.request(
			{
				url: requestUrl,
				method: this.METHOD.PUT,
				body: payload,
			},
		);
	}

	/**
	 *
	 * @param requestUrl
	 * @param payload
	 * @returns {Promise<*>}
	 */
	patch(requestUrl, payload = {}) {
		return this.request(
			{
				url: requestUrl,
				method: this.METHOD.PATCH,
				body: payload,
			},
		);
	}

	/**
	 *
	 * @param requestUrl
	 * @param payload
	 * @returns {Promise<*>}
	 */
	post(requestUrl, payload = {}) {
		return this.request(
			{
				url: requestUrl,
				method: this.METHOD.POST,
				body: payload,
			},
		);
	}

	/**
	 *
	 * @param requestUrl
	 * @param payload
	 * @returns {Promise<*>}
	 */
	delete(requestUrl, payload = {}) {
		return this.request(
			{
				url: requestUrl,
				method: this.METHOD.DELETE,
				body: payload,
			},
		);
	}

	/**
	 *
	 * @param {Object} request
	 * @param {String} request.url
	 * @param {String} request.method
	 * @param {Object} request.params
	 * @param {Object} request.body
	 * @returns {Promise<*|{response, options}>}
	 */
	async request({ url, method, params = {}, body }) {
		const _url = this._getRequestUrl(url, params);

		const _req = this._buildRequestParams({ body, method });

		const _res = await fetch(_url, _req);

		return this._handleResponse(_res);
	}

	/**
	 *
	 * @param url
	 * @param params
	 * @returns {string}
	 * @private
	 */
	_getRequestUrl(url, params) {
		const _params = this._prepareRequestParams(params);

		return `${this.host}/${url}?${queryString.stringify(_params)}`;
	}

	/**
	 *
	 * @param body
	 * @param method
	 * @returns {Promise<{headers: {[p: string]: string}, method, credentials: string, body: (string|*)}>}
	 * @private
	 */
	async _buildRequestParams({ body, method }) {
		return {
			method,
			headers: this.DEFAULT_HEADERS,
			body: this._prepareRequestBody(body, method),
			credentials: 'same-origin',
		};
	}

	/**
	 *
	 * @param body
	 * @param method
	 * @returns {string|*}
	 * @private
	 */
	_prepareRequestBody(body, method) {
		const _body = _.cloneDeep(body);

		if (!_.includes(['get', 'head'], method)) return JSON.stringify(body);

		return _body;
	}

	/**
	 *
	 * @param params
	 * @returns {}
	 * @private
	 */
	_prepareRequestParams(params) {
		const _params = _.cloneDeep(params);

		return _.omitBy(_params, value => {
			if (_.isUndefined(value)) return true;

			if (_.isString(value) && _.isEmpty(value)) return true;

			return false;
		});
	}

	/**
	 *
	 * @param {Object} res - fetch response
	 * @returns {Promise<{response: {ok}, options}|{ok}|Promise<*|null|undefined>>}
	 * @private
	 */
	async _handleResponse(res) {
		let body = {};

		try {
			body = await res.json();
		} catch (e) {
			body.message = 'Response in not JSON format.';
		}

		if (!res.ok) return this._handleError(body);

		return body;
	}

	/**
	 *
	 * @param {Object} body - fetch response
	 * @returns {Promise<void>}
	 * @private
	 */
	async _handleError(body) {
		throw body;
	}
}
