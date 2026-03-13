function EditProfileModal({
	isOpen,
	onClose,
	handleSave,
	fileUpload,
	newProfileName,
	setNewProfileName,
	updateName,
	setUpdateName,
	updateImage,
	setUpdateImage
}) {
	
	return <div
		className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
		onClick={() => onClose(false)}
	>
		<div
			className="bg-white rounded-lg p-6 w-full max-w-md"
			onClick={(e) => e.stopPropagation()}
		>
			<h2 className="text-xl font-bold mb-4">
				Update Profile
			</h2>

			<div className="mb-3">
				<label className="flex items-center gap-2 text-sm font-medium mb-1">
					<input
						type="checkbox"
						checked={updateName}
						onChange={(e) => setUpdateName(e.target.checked)}
					/>
					Update Profile Name
				</label>

				<input
					type="text"
					value={newProfileName}
					onChange={(e) => setNewProfileName(e.target.value)}
					disabled={!updateName}
					className="border border-gray-300 rounded-lg p-2 w-full disabled:bg-gray-100"
				/>
			</div>

			<div className="mb-3">
				{/* <label className="block text-sm font-medium mb-1">Update Profile Image {"(< 1 MB )"}</label> */}
				<label className="flex items-center gap-2 text-sm font-medium mb-1">
					<input
						type="checkbox"
						checked={updateImage}
						onChange={(e) => setUpdateImage(e.target.checked)}
					/>
					Update Profile Image {"(< 1 MB )"}
				</label>
				<div className="space-y-2">
					<div>
						<label className="text-xs text-gray-600 block mb-2">Upload from Device</label>
						<input
							type="file"
							accept="image/*,.svg"
							onChange={fileUpload}
							disabled={!updateImage}
							className="border border-gray-300 rounded-lg p-2 w-full text-sm disabled:bg-gray-100"
						/>
					</div>
				</div>
			</div>
			<div className="flex justify-end gap-3">
				<button
					onClick={() => onClose(false)}
					className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
				>
					Cancel
				</button>
				<button
					onClick={handleSave}
					className="px-4 py-2 bg-lime-400 rounded-lg hover:bg-lime-500"
				>
					Update
				</button>
			</div>
		</div>
	</div>;
}

export default EditProfileModal;
