import { Config } from '../config';
import { HttpClient } from './HttpClient';

export default class WeatherAPI extends HttpClient {
	constructor() {
		const host = Config.get('weather.origin');

		super(host);

		this.setAppId();
	}

	current(lat, lon) {
		return super.get(`weather`, { lat, lon, appId: this.appId });
	}

	setAppId(appId) {
		this.appId = appId || Config.get('weather.appId');
	}
}
