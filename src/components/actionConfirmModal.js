import React, { useState } from 'react';

const ActionConfirmModal = ({ visible, type, onConfirm, onCancel, message, copyToken=false, command }) => {
    const [copied, setCopied] = useState(false);
    
    if (!visible) return null;

    const bashScript = `${command}`;
    const handleCopy = () => {
        navigator.clipboard.writeText(bashScript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow max-w-sm text-center">
                <p className="text-lg font-semibold text-gray-800 mb-4">
                    {message || `Are you sure you want to ${type} this VM?`}
                </p>
                {copyToken && (
                <div className="mt-2 bg-white border border-gray-300 rounded-xl px-4 py-2 max-w-[250px] md:max-w-[400px] flex items-center justify-between text-left shadow-sm whitespace-nowrap overflow-x-auto mb-4">
                    <code className="text-sm text-gray-800 break-all">
                        {bashScript}
                    </code>
                    <button
                        onClick={handleCopy}
                        className="ml-3 px-3 py-2 rounded hover:bg-lime-300 transition flex items-center gap-2"
                    >
                        {copied ? (
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-green-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-sm text-green-600">Copied</span>
                            </div>
                        ) : (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-5 w-5 text-gray-600"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z"
                                        fill="#0F0F0F"
                                    />
                                    <path
                                        d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z"
                                        fill="#0F0F0F"
                                    />
                                </svg>
                                <span className="text-sm text-gray-600">Copy</span>
                            </>
                        )}
                    </button>
                </div>
                )}
                <div className="flex justify-center gap-4">
                    {!copyToken && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600"
                        >
                            Yes, Confirm
                        </button>

                    )}
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionConfirmModal;
