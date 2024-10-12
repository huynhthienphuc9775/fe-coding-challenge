"use client";

import View from "@/components/view";
import { Item } from "@/utils/itemUtils";
import { useEffect, useState } from "react";

export default function Consumer() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("view_data");
    if (storedData) {
        setData(JSON.parse(storedData).filter((item: Item) => item.props.text !== ""));
    }
  }, []);
  return (
    <div className="w-full h-full p-2 flex flex-col gap-3 items-center overflow-scroll" style={{ lineBreak: "anywhere" }}>
        <View items={data}/>
    </div>
  );
}
