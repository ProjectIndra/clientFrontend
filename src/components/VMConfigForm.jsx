function VMConfigForm({ selectedProvider, formData, handleChange, handleSubmitQuery, handleSubmitRequest, vcpus, rams, images,storageOptions }) {
  return (
		<>
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-xl font-semibold">
					{selectedProvider.providerName}
				</h3>
				{/* <button className="bg-lime-300 text-black font-medium rounded px-4 py-1 hover:brightness-110">
                  Specs Sheet
                </button> */}
			</div>
			<div className="bg-white rounded-lg shadow-md p-6 space-y-4">
				<input
					name="vm_name"
					placeholder="VM Name (not necessary for query request)"
					className="w-full border border-gray-300 focus:outline-none focus:ring-0 focus:border-lime-300 focus:border-2 rounded-md px-3 py-2"
					value={formData.vm_name}
					onChange={handleChange}
				/>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="flex flex-col">
						<label className="mb-1 text-sm font-medium">
							Select vCPUs
						</label>
						<select
							name="vcpus"
							value={formData.vcpus}
							onChange={handleChange}
							className="border border-gray-300 focus:outline-none focus:ring-0 focus:border-lime-300 focus:border-2 rounded-md px-3 py-2"
						>
							<option value="">Select</option>
							{vcpus?.map((cpu, idx) => (
								<option key={idx} value={cpu}>
									{cpu}
								</option>
							))}
						</select>
					</div>
					<div className="flex flex-col">
						<label className="mb-1 text-sm font-medium">
							Select RAM
						</label>
						<select
							name="ram"
							value={formData.ram}
							onChange={handleChange}
							className="border border-gray-300 focus:outline-none focus:ring-0 focus:border-lime-300 focus:border-2 rounded-md px-3 py-2"
						>
							<option value="">Select</option>
							{rams?.map((ram, idx) => (
								<option key={idx} value={ram}>
									{ram / 1024} GB
								</option>
							))}
						</select>
					</div>
					<div className="flex flex-col">
						<label className="mb-1 text-sm font-medium">
							Select Storage
						</label>
						<select
							name="storage"
							value={formData.storage}
							onChange={handleChange}
							className="border border-gray-300 focus:outline-none focus:ring-0 focus:border-lime-300 focus:border-2 rounded-md px-3 py-2"
						>
							<option value="">Select</option>
							{storageOptions?.map((storage, idx) => (
								<option key={idx} value={storage}>
									{storage} GB
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="flex flex-col mt-4">
					<label className="mb-1 text-sm font-medium">
						Select Image
					</label>
					<select
						name="vm_image"
						value={formData.vm_image}
						onChange={handleChange}
						className="border border-gray-300 focus:outline-none focus:ring-0 focus:border-lime-300 focus:border-2 rounded-md px-3 py-2"
					>
						<option value="">Select</option>
						{images?.map((image, idx) => (
							<option key={idx} value={image}>
								{image}
							</option>
						))}
					</select>
				</div>
				<div className="flex gap-4 pt-4">
					<button
						className="bg-lime-300 text-black font-medium rounded px-4 py-2 hover:brightness-110"
						onClick={handleSubmitQuery}
					>
						Query VM
					</button>
					<button
						className="bg-lime-300 text-black font-medium rounded px-4 py-2 hover:brightness-110"
						onClick={handleSubmitRequest}
					>
						Request VM
					</button>
				</div>
				<input
					name="remarks"
					placeholder="Remarks? (not necessary for query request)"
					className="w-full border border-gray-300 focus:outline-none focus:ring-0 focus:border-lime-300 focus:border-2 rounded-md px-3 py-2"
					value={formData.remarks}
					onChange={handleChange}
				/>
			</div>
		</>
  );
}

export default VMConfigForm;
