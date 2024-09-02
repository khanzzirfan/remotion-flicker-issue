/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {useCallback} from 'react';
import React, {useImperativeHandle} from 'react';
import {Gif} from '@remotion/gif';

export interface GifOnCanvasProps {
	height: number;
	width: number;
	src: string;
	startFrom: number;
	durationInFrames: number;
	dataId: string;
}

export const GifOnCanvas = React.forwardRef((props: GifOnCanvasProps, ref) => {
	const {height, width, src, dataId = '', startFrom, durationInFrames} = props;
	const videoRef = React.useRef(null);
	const rafRef = React.useRef<any>();
	const canvasRef = React.useRef(null);

	console.log('incoming props', props, startFrom, durationInFrames);

	useImperativeHandle(
		ref,
		() => {
			// Return our API
			return {
				getCanvas() {
					return canvasRef.current;
				},
			};
		},
		[]
	);

	const animate = useCallback(() => {
		rafRef.current = requestAnimationFrame(animate);
		if (!canvasRef.current || !videoRef.current) {
			return;
		}
		// @ts-ignore
		const context = canvasRef.current.getContext('2d');
		if (!context) {
			return;
		}
		context.drawImage(videoRef.current, 0, 0, width, height);
	}, []);

	React.useEffect(() => {
		rafRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(rafRef.current);
	}, []); //

	return (
		<>
			<Gif
				ref={videoRef}
				src={src}
				style={{opacity: 0}}
				width={width}
				height={height}
				fit="fill"
				playbackRate={1}
				// @ts-ignore
				crossOrigin="anonymous"
			/>
			<>
				<canvas ref={canvasRef} width={width} height={height} id={dataId} />
			</>
		</>
	);
});
