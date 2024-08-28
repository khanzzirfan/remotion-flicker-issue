/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {useEffect, useImperativeHandle, useCallback} from 'react';
import {AbsoluteFill, Video} from 'remotion';

// @ts-ignore
export const VideoOnCanvas = React.forwardRef((props, ref) => {
	// @ts-ignore
	const {height, width, startFrom, durationInFrames, src, dataId} = props;
	const videoRef = React.useRef(null);
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

	/** Video frame transformation */
	// Process a frame
	const onVideoFrame = useCallback(() => {
		if (!canvasRef.current || !videoRef.current) {
			return;
		}
		// @ts-ignore
		const context = canvasRef.current.getContext('2d');
		if (!context) {
			return;
		}
		// Context.filter = 'grayscale(100%)';
		context.drawImage(videoRef.current, 0, 0, width, height);
	}, [height, width]);

	// Synchronize the video with the canvas
	useEffect(() => {
		const {current} = videoRef;
		// @ts-ignore
		if (!current?.requestVideoFrameCallback) {
			return;
		}
		let handle = 0;
		const callback = () => {
			onVideoFrame();
			// @ts-ignore
			handle = current.requestVideoFrameCallback(callback);
		};
		callback();
		return () => {
			// @ts-ignore
			current.cancelVideoFrameCallback(handle);
		};
	}, [onVideoFrame]);

	return (
		<AbsoluteFill>
			<Video
				ref={videoRef}
				// Hide the original video tag
				style={{opacity: 0}}
				startFrom={startFrom}
				endAt={durationInFrames}
				src={src}
				crossOrigin="anonymous"
				data-id={dataId}
				id={dataId}
				width={width}
				height={height}
			/>
			<AbsoluteFill style={{opacity: 1}}>
				<canvas ref={canvasRef} width={width} height={height} id={dataId} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
});
