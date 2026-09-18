// Tiny toast store for user-reward feedback messages.

import { writable } from 'svelte/store';

export interface Toast {
	id: number;
	message: string;
}

export const toasts = writable<Toast[]>([]);

let nextId = 1;

export function showToast(message: string): void {
	const id = nextId++;
	toasts.update((list) => [...list, { id, message }]);
	setTimeout(() => {
		toasts.update((list) => list.filter((t) => t.id !== id));
	}, 3000);
}
