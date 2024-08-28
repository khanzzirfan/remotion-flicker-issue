/* eslint-disable react/forbid-prop-types */
import React, {useEffect, useRef, useState} from 'react';
import {Container, useTick, useApp, Sprite} from '@pixi/react';
import inRange from 'lodash/inRange';
import * as PIXI from 'pixi.js';

// add types for the component
export interface PixiSequenceWrapperProps {
	spriteHelperRef: any;
	startAt: number;
	endAt: number;
	children: React.ReactNode;
}

export const PixiSequenceWrapper = ({
	spriteHelperRef,
	startAt,
	endAt,
	children,
}: PixiSequenceWrapperProps) => {
	// get actual frame with the difference of start time from the frame
	/// / State
	/// / Refs
	const containerRef = useRef<PIXI.Container>(null);

	useTick(() => {
		// do something here
		/// const iteration = (i += 0.05 * delta);
		const {frame: actualFrame} = spriteHelperRef.current;
		const isInRange = inRange(actualFrame, startAt, endAt);
		// console.log('isInRange Visiblility', uniqueId, type, isInRange, 'actualFrame' + actualFrame, 'start' + start, 'end' + end);
		if (containerRef.current) {
			containerRef.current.visible = isInRange;
		}
	});

	return <Container ref={containerRef}>{children}</Container>;
};
