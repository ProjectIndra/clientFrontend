function ProviderConfigForm({
	selectedProvider,
	formData,
	handleChange,
	handleSaveProvider,
	vcpus,
	rams,
	storage,
	networks,
	vms,
}) {
	if (!selectedProvider) return null;

	const fields = [
		{
			label: "Select max vCPUs",
			name: "providerAllowedVcpu",
			options: vcpus,
		},
		{ label: "Select max RAM", name: "providerAllowedRam", options: rams },
		{
			label: "Select Storage",
			name: "providerAllowedStorage",
			options: storage,
		},
		{
			label: "Select max Networks",
			name: "providerAllowedNetworks",
			options: networks,
		},
		{ label: "Select max VMs", name: "providerAllowedVms", options: vms },
	];

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h3 className="text-lg font-medium text-slate-800 mb-4">
				Setup / Update Provider
			</h3>

			<div className="space-y-4">
				<input
					name="providerName"
					placeholder="Update Provider Name"
					value={formData.providerName}
					onChange={handleChange}
					className="w-full p-2 border rounded-md focus:ring-2 focus:ring-lime-300"
				/>

				{fields.map((field) => (
					<div key={field.name}>
						<label className="block text-sm font-medium text-gray-700">
							{field.label}
						</label>

						<select
							name={field.name}
							value={formData[field.name]}
							onChange={handleChange}
							className="w-full p-2 border rounded-md focus:ring-2 focus:ring-lime-300"
						>
							<option value="">Select</option>

							{field.options.map((opt, i) => (
								<option key={i} value={opt.split(" ")[0]}>
									{opt}
								</option>
							))}
						</select>
					</div>
				))}

				<button
					className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-md"
					onClick={handleSaveProvider}
				>
					Save Provider
				</button>
			</div>
		</div>
	);
}

export default ProviderConfigForm;
