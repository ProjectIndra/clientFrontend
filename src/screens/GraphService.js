import React, { useState } from "react";
import { GraphView } from "../components/GraphView";

export const GraphService = () => {
  const [graphType, setGraphType] = useState("line");

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Graph Service</h1>

        {/* Toggle Button */}
        <button
          onClick={() =>
            setGraphType((prev) => (prev === "line" ? "bar" : "line"))
          }
          className="px-4 py-2 rounded-lg bg-lime-400 text-black font-medium hover:bg-lime-500 transition"
        >
          Switch to {graphType === "line" ? "Bar" : "Line"} Graph
        </button>
      </div>

      {/* Pass toggle state as prop */}
      <GraphView
        graphid="1"
        graph_type={graphType}
        tittle="Sales Over Months"
        h={400}
        w="100%"
        start_x="Jan"
        end_y="Jun"
        x_axis="month"
        y_axis="sales"
        points="Jan:400,Feb:300,Mar:500,Apr:200,May:350,Jun:420"
      />
    </div>
  );
};
