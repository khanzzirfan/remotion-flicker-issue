/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {useState} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Sequence} from 'remotion';
import React from 'react';
import * as PIXI from 'pixi.js';
import {Container} from '@pixi/react';
import {continueRender, delayRender} from 'remotion';
import {map} from 'lodash';
import {VideoOnCanvas} from './VideoOnCanvas';

// import {GifOnCanvas} from './GifOnCanvas';
import Stage from './PixiStage';
import {ImageSprite} from './PixiImageSprite';
import PixiCanvasVideoSprite from './PixiCanvasVideoSprite';
import {CustomTicker} from './useCustomTicker';
import {allVideoSource} from '../data';
import {PixiSequenceWrapper as SequenceWrapper} from './PixiSequenceWrapper';

interface Transformation {
	x: number;
	y: number;
	width: number;
	height: number;
	anchor: number;
	rotation: number;
	alpha: number;
	scale: number;
	tint: number;
	blendMode: number;
	colorCorrection: Record<string, any>;
}

interface VideoProps {
	uniqueId: string;
	src: string;
	transformation: Transformation;
	applyTransformer: boolean;
	startAt: number;
	endAt: number;
	frameStartAt: number;
	frameEndAt: number;
	visible: boolean;
	mute: boolean;
	locked: boolean;
}
const resolveRedirect = async (video: string) => {
	const res = await fetch(video, {
		mode: 'cors',
	});
	return res.url;
};

const preload = async (video: string) => {
	const url = await resolveRedirect(video);
	console.log(url);
	const link = document.createElement('link');
	link.rel = 'preload';
	link.href = url;
	link.as = 'video';
	document.head.appendChild(link);
};

// @ts-ignore
export const GsapPixiTest = (props: any) => {
	console.log('incoming props', props);
	const {fps, totalDuration} = props;
	const [data, setData] = useState<VideoProps[]>([]);
	const elementRefs = React.useRef([]);
	const spriteHelperRef = React.useRef({frame: 0, fps: 30});
	const elementGroupRefs = React.useRef([]);
	const [totalTweens, setTotalTweens] = React.useState(0);
	const frameRef = React.useRef(0);
	const videoElementRefs = React.useRef<any>([]);
	const gifElementRefs = React.useRef([]);

	const frame = useCurrentFrame();
	const [width, height] = [1920, 1080];
	const [handle] = useState(() => delayRender());

	const backgroundColor = PIXI.utils.string2hex('#2D2E3C');

	React.useEffect(() => {
		spriteHelperRef.current = {
			frame,
			fps,
		};
	}, [frame, fps]);

	React.useEffect(() => {
		const allVids = map(allVideoSource, (vid) => resolveRedirect(vid));
		Promise.all([allVids])
			.then((vids) => {
				vids.forEach((vid: any) => preload(vid));
				console.log('vids', vids);
			})
			.then(() => {
				const sequencesVideoProps = allVideoSource.map((src, index) => {
					const videoUniqueId = `videoId00${index}`;
					const videoProps = {
						uniqueId: videoUniqueId, // UniqueId of the sprite
						src,
						transformation: {
							x: 590,
							y: 150,
							width: 550,
							height: 400,
							anchor: 0.5,
							rotation: 0,
							alpha: 1,
							scale: 1,
							tint: 0xffffff,
							blendMode: 0,
							colorCorrection: {},
						},
						applyTransformer: false,
						startAt: 0 + index * 10,
						endAt: 10 + index * 10,
						frameStartAt: 0,
						frameEndAt: 10,
						visible: true,
						mute: false,
						locked: false,
					};
					return videoProps;
				});
				setData(sequencesVideoProps);
				continueRender(handle);
			});
	}, []);

	const gifProps = {
		uniqueId: 'suryaGify001', // UniqueId of the sprite
		src: 'https://media.giphy.com/media/5VKbvrjxpVJCM/giphy.gif',
		locked: false,
		loop: false,
		applyTransformer: false,
		startAt: 2,
		endAt: 5,
		frameStartAt: 0,
		frameEndAt: 3,
		transformation: {
			x: 900,
			y: 500,
			width: 800,
			height: 800,
			anchor: 0.5,
			rotation: 0,
			alpha: 1,
			scale: 1,
			tint: 0xffffff,
			blendMode: 0,
			colorCorrection: {},
		},
		visible: true,
	};

	return (
		<Sequence>
			<AbsoluteFill style={{opacity: 0.1, zIndex: -999}}>
				{map(data, (videoProps) => (
					<Sequence
						key={`video-${videoProps.uniqueId}`}
						from={videoProps.startAt * fps}
						durationInFrames={videoProps.endAt * fps}
						name={`video-${videoProps.uniqueId}`}
						premountFor={30}
					>
						<VideoOnCanvas
							ref={(vref: any) => {
								videoElementRefs.current[videoProps.uniqueId] = vref;
							}}
							width={videoProps.transformation.width}
							height={videoProps.transformation.height}
							startFrom={videoProps.frameStartAt * fps}
							durationInFrames={videoProps.frameEndAt * fps}
							crossOrigin="anonymous"
							src={videoProps.src}
						/>
					</Sequence>
				))}
			</AbsoluteFill>
			<Stage
				width={width}
				height={height}
				options={{backgroundColor}}
				id="stage"
			>
				<Container sortableChildren>
					<CustomTicker targetFPS={fps} />
					{/* @ts-ignore */}
					{/* <PixiSequence
							startAt={videoProps.startAt}
							endAt={videoProps.endAt}
							uniqueId="xydedsddss"
						>
							<PixiVideoCanvasSyncSprite
								ref={(vref: any) => {
									elementRefs.current[videoUniqueId] = vref;
								}}
								{...videoProps}
								canvasImageRef={videoElementRefs.current[videoUniqueId]}
							/>
						</PixiSequence> */}

					<ImageSprite
						startAt={0}
						endAt={5}
						x={100}
						y={100}
						src="http://i.imgur.com/wehQ1GV.jpg"
					/>
					{map(data, (videoProps) => (
						<SequenceWrapper
							key={`video-${videoProps.uniqueId}`}
							startAt={videoProps.startAt * fps}
							endAt={videoProps.endAt * fps}
							spriteHelperRef={spriteHelperRef}
						>
							<PixiCanvasVideoSprite
								{...videoProps}
								canvasImageRef={videoElementRefs.current[videoProps.uniqueId]}
							/>
						</SequenceWrapper>
					))}
					{/* <PixiSequence
							startAt={gifProps.startAt}
							endAt={gifProps.endAt}
							uniqueId="xydedsddss"
						>
							<PixiGifSprite {...gifProps} />
						</PixiSequence> */}
					{/* @ts-ignore */}
				</Container>
			</Stage>
		</Sequence>
	);
};
