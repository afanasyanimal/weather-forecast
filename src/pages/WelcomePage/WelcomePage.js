import { useEffect } from 'react';
import api from '../../api';
import logo from '../../assets/logo.svg';
import './styles.css';

const requestWeather = async (lat = 49.8040832, lon = 23.2423424) => { // для данного действия должен быть созданн кастомный хук
	const weather = await api.weather.current(lat, lon);

	console.log(weather);

	return weather;
};

function WelcomePage() {

	useEffect(() => {
		requestWeather();
	}, ['static']);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo"/>
				<p>
					Weather Forecast
				</p>
			</header>
		</div>
	);
}

export default WelcomePage;
