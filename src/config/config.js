import _ from 'lodash';
import * as _settings from './settings';

/**
 * Class for interacting with configuration
 */
export class Config {
	static _inst = null;

	constructor() {
		_.forOwn(_settings, setting => {
			this._config = { ...this._config, ...setting };
		});
	}

	/**
	 * @param {Object} [opts] - options
	 * @return {Config}
	 */
	static inst(opts = {}) {
		if (!Config._inst) Config._inst = new Config(opts);

		return Config._inst;
	}

	/**
	 * Get config parameter by path
	 * @param {string} _path - parameter path
	 * @param {Object} [dflt] - default value
	 */
	static get(_path, dflt) {
		return this.inst()._get(_path, dflt);
	}

	/**
	 * Method to retrieve config parameters
	 * @param {string} path - parameter path
	 * @param {Object} [defaultValue] - default value for this parameter
	 */
	_get(path, defaultValue) {
		let value = _.get(this._config, path);

		if (!_.isNil(value)) return value;

		if (!_.isNil(defaultValue)) return defaultValue;

		throw new Error(`Config value "${path}" is not defined`);
	}
}
