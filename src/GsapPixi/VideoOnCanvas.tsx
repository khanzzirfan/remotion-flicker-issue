/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Video} from 'remotion';
import React, {useEffect, useImperativeHandle, useCallback} from 'react';
import {AbsoluteFill, OffthreadVideo} from 'remotion';

export interface VideoOnCanvasProps {
	height: number;
	width: number;
	src: string;
	startFrom: number;
	durationInFrames: number;
	dataId: string;
}

export const VideoOnCanvas = React.forwardRef(
	(props: VideoOnCanvasProps, ref) => {
		const {height, width, startFrom, durationInFrames, src, dataId} = props;
		const canvasRef = React.useRef(null);
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

		const onVideoFrameOffThread = useCallback(
			(frame: CanvasImageSource) => {
				if (!canvasRef.current) {
					return;
				}
				console.log('frame');
				// @ts-ignore
				const context = canvasRef.current?.getContext('2d');
				if (!context) {
					return;
				}

				const fr = frame as HTMLVideoElement;
				console.log({fr: fr.videoHeight, fw: fr.videoWidth});

				context.drawImage(fr, 0, 0, width, height);
			},
			[height, width]
		);
		console.log('hi', src);

		return (
			<AbsoluteFill>
				<Video
					startFrom={startFrom}
					endAt={durationInFrames}
					src={src}
					data-id={dataId}
					id={dataId}
					onVideoFrame={onVideoFrameOffThread}
					// Hide the original video tag
				/>

				<AbsoluteFill style={{opacity: 1}}>
					<canvas ref={canvasRef} width={width} height={height} id={dataId} />
				</AbsoluteFill>
			</AbsoluteFill>
		);
	}
);
