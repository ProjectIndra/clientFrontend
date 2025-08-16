import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer
} from "recharts";

export const GraphView = ({
  graphid,
  graph_type,
  tittle,
  h,
  w,
  start_x,
  end_y,
  x_axis,
  y_axis,
  points
}) => {
  // Safely handle missing or empty points
  const parsedData =
    typeof points === "string" && points.trim() !== ""
      ? points.split(",").map((p) => {
          const [x, y] = p.split(":");
          return { [x_axis]: x, [y_axis]: Number(y) };
        })
      : [];

  const renderGraph = () => {
    if (!parsedData.length) {
      return <p className="text-gray-500 italic">No graph data available</p>;
    }

    if (graph_type === "line") {
      return (
        <LineChart
          data={parsedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={x_axis} stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={y_axis}
            stroke="#84cc16"
            strokeWidth={3}
            dot={{ r: 5, fill: "#84cc16" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      );
    } else if (graph_type === "bar") {
      return (
        <BarChart
          data={parsedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={x_axis} stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Legend />
          <Bar dataKey={y_axis} fill="#84cc16" />
        </BarChart>
      );
    } else {
      return <p className="text-gray-500">Unsupported graph type</p>;
    }
  };

  return (
    <div className="p-4 border border-lime-300 rounded-lg shadow-sm bg-white">
      {tittle && (
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{tittle}</h2>
      )}
      <ResponsiveContainer width={w || "100%"} height={h || 400}>
        {renderGraph()}
      </ResponsiveContainer>
    </div>
  );
};
