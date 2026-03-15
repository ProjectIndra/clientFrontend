
export const CloseIcon = ({ size = 20, className = "", ...props }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			width={size}
			height={size}
			fill="currentColor"
			className={className}
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 
        011.414 1.414L11.414 10l4.293 4.293a1 1 0 
        01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 
        01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
			/>
		</svg>
	);
};

export const CopyIcon = ({ size = 20, className = "", ...props }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="none"
			className={className}
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z"
				fill="currentColor"
			/>
			<path
				d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z"
				fill="currentColor"
			/>
		</svg>
	);
};

export const DeleteIcon = ({ size = 20, className = "", ...props }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			{...props}
		>
			<polyline points="3 6 5 6 21 6" />
			<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
			<line x1="10" y1="11" x2="10" y2="17" />
			<line x1="14" y1="11" x2="14" y2="17" />
		</svg>
	);
};

export const EditIcon = ({ size = 20, className = "", ...props }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="none"
			className={className}
			{...props}
		>
			<path
				d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25z"
				fill="currentColor"
			/>
			<path
				d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
				fill="currentColor"
			/>
		</svg>
	);
};

export const TickIcon = ({ size = 20, className = "", ...props }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			width={size}
			height={size}
			fill="currentColor"
			className={className}
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 
        4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 
        0 001.414 0l8-8a1 1 0 000-1.414z"
			/>
		</svg>
	);
};

export const MenuToggleIcon = ({ open = false, size = 24, className = "", ...props }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			className={className}
			{...props}
		>
			{open ? (
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M6 18L18 6M6 6l12 12"
				/>
			) : (
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M4 6h16M4 12h16M4 18h16"
				/>
			)}
		</svg>
	);
};

export const MenuIcon = ({ size = 24, className = "", ...props }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			className={className}
			{...props}
		>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M4 6h16M4 12h16M4 18h16"
				/>
		</svg>
	);
};