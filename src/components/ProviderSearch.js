function ProviderSearch({ value, onChange }) {
	return (
		<form onSubmit={(e) => e.preventDefault()} className="mb-4">
			<input
				type="search"
				placeholder="Search by Provider Name"
				className="w-full border border-gray-300 focus:outline-none focus:ring-0 focus:border-lime-300 focus:border-2 rounded-md px-3 py-2"
				value={value}
				onChange={onChange}
			/>
		</form>
	);
}

export default ProviderSearch;