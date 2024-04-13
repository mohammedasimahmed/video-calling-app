"use client";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

const EnterRoom = () => {
  const router = useRouter();
  const inputRef = useRef(null);
  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/room?id=${inputRef.current.value}`);
  }

  return (
    <div className="flex items-center w-screen h-screen">
      <form
        className="border-5 w-screen border-solid border-gray-300 mb-32"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <h1 className="text-center text-3xl font-semibold"> Enter Room</h1>
        <div className="text-left mx-6 my-3">
          <hr />
          <div className="text-left py-4 pt-16">
            <label htmlFor="Room">
              <strong>Room ID</strong>
            </label>
            <input
              type="text"
              placeholder="Enter The ID Of the Room"
              required
              id="Room"
              ref={inputRef}
              className="w-full p-4 md:p-2 my-2 md:my-4 inline-block border border-gray-300"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-3 mt-4 border-none cursor-pointer w-full hover:opacity-80"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnterRoom;
