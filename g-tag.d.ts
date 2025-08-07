declare namespace globalThis {
	function gtag(...args: unknown[]): void;

	interface Window {
		gtag: typeof gtag;
	}
}
