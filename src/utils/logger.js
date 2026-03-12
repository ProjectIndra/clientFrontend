import toast from "react-hot-toast";

export const logger = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast(message),
};