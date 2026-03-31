import { useState, useEffect } from 'react'
import { GraphView } from './GraphView'
import { getGraphPoints } from '../apiServices'
import { getReadableTimeRange } from '../helper'
import { CloseIcon } from '../utils/icons'

export const LargeGraphModal = ({ graph, onClose }) => {
  
  const [selectedGraphData, setSelectedGraphData] = useState({});

  const [graphType, setGraphType] = useState("area");
  
  const today = new Date()
  const defaultDate = today.toISOString().split('T')[0] // yyyy-mm-dd
  const defaultTime = '00:00' // 12:00 AM in 24-hr format
  // ("00:00" = 12:00 AM)
  
  const [startDate, setStartDate] = useState(defaultDate)
  const [startTime, setStartTime] = useState(defaultTime)
  
  const [endDate, setEndDate] = useState(defaultDate)
  const [endTime, setEndTime] = useState(defaultTime)

  const [isApplyingFilter, setIsApplyingFilter] = useState(false)

  
  const parsedSettings = selectedGraphData.settings
    ? (() => {
        try {
          return JSON.parse(selectedGraphData.settings)
        } catch {
          return {}
        }
      })()
    : {}
  
  useEffect(() => {
    setSelectedGraphData(graph);
  }, [graph]);

  const handleApplyFilter = async () => {
    setIsApplyingFilter(true);
    const startLocal = new Date(`${startDate}T${startTime}:00`)
    const endLocal = new Date(`${endDate}T${endTime}:00`)

    const startUTC = Math.floor(startLocal.getTime() / 1000)
    const endUTC = Math.floor(endLocal.getTime() / 1000)

    try {
      const payload = {
        ...selectedGraphData,
        defaultTimeRange: `${startUTC}|${endUTC}`,
      }

      const filteredData = await getGraphPoints(payload)

      if (!filteredData) return

      // Update the graph inside modal
      // setFilteredSeries(filteredData.series || [])
      // setFilteredSettings(filteredData.settings || {})

      // Update the graph inside parent DashboardView
      setSelectedGraphData((prev) => ({
        ...prev,
        series: filteredData.series || [],
        settings: filteredData.settings || {},
        defaultTimeRange: `${startUTC}|${endUTC}`,
      }))

    } catch (err) {
      console.error('Error applying filter:', err)
    }
    finally {
      setIsApplyingFilter(false)
    }
  }

  const { startReadable, endReadable } = getReadableTimeRange(selectedGraphData.defaultTimeRange)





  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-palette-surface rounded-lg shadow-xl p-4 w-[85vw] max-h-[95vh] overflow-y-auto overflow-x-hidden relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 hover:bg-palette-surfaceMuted p-2 rounded-full text-palette-textMuted hover:text-palette-textSecondary transition"
        >
          {/* close icon */}
          <CloseIcon />
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

        <h2 className="text-xl font-semibold mb-2">
          {selectedGraphData.graphName}
        </h2>
        {/* <p className="text-sm text-palette-textSecondary mb-4">• {selectedGraphData.graphType}</p> */}
        <p className="text-sm text-palette-textSecondary mb-4">
          <b>• Time range :</b> {startReadable} - {endReadable}
        </p>

        {/* ------------------ FILTER BAR ------------------ */}
        <div className="mb-5 p-4 border rounded-lg bg-palette-wrapper">
          <div className="flex items-start justify-between">
            {/* LEFT SIDE FILTERS */}
            <div className="flex gap-8">
              {/* Start Timestamp */}
              <div className="flex flex-row justify-normal items-center gap-2">
                <div className="font-medium flex justify-center text-[14px]">
                  <p>Start Timestamp</p>
                </div>

                {/* <label className="text-sm text-palette-textSecondary mb-1">Date</label> */}
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border rounded w-32 h-8"
                />

                {/* <label className="text-sm text-palette-textSecondary mt-2 mb-1">Time</label> */}
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

                {/* <label className="text-sm text-palette-textSecondary mb-1">Date</label> */}
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border rounded w-32 h-8"
                />

                {/* <label className="text-sm text-palette-textSecondary mt-2 mb-1">Time</label> */}
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
                disabled={isApplyingFilter}
                className={`px-4 py-2 bg-lime-400 hover:bg-lime-500 text-black rounded-lg font-medium transition flex items-center justify-center w-20 h-10 ${
                  isApplyingFilter ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isApplyingFilter ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Apply'
                )}
              </button>
            </div>
          </div>
        </div>
        {/* ------------------------------------------------- */}

        {/* Large Graph */}
        <div className="h-[550px] w-[100%]">
          <GraphView
            graphType={graphType}
            series={selectedGraphData.series}
            settings={parsedSettings}
            height={500}
            width={'100%'}
          />
        </div>
      </div>
    </div>
  )
}
