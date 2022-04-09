import { useIsMounted } from './useIsMounted';

export const useLoading = (fn = () => {}, setter) => {
	const isMounted = useIsMounted();

	return async (...args) => {
		if (isMounted.current) setter(true);
		try {
			let response = await fn(...args);
			if (isMounted.current) setter(false);
			return response;
		} finally {
			if (isMounted.current) setter(false);
		}
	};
};
