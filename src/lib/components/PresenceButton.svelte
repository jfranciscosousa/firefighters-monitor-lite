<script lang="ts">
	import type { FIREFIGHTER_TYPE } from '$lib/firefightersQuery';
	import firefightersStore from '$lib/firefightersStore';
	import t from '$lib/i18n';
	import AdjIcon from './AdjIcon.svelte';
	import ChiefIcon from './ChiefIcon.svelte';
	import CmdtIcon from './CmdtIcon.svelte';
	import FirstIcon from './FirstIcon.svelte';
	import SecondCmdtIcon from './SecondCmdtIcon.svelte';
	import SecondIcon from './SecondIcon.svelte';
	import SubChiefIcon from './SubChiefIcon.svelte';
	import ThirdIcon from './ThirdIcon.svelte';

	export let firefighter: FIREFIGHTER_TYPE;
</script>

<button
	class="button"
	class:button-available={firefighter.availability === 'available'}
	class:button-service={firefighter.availability === 'service'}
	class:button-on-call={firefighter.availability === 'onCall'}
	on:click={(event) => {
		if ($firefightersStore.loading) return;

		event.preventDefault();
		firefightersStore.updateAvailability(firefighter);
	}}
	on:contextmenu={(event) => {
		if ($firefightersStore.loading) return;

		event.preventDefault();
		firefightersStore.updateDutyType(firefighter);
	}}
	disabled={$firefightersStore.loading}
>
	<div class="row name">
		<span class="name-tag">{firefighter.name}</span>
		{#if firefighter.category === 'first'}
			<FirstIcon />
		{:else if firefighter.category === 'second'}
			<SecondIcon />
		{:else if firefighter.category === 'subChief'}
			<SubChiefIcon />
		{:else if firefighter.category === 'chief'}
			<ChiefIcon />
		{:else if firefighter.category === 'adjunct'}
			<AdjIcon />
		{:else if firefighter.category === 'secondCommander'}
			<SecondCmdtIcon />
		{:else if firefighter.category === 'commander'}
			<CmdtIcon />
		{:else}
			<ThirdIcon />
		{/if}
	</div>

	{#if firefighter.dutyType}
		<div
			class="dutytype"
			class:dutytype--picket={firefighter.dutyType === 'picket'}
			class:dutytype--ecin={firefighter.dutyType === 'ecin'}
			class:dutytype--eip={firefighter.dutyType === 'eip'}
		>
			{t('dutyType', firefighter.dutyType)}
		</div>
	{/if}

	<div class="block status">
		{firefighter.availability === 'unavailable' ? '' : t('availability', firefighter.availability)}
	</div>
</button>

<style>
	.button {
		position: relative;

		width: 120px;
		height: 102px;
		padding: 4px;
		margin: 10px;

		background-color: var(--color-grey);
		border: 1px solid var(--color-grey);
		border-radius: 4px;

		cursor: pointer;
		outline: none;

		font-family: var(--font-family-sans-serif);

		font-size: 24px;
		font-weight: var(--font-weight-bold);
		line-height: 46px;
		text-decoration: none;
		word-wrap: break-word;

		transition: transform 0.3s ease-in-out;
		user-select: none;
	}

	.button:hover {
		transform: translateY(-6px);
	}

	.button:disabled {
		opacity: 0.65;
		cursor: progress;
	}

	.row {
		display: flex;
		position: relative;
		flex-direction: row;
		align-items: center;

		width: 100%;
		height: 50%;

		padding-bottom: 8px;
	}

	.block {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		width: 100%;
		height: 50%;
	}

	.name-tag {
		flex: 1 1 auto;
		margin-left: 8px;
	}

	.button-available {
		background-color: var(--color-leaf-green);
		border-color: var(--color-leaf-green);
	}

	.button-service {
		background-color: var(--color-fire-red);
		border-color: var(--color-fire-red);
	}

	.button-on-call {
		background-color: var(--color-blue);
		border-color: var(--color-blue);
	}

	.dutytype {
		position: absolute;
		top: 40%;
		left: 10%;
		z-index: 1;

		width: 80%;
		height: auto;

		background-color: var(--color-yellow);
		border-radius: 12px;
		color: var(--color-black);
		font-size: 16px;
		font-weight: var(--font-weight-regular);
		line-height: 20px;
	}

	.dutytype--ecin {
		background-color: var(--color-roasted-yellow);
	}

	.dutytype--eip {
		background-color: var(--color-purple);
	}

	.status {
		background-color: var(--color-black);
		border-radius: 4px;
		color: white;

		font-family: var(--font-family-mono);

		font-size: 16px;
		font-weight: var(--font-weight-regular);

		line-height: 20px;
	}
</style>
