import { useEffect, useState } from 'react';

const Toast = ({ message, type = "info", onClose }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    // 1. Trigger the "fade in" immediately after mounting
    const fadeInTimer = setTimeout(() => setIsShowing(true), 10);

    // 2. Trigger the "fade out" 500ms before the component is actually removed
    const fadeOutTimer = setTimeout(() => setIsShowing(false), 2500);

    // 3. Finally call onClose to remove the component from the DOM
    const closeTimer = setTimeout(onClose, 3000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const base = `
    fixed top-5 left-1/2 transform -translate-x-1/2 
    px-6 py-3 rounded-lg shadow-xl text-white font-medium z-[100]
    transition-all duration-500 ease-in-out
  `;

  // Animation states: 
  // Hidden (initial/exit): opacity 0 and slightly moved up
  // Visible: opacity 100 and original position
  const animationClasses = isShowing 
    ? "opacity-100 translate-y-0" 
    : "opacity-0 -translate-y-4";

  const variants = {
    success: "bg-lime-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div className={`${base} ${variants[type]} ${animationClasses}`}>
      <div className="flex items-center gap-2">
        {type === 'success' && <span>✓</span>}
        {type === 'error' && <span>✕</span>}
        {message}
      </div>
    </div>
  );
};

export default Toast;