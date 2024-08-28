/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';

// @ts-ignore
const ContextBridge = ({children, Context, render}) => {
	return (
		<Context.Consumer>
			{/* @ts-ignore */}
			{(value) => {
				return render(
					<Context.Provider value={value}>{children}</Context.Provider>
				);
			}}
		</Context.Consumer>
	);
};

export default ContextBridge;
