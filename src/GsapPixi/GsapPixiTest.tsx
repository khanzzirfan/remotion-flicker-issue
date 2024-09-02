/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {useState} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Sequence} from 'remotion';
import {Stage, Container} from '@pixi/react';
import React from 'react';
import {continueRender, delayRender} from 'remotion';
import {map, filter, isEmpty} from 'lodash';
import {VideoOnCanvas} from './VideoOnCanvas';
import {GifOnCanvas} from './GifOnCanvas';
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

interface SequenceProps {
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
	elementType: string;
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
	const [data, setData] = useState<SequenceProps[]>([]);
	const [isDataReady, setIsDataReady] = useState(false);
	const spriteHelperRef = React.useRef({frame: 0, fps: 30});
	const videoElementRefs = React.useRef<any>([]);
	const gifElementRefs = React.useRef<any>([]);

	const frame = useCurrentFrame();
	const [width, height] = [1920, 1080];
	const [handle] = useState(() => delayRender());

	React.useEffect(() => {
		spriteHelperRef.current = {
			frame,
			fps,
		};
	}, [frame, fps]);

	React.useEffect(() => {
		/// https://media.giphy.com/media/3o72F7YT6s0EMFI0Za/giphy.gif
		const gifSequenceProps = [
			{
				uniqueId: 'pixiGif', // UniqueId of the sprite
				src: 'https://media.giphy.com/media/5VKbvrjxpVJCM/giphy.gif',
				locked: false,
				loop: false,
				applyTransformer: false,
				startAt: 0,
				endAt: 5,
				frameStartAt: 0,
				frameEndAt: 5,
				elementType: 'gif',
				transformation: {
					x: 400,
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
			},
			{
				uniqueId: 'remotionGif', // UniqueId of the sprite
				src: 'https://media.giphy.com/media/3o72F7YT6s0EMFI0Za/giphy.gif',
				locked: false,
				loop: false,
				elementType: 'gif',
				applyTransformer: false,
				startAt: 5,
				endAt: 10,
				frameStartAt: 0,
				frameEndAt: 5,
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
			},
		];

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
						elementType: 'video',
						transformation: {
							x: 10 + index * 150,
							y: 10 + index * 150,
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
				const allData = [...sequencesVideoProps, ...gifSequenceProps];
				const updatedData = allData.map((item) => ({
					...item,
					mute: false,
				}));
				setData(updatedData);
				setIsDataReady(true);
				continueRender(handle);
			});
	}, []);

	return (
		<>
			{isDataReady && !isEmpty(data) && (
				<Sequence>
					<AbsoluteFill style={{opacity: 0.01, zIndex: -999}}>
						{map(
							filter(data, (f) => f.elementType === 'video'),
							(seqProps) => (
								<Sequence
									key={`video-${seqProps.uniqueId}`}
									from={seqProps.startAt * fps}
									durationInFrames={seqProps.endAt * fps}
									name={`video-${seqProps.uniqueId}`}
									premountFor={30}
								>
									<VideoOnCanvas
										ref={(vref: any) => {
											videoElementRefs.current[seqProps.uniqueId] = vref;
										}}
										width={seqProps.transformation.width}
										height={seqProps.transformation.height}
										startFrom={seqProps.frameStartAt * fps}
										durationInFrames={seqProps.frameEndAt * fps}
										src={seqProps.src}
										dataId={seqProps.uniqueId}
									/>
								</Sequence>
							)
						)}
					</AbsoluteFill>
					<AbsoluteFill style={{opacity: 0.01, zIndex: -999}}>
						{map(
							filter(data, (f) => f.elementType === 'gif'),
							(seqProps) => (
								<Sequence
									key={`gif-${seqProps.uniqueId}`}
									from={seqProps.startAt * fps}
									durationInFrames={seqProps.endAt * fps}
									name={`gif-${seqProps.uniqueId}`}
									premountFor={30}
								>
									<GifOnCanvas
										ref={(vref: any) => {
											gifElementRefs.current[seqProps.uniqueId] = vref;
										}}
										width={seqProps.transformation.width}
										height={seqProps.transformation.height}
										startFrom={seqProps.frameStartAt * fps}
										durationInFrames={seqProps.frameEndAt * fps}
										dataId={seqProps.uniqueId}
										src={seqProps.src}
									/>
								</Sequence>
							)
						)}
					</AbsoluteFill>
					<Stage
						width={width}
						height={height}
						options={{
							autoDensity: true,
							backgroundColor: 0x01262a,
							antialias: true,
							resolution: window.devicePixelRatio || 1,
							powerPreference: 'high-performance',
							forceCanvas: false, // Set to true if you want to force Canvas renderer
						}}
						id="stage"
					>
						<Container sortableChildren>
							<CustomTicker targetFPS={fps} />
							<ImageSprite
								startAt={0}
								endAt={5}
								x={100}
								y={100}
								src="http://i.imgur.com/wehQ1GV.jpg"
							/>
							{map(data, (seqProps) => (
								<SequenceWrapper
									key={`video-${seqProps.uniqueId}`}
									startAt={seqProps.startAt * fps}
									endAt={seqProps.endAt * fps}
									spriteHelperRef={spriteHelperRef}
								>
									{seqProps.elementType === 'video' && (
										<PixiCanvasVideoSprite
											{...seqProps}
											canvasImageRef={
												videoElementRefs.current[seqProps.uniqueId]
											}
										/>
									)}
									{seqProps.elementType === 'gif' && (
										<PixiCanvasVideoSprite
											{...seqProps}
											canvasImageRef={gifElementRefs.current[seqProps.uniqueId]}
										/>
									)}
								</SequenceWrapper>
							))}
						</Container>
					</Stage>
				</Sequence>
			)}
		</>
	);
};
