import React, { useEffect, useState } from "react";
import { GraphView } from "../components/GraphView";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { listGraphsForDashboard } from "../apiServices";

export const DashboardView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dashboardId = searchParams.get("id");
  const [graphs, setGraphs] = useState([]);

  useEffect(() => {
    if (dashboardId) {
      listGraphsForDashboard(dashboardId)
        .then((res) => {
          setGraphs(Array.isArray(res) ? res : []);
        })
        .catch((err) => {
          console.error("Error loading graphs:", err);
          setGraphs([]);
        });
    }
  }, [dashboardId]);

  const handleGraphClick = (graphId) => {
    navigate(`/dashboard/graph?id=${graphId}`);
  };

  const deleteGraph = (graphId) => {
    setGraphs((prev) => prev.filter((g) => g.graphId !== graphId));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      {graphs.length === 0 && (
        <p className="text-gray-500">No graphs available for this dashboard.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {graphs.map((g) => {
          const parsedSettings = g.settings
            ? (() => {
                try {
                  return JSON.parse(g.settings);
                } catch {
                  return {};
                }
              })()
            : {};

          return (
            <div
              key={g.graphId}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition relative"
            >
              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteGraph(g.graphId);
                }}
                className="absolute top-2 right-2 p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
              >
                <Trash2 size={20} className="text-red-500" />
              </button>

              <div onClick={() => handleGraphClick(g.graphId)}>
                <h2 className="text-lg font-semibold mb-2">{g.graphName}</h2>
                <p className="text-sm text-gray-600 mb-4">
                  {g.graphType || "Unknown type"} • Time range:{" "}
                  {g.defaultTimeRange || "Not specified"}
                </p>

                {/* Render GraphView only if series data exists */}
                {Array.isArray(g.series) && g.series.length > 0 ? (
                  <GraphView
                    type={g.graphType}
                    series={g.series}
                    settings={parsedSettings}
                  />
                ) : (
                  <p className="text-gray-400 italic">
                    No graph data available
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
