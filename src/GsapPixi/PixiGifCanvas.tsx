/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Gif} from '@remotion/gif';
import React, {useRef, useImperativeHandle} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';

export const RemotionGifOnCanvas = React.forwardRef(
	// @ts-ignore
	({height, width, startFrom, durationInFrames, src, dataId}, ref) => {
		const gifRef = useRef(null);

		useImperativeHandle(
			ref,
			() => {
				// Return our API
				return {
					getCanvas() {
						return gifRef.current;
					},
				};
			},
			[]
		);

		return (
			<AbsoluteFill>
				<Sequence from={startFrom} durationInFrames={durationInFrames}>
					<Gif
						ref={gifRef}
						id={dataId}
						src={src}
						width={width}
						height={height}
						fit="fill"
						playbackRate={1}
						// @ts-ignore
						crossOrigin="anonymous"
					/>
				</Sequence>
			</AbsoluteFill>
		);
	}
);
