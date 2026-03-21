function ProviderSearch({ value, onChange }) {
	return (
		<form onSubmit={(e) => e.preventDefault()} className="mb-4">
			<input
				type="search"
				placeholder="Search by Provider Name"
				className="w-full border border-palette-border focus:outline-none focus:ring-0 focus:border-lime-500 focus:border-1 rounded-md px-3 py-2 bg-palette-surface text-palette-textTertiary"
				value={value}
				onChange={onChange}
			/>
		</form>
	);
}

export default ProviderSearch;