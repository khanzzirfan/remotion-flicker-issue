import {useEffect} from 'react';
import * as PIXI from 'pixi.js';

export const CustomTicker = ({targetFPS}: {targetFPS: number}) => {
	useEffect(() => {
		const ticker = PIXI.Ticker.shared;
		ticker.maxFPS = targetFPS;

		return () => {
			ticker.stop();
		};
	}, [targetFPS]);

	return null;
};
