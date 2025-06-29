import React, { useEffect, useRef } from "react";

const UserListModal = ({ isOpen, onClose, users, title, type, handleAction }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 animate-fadeIn">
      <div className="fixed inset-0 bg-transparent" />
      <div
        ref={modalRef}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto z-50"
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black text-2xl">
            &times;
          </button>
        </div>

        {users?.length === 0 ? (
          <p className="text-gray-500 text-center">No users found</p>
        ) : (
          users.map((u) => (
            <div key={u._id} className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center text-lg font-bold">
                  {u.name?.slice(0, 1)}
                </div>
                <p>{u.name}</p>
              </div>
              <button
                onClick={() => handleAction(u._id)}
                className={`${
                  type === "followers"
                    ? "bg-red-500 hover:bg-red-600"
                    : u.isFollowing
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white px-3 py-1 rounded transition-colors`}
              >
                {type === "followers" ? "Remove" : u.isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserListModal;