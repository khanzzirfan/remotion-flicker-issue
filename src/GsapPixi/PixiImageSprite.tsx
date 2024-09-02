/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {Sprite, Container} from '@pixi/react';

export const ImageSprite = (props: any) => {
	const {startAt, endAt, src, x, y} = props;
	/// refs
	const imageRef = React.useRef(null);
	const imgGroupRef = React.useRef(null);

	const imageProps = {
		uniqueId: 'image-filters001' + Number(startAt), // UniqueId of the sprite
		src: src || 'http://i.imgur.com/wehQ1GV.jpg',
		applyTransformer: false,
		startAt: startAt || 0,
		endAt: endAt || 5,
		initialAlpha: 1,
		transformation: {
			x,
			y,
			width: 300,
			height: 300,
			anchor: 0.5,
			rotation: 0,
			alpha: 1,
			scale: 1,
			tint: 0xffffff,
			blendMode: 0,
		},
		visible: true,
	};

	return (
		<Container ref={imgGroupRef}>
			<Sprite
				/// image="https://assets.codepen.io/693612/surya.svg"
				ref={imageRef}
				image={imageProps.src}
				width={150}
				height={150}
				anchor={0.5}
				zIndex={10}
				x={x}
				y={y}
				scale={1}
			/>
		</Container>
	);
};
