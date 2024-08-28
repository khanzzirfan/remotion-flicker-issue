/* eslint-disable @typescript-eslint/no-explicit-any */
import {GsapPixieContextProvider} from 'reacthub-pixitweenjs';
import {GsapPixiTest} from './GsapPixiTest';

export const GsapComposition = (props: any) => {
	return (
		<GsapPixieContextProvider>
			<GsapPixiTest {...props} />
		</GsapPixieContextProvider>
	);
};
