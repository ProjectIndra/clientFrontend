import React,{ useState } from 'react'
import { GraphView } from './GraphView'
import { epochToReadable }  from '../helper'

export const LargeGraphModal = ({ graph, onClose }) => {
  const parsedSettings = graph.settings
    ? (() => {
        try {
          return JSON.parse(graph.settings)
        } catch {
          return {}
        }
      })()
    : {}
    const [graphType, setGraphType] = useState("line");

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
