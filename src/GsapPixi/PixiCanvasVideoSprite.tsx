import React, {useRef, useImperativeHandle} from 'react';
import {Sprite, Container, useTick, useApp} from '@pixi/react';
import * as PIXI from 'pixi.js';
import isEmpty from 'lodash/isEmpty';

const PixiCanvasVideoSprite = (props: any) => {
	const {
		uniqueId,
		transformation: {x, y, width, height},
		canvasImageRef,
	} = props;

	const [updater, setUpdater] = React.useState(0);
	const videoTextureRef = React.useRef<PIXI.Texture<PIXI.Resource>>();
	const imageRef = React.useRef<PIXI.Sprite>(null);
	const containerRef = React.useRef(null);

	const canvasSource =
		canvasImageRef && canvasImageRef?.getCanvas && canvasImageRef.getCanvas();

	useTick(() => {
		if (imageRef.current) {
			if (imageRef.current?.texture) {
				const {baseTexture} = imageRef.current.texture;
				if (baseTexture) {
					baseTexture.update();
				}
			}
		}
	});

	// load
	React.useEffect(() => {
		// create a new Sprite using the video texture (yes it's that easy)
		if (!isEmpty(canvasSource)) {
			const texture = PIXI.Texture.from(canvasSource);
			// if (!texture) return;
			videoTextureRef.current = texture;
			if (imageRef?.current?.texture) {
				const {baseTexture} = imageRef.current.texture;
				if (baseTexture) {
					baseTexture.update();
				}
			}
			setUpdater((prev) => prev + 1);
		}
	}, [canvasSource]);

	return (
		<Container ref={containerRef}>
			<Sprite
				ref={imageRef}
				renderId={uniqueId}
				texture={videoTextureRef.current || PIXI.Texture.EMPTY}
				width={width}
				height={height}
				anchor={0}
				alpha={1}
				x={x}
				y={y}
			/>
		</Container>
	);
};

// memoize component
const PixiMemoizeCanvasSprite = React.memo(PixiCanvasVideoSprite);
export default PixiMemoizeCanvasSprite;
