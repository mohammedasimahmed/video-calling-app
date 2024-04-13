import CallRoom from "@/components/CallRoom";
import React from "react";

const page = ({ searchParams }) => {
  return (
    <div>
      <CallRoom roomid={searchParams.id} />
    </div>
  );
};

export default page;
