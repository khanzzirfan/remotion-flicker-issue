import {Composition} from 'remotion';
import {GsapComposition} from './GsapPixi/GsapComposition';

// Each <Composition> is an entry in the sidebar!
const fps = 30;
const totalDuration = 30;
const durationInFrames = totalDuration * fps;

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="GsapPixiTest"
				component={GsapComposition}
				durationInFrames={durationInFrames}
				fps={fps}
				width={1920}
				height={1080}
				defaultProps={{
					totalDuration,
					width: 1920,
					height: 1080,
					fps,
				}}
			/>

			<Composition
				id="RemotionPixiTest"
				component={GsapComposition}
				durationInFrames={durationInFrames}
				fps={fps}
				width={1920}
				height={1080}
				defaultProps={{
					totalDuration,
					width: 1920,
					height: 1080,
					fps,
				}}
			/>
		</>
	);
};
