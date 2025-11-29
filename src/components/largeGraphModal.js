import React,{ useState } from 'react'
import { GraphView } from './GraphView'
import { epochToReadable }  from '../helper'
import {getGraphPoints} from '../apiServices'

export const LargeGraphModal = ({ graph, onClose, setGraphs }) => {
  const parsedSettings = graph.settings
    ? (() => {
        try {
          return JSON.parse(graph.settings)
        } catch {
          return {}
        }
      })()
    : {}
  console.log('LargeGraphModal - graph data:', graph)
  const [graphType, setGraphType] = useState("area");

  const today = new Date()
  const defaultDate = today.toISOString().split('T')[0] // yyyy-mm-dd
  const defaultTime = '00:00' // 12:00 AM in 24-hr format
  // ("00:00" = 12:00 AM)

  const [startDate, setStartDate] = useState(defaultDate)
  const [startTime, setStartTime] = useState(defaultTime)

  const [endDate, setEndDate] = useState(defaultDate)
  const [endTime, setEndTime] = useState(defaultTime)



  const handleApplyFilter = async () => {
    const startLocal = new Date(`${startDate}T${startTime}:00`)
    const endLocal = new Date(`${endDate}T${endTime}:00`)

    const startUTC = Math.floor(startLocal.getTime() / 1000)
    const endUTC = Math.floor(endLocal.getTime() / 1000)

    try {
      const payload = {
        ...graph,
        defaultTimeRange: `${startUTC}|${endUTC}`,
      }

      const filteredData = await getGraphPoints(payload)

      if (!filteredData) return

      // Update the graph inside modal
      // setFilteredSeries(filteredData.series || [])
      // setFilteredSettings(filteredData.settings || {})

      // Update the graph inside parent DashboardView
      setGraphs((prev) =>
        prev.map((g) =>
          g.graphId === graph.graphId
            ? {
                ...g,
                series: filteredData.series || [],
                settings: filteredData.settings || {},
                defaultTimeRange: `${startUTC}|${endUTC}`,
              }
            : g
        )
      )
    } catch (err) {
      console.error('Error applying filter:', err)
    }
  }





  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-4 w-[85vw] max-h-[95vh] overflow-y-auto overflow-x-hidden relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 hover:bg-gray-300 p-2 rounded-full text-gray-500 hover:text-gray-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {/* Toggle Button */}
        <button
          onClick={() =>
            setGraphType((prev) => (prev === 'line' ? 'area' : 'line'))
          }
          className="absolute top-6 right-16 p-2 rounded-lg bg-lime-400 text-black font-medium transition"
        >
          Switch to {graphType === 'line' ? 'Area' : 'Line'} Graph
        </button>

        <h2 className="text-xl font-semibold mb-2">{graph.graphName}</h2>
        {/* <p className="text-sm text-gray-600 mb-4">• {graph.graphType}</p> */}
        <p className="text-sm text-gray-600 mb-4">
          <b>• Time range :</b>{' '}
          {epochToReadable(graph.defaultTimeRange?.split('|')[0])} -{' '}
          {epochToReadable(graph.defaultTimeRange?.split('|')[1]) ||
            'Not specified'}
        </p>

        {/* ------------------ FILTER BAR ------------------ */}
        <div className="mb-5 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-start justify-between">
            {/* LEFT SIDE FILTERS */}
            <div className="flex gap-8">
              {/* Start Timestamp */}
              <div className="flex flex-row justify-normal items-center gap-2">
                <div className="font-medium flex justify-center text-[14px]">
                  <p>Start Timestamp</p>
                </div>

                {/* <label className="text-sm text-gray-600 mb-1">Date</label> */}
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border rounded w-32 h-8"
                />

                {/* <label className="text-sm text-gray-600 mt-2 mb-1">Time</label> */}
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="p-2 border rounded w-32 h-8"
                />
              </div>

              {/* End Timestamp */}
              <div className="flex flex-row justify-normal items-center gap-2">
                <div className="font-medium flex justify-center text-[14px]">
                  <p>End Timestamp</p>
                </div>

                {/* <label className="text-sm text-gray-600 mb-1">Date</label> */}
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border rounded w-32 h-8"
                />

                {/* <label className="text-sm text-gray-600 mt-2 mb-1">Time</label> */}
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="p-2 border rounded w-32 h-8"
                />
              </div>

              {/* Empty region reserved for future filters */}
              <div className="w-40"></div>
            </div>

            {/* APPLY BUTTON - bottom right */}
            <div className="flex items-end">
              <button
                onClick={handleApplyFilter}
                className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-black rounded-lg font-medium transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        {/* ------------------------------------------------- */}

        {/* Large Graph */}
        <div className="h-[550px] w-[100%]">
          <GraphView
            graphType={graphType}
            series={graph.series}
            settings={parsedSettings}
            height={500}
            width={'100%'}
          />
        </div>
      </div>
    </div>
  )
}
