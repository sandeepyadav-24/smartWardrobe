"use client";
import { useState } from "react";

const page = () => {
  const [shown, setShown] = useState(false);
  return (
    <div>
      <h1>This is Maigic!</h1>
      <button
        onClick={() => {
          if (shown) {
            setShown(false);
          } else {
            setShown(true);
          }
        }}
      >
        click me{" "}
      </button>
      {shown && <p>Shown</p>}
    </div>
  );
};

export default page;
