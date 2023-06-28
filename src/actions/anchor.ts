import type { Action } from 'svelte/action';

type Position = ['TOP' | 'BOTTOM', 'LEFT' | 'RIGHT'];

export const anchor: Action<HTMLElement, { id: string; position: Position }> = (
	node: HTMLElement,
	{ id, position = ['BOTTOM', 'LEFT'] }: { id: string; position: Position }
) => {
	const vert = position[0];
	const horizontal = position[1];
	function updatePosition() {
		const anchor_position = node.getBoundingClientRect();
		const target = document.getElementById(id);

		if (target) {
			target.style.opacity = '0';
			target.style.display = 'block';

			const target_position = target?.getBoundingClientRect();
			target.style.inset = 'unset';
			if (vert === 'BOTTOM') {
				target.style.top = anchor_position.bottom + 'px';
			} else {
				target.style.top = anchor_position.bottom + 'px';
			}
			if (horizontal === 'LEFT') {
				target.style.left = anchor_position.left + 'px';
			} else {
				target.style.left = anchor_position.right - target_position.width + 'px';
			}
			target.style.opacity = '1';
			target.style.display = 'revert';
		}
	}

	// Use the ResizeObserver to watch for changes in size of 'node'
	const resizeObserver = new ResizeObserver(updatePosition);
	resizeObserver.observe(node);
	window.addEventListener('resize', updatePosition);
	return {
		destroy() {
			resizeObserver.disconnect();
			window.removeEventListener('resize', updatePosition);
		}
	};
};
