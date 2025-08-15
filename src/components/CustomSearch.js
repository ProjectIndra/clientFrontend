import React from 'react'

function CustomSearch() {
  return (
    <div className="flex gap-3 mb-4 max-w-[700px] justify-center mx-auto">
              <input
                type="search"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-300"
                placeholder="Search by Name, vCPU, RAM..."
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-lime-300 text-[#0D0D0D] rounded-lg hover:bg-lime-300 text-sm font-medium"
              >
                Search
              </button>
            </div>
  )
}

export default CustomSearch