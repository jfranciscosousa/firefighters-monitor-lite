import { subscribeToQuery } from 'datocms-listen';
import { writable } from 'svelte/store';
import { PUBLIC_DATO_READ_TOKEN } from '$env/static/public';

import {
	firefightersQuery,
	type FIREFIGHTER_AVAILABILITY_TYPE,
	type FIREFIGHTER_DUTY_TYPE,
	type FIREFIGHTER_TYPE
} from './firefightersQuery';
import { handleClientError } from './errors';

interface StoreType {
	firefighters?: FIREFIGHTER_TYPE[];
	loading: boolean;
}

function createFirefighters() {
	const { subscribe, update } = writable<StoreType>({
		firefighters: undefined,
		loading: false
	});

	if (typeof window !== 'undefined') {
		subscribeToQuery({
			query: firefightersQuery.toString(),
			token: PUBLIC_DATO_READ_TOKEN,
			includeDrafts: false,
			onUpdate: ({ response }) => {
				update((store) => ({ ...store, firefighters: response.data.firefighters }));
			},
			onStatusChange: (status) => {
				console.log(status);
			},
			onChannelError: (error) => {
				handleClientError(error.message, error);
			}
		});
	}

	async function updateFirefighter(
		firefighterId: string,
		updateParams: Partial<Omit<FIREFIGHTER_TYPE, 'id'>>
	) {
		update((store) => ({ ...store, loading: true }));

		const response = await fetch(`/api/firefighter/${firefighterId}`, {
			method: 'PATCH',
			body: JSON.stringify(updateParams)
		}).then((r) => r.json());

		if (response.message !== 'ok') {
			console.error("Error, couldn't update!");

			update((store) => ({
				...store,
				loading: false
			}));
		} else {
			update((store) => ({
				...store,
				loading: false,
				firefighters: store.firefighters?.map((firefighter) => {
					if (firefighter.id === firefighterId) {
						return { ...firefighter, ...updateParams } as FIREFIGHTER_TYPE;
					}

					return firefighter;
				})
			}));
		}
	}

	async function updateAvailability(firefighter: FIREFIGHTER_TYPE) {
		let nextAvailability: FIREFIGHTER_AVAILABILITY_TYPE = 'unavailable';

		if (firefighter.availability === 'unavailable') nextAvailability = 'onCall';
		if (firefighter.availability === 'onCall') nextAvailability = 'available';
		if (firefighter.availability === 'available') nextAvailability = 'service';
		if (firefighter.availability === 'service') nextAvailability = 'unavailable';

		const updateParams = { availability: nextAvailability };

		updateFirefighter(firefighter.id, updateParams);
	}

	async function updateDutyType(firefighter: FIREFIGHTER_TYPE) {
		let nextDutyType: FIREFIGHTER_DUTY_TYPE | null = 'picket';

		if (firefighter.dutyType === 'picket') nextDutyType = 'ecin';
		if (firefighter.dutyType === 'ecin') nextDutyType = 'eip';
		if (firefighter.dutyType === 'eip') nextDutyType = null;

		const updateParams = { dutyType: nextDutyType as FIREFIGHTER_DUTY_TYPE };

		updateFirefighter(firefighter.id, updateParams);
	}

	return {
		subscribe,
		updateAvailability,
		updateDutyType
	};
}

const firefightersStore = createFirefighters();

export default firefightersStore;
