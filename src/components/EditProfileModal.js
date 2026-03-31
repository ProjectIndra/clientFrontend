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
			className="bg-palette-surface rounded-lg p-6 w-full max-w-md"
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
						className="focus:outline-0 text-lime-500 focus:ring-0"
					/>
					Update Profile Name
				</label>

				<input
					type="text"
					value={newProfileName}
					onChange={(e) => setNewProfileName(e.target.value)}
					disabled={!updateName}
					className="border border-palette-border rounded-lg p-2 w-full disabled:opacity-50 disabled:bg-palette-surfaceMuted bg-palette-surface focus:outline-none focus:ring-1 focus:ring-lime-300 focus:border-lime-300 transition-colors"
				/>
			</div>

			<div className="mb-3">
				{/* <label className="block text-sm font-medium mb-1">Update Profile Image {"(< 1 MB )"}</label> */}
				<label className="flex items-center gap-2 text-sm font-medium mb-1">
					<input
						type="checkbox"
						checked={updateImage}
						onChange={(e) => setUpdateImage(e.target.checked)}
						className="focus:outline-0 text-lime-500 focus:ring-0 bg-palette-surface"

					/>
					Update Profile Image {"(< 1 MB )"}
				</label>
				<div className="space-y-2">
					<div>
						<label className="text-xs text-palette-textSecondary block mb-2">Upload from Device</label>
						<input
							type="file"
							accept="image/*,.svg"
							onChange={fileUpload}
							disabled={!updateImage}
							className="border border-palette-border rounded-lg pl-0 p-1 w-full text-sm disabled:opacity-50 disabled:bg-palette-surfaceMuted bg-palette-surface focus:outline-none focus:ring-1 focus:ring-lime-300 focus:border-lime-300 transition-colors file:m-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-lime-500/10 file:text-lime-600 hover:file:bg-lime-500/20 cursor-pointer file:cursor-pointer"
						/>
					</div>
				</div>
			</div>
			<div className="flex justify-end gap-3">
				<button
					onClick={() => onClose(false)}
					className="px-4 py-2 bg-palette-surfaceMuted rounded-lg hover:bg-palette-surfaceMuted"
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
