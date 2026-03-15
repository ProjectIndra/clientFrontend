import React, { useState } from 'react';
import {CopyIcon, TickIcon,} from "../utils/icons"; 

const ActionConfirmModal = ({ visible, type="", onConfirm, onCancel, message, copyToken=false, command, isConfirmButtonVisible=true, isCancelButtonVisible=true, confirmButtonName, cancelButtonName }) => {
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
            <div className="bg-white p-6 rounded shadow text-center w-auto min-w-[320px] max-w-[90vw] md:max-w-[700px]">
                <p className="text-lg font-semibold text-gray-800 mb-4">
                    {message || `Are you sure you want to ${type} this VM?`}
                </p>
                {copyToken && (
                    <div className="mt-2 bg-white border border-gray-300 rounded-xl px-3 py-3 w-full flex gap-3 items-start text-left shadow-sm mb-4">
                        <code className="text-sm text-gray-800 break-all whitespace-pre-wrap flex-1">
                            {bashScript}
                        </code>
                        <button
                            onClick={handleCopy}
                            className="shrink-0 py-2 px-2 rounded hover:bg-lime-300 transition flex items-center gap-2"
                        >
                            {copied ? (
                                <div className="flex items-center gap-2">
                                    <TickIcon className="h-5 w-5 text-green-600" />
                                    <span className="text-sm text-green-600">Copied</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CopyIcon className="h-5 w-5 text-gray-600" />
                                    <span className="text-sm text-gray-600">Copy</span>
                                </div>
                            )}
                        </button>
                    </div>
                )}
                <div className="flex justify-center gap-4">
                    {isConfirmButtonVisible &&  (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600"
                        >
                            {confirmButtonName || "Yes, Confirm"}
                        </button>

                    )}
                    {isCancelButtonVisible && (
                        <button
                            onClick={onCancel}
                            className={`px-4 py-2 bg-gray-300 text-gray-700 rounded hover:${cancelButtonName === "Done" ? "bg-lime-300" : "bg-red-100"}`}
                        >
                            {cancelButtonName || "Cancel"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActionConfirmModal;
