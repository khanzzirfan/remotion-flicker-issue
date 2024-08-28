/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import ContextBridge from './ContextBridge';
import {Stage as PixiStage} from '@pixi/react';
import {GsapPixieContext} from 'reacthub-pixitweenjs';

// @ts-ignore
const Stage = ({children, ...props}) => {
	return (
		<ContextBridge
			Context={GsapPixieContext}
			// @ts-ignore
			render={(children) => <PixiStage {...props}>{children}</PixiStage>}
		>
			{children}
		</ContextBridge>
	);
};

export default Stage;
