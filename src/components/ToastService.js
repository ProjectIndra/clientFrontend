import React, { useEffect } from 'react';

const Toast = ({ message, type = "info", onClose }) => {
	useEffect(() => {
		const timer = setTimeout(onClose, 3000);
		return () => clearTimeout(timer);
	}, [onClose]);

	const base = `
    fixed top-5 left-1/2 transform -translate-x-1/2 
    px-4 py-2 rounded shadow text-white font-medium z-50
  `;
	const variants = {
		success: "bg-green-600",
		error: "bg-red-600",
		info: "bg-blue-600",
	};

	return (
		<div className={`${base} ${variants[type]}`}>
			{message}
		</div>
	);
};

export default Toast;
