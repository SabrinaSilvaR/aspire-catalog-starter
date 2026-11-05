import { createContext } from 'react';
import { type FeatureHandler } from '../feature.handler.ts';

export const FeatureContext = createContext<FeatureHandler | null>(null);

/**
 * Injects FeatureHandler to React context.
 *
 * @example
 * ```ts
 *	import { FeatureHandler, FeatureProvider } from '@feature-handler';
 *
 *	const features = new FeatureHandler({
 *		FEATURE_X_V1: true,
 *		FEATURE_Y_V2: import.meta.env.FEATURE_Y_V2 === 'true',
 *		FEATURE_Z_V2: globalThis.FEATURES.Z_V2,
 *	});
 *
 *	export const App = () => {
 *		return (
 *			<FeatureProvider handler={features}>
 *				<App />
 *			</FeatureProvider>
 *		);
 *	};
 *```
 */
export const FeatureProvider = ({
	children,
	handler,
}: FeatureProviderProps) => {
	return (
		<FeatureContext.Provider value={handler}>
			{children}
		</FeatureContext.Provider>
	);
};

export interface FeatureProviderProps extends React.PropsWithChildren {
	handler: FeatureHandler;
}
