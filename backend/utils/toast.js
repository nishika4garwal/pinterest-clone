import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";

export const customSuccessToast = (message) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } flex items-center bg-white border border-red-500 text-red-600 px-4 py-2 rounded shadow-lg`}
    >
      <FaCheckCircle className="text-red-600 mr-2" />
      <span>{message}</span>
    </div>
  ));
};
