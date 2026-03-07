import React, { useEffect, useState, useRef } from 'react'
import { GraphView } from '../components/GraphView'
import DashboardCreateModal from '../components/DashboardCreateModal'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import Toast from '../components/ToastService'
import ActionConfirmModal from '../components/actionConfirmModal'
import {LargeGraphModal} from '../components/largeGraphModal'
import { epochToReadable } from '../helper'

import { listGraphsForDashboard, deleteGraph, getGraphPoints } from '../apiServices'

export const DashboardView = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dashboardId = searchParams.get('id')
  const [graphs, setGraphs] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [toast, setToast] = useState({
    message: '',
    type: 'info', // 'success' | 'error' | 'info'
    visible: false,
  })
  const [confirmDelete, setConfirmDelete] = useState({
    visible: false,
    graphId: null,
  })
  const [selectedGraph, setSelectedGraph] = useState(null)
  const [isDashboardLoading, setIsDashboardLoading] = useState(false)

  const mockData = []

  mockData.push([
    ['2025-09-02 17:53:30+00', '4.333333333333333'],
    ['2025-09-02 17:54:00+00', '4.333333333333333'],
    ['2025-09-02 17:55:00+00', '4.333333333333333'],
    ['2025-09-02 17:56:00+00', '4.333333333333333'],
    ['2025-09-02 17:56:30+00', '4.333333333333333'],
    ['2025-09-02 17:57:30+00', '5.0'],
    ['2025-09-02 17:58:30+00', '5.0'],
    ['2025-09-02 17:59:00+00', '5.0'],
    ['2025-09-02 18:00:00+00', '4.833333333333333'],
    ['2025-09-02 18:01:00+00', '4.833333333333333'],
    ['2025-09-02 18:01:30+00', '4.833333333333333'],
    ['2025-09-02 18:02:30+00', '4.833333333333333'],
    ['2025-09-02 18:03:30+00', '5.285714285714286'],
    ['2025-09-02 18:04:00+00', '5.285714285714286'],
    ['2025-09-02 18:05:00+00', '5.285714285714286'],
    ['2025-09-02 18:06:00+00', '5.285714285714286'],
    ['2025-09-02 18:06:30+00', '5.375'],
    ['2025-09-02 18:07:30+00', '4.888888888888889'],
    ['2025-09-02 18:08:30+00', '4.888888888888889'],
    ['2025-09-02 18:09:00+00', '4.888888888888889'],
    ['2025-09-02 18:10:00+00', '4.888888888888889'],
    ['2025-09-02 18:11:00+00', '4.8'],
    ['2025-09-02 18:11:30+00', '4.8'],
    ['2025-09-02 18:12:30+00', '4.8'],
    ['2025-09-02 18:13:30+00', '4.909090909090909'],
    ['2025-09-02 18:14:00+00', '4.583333333333333'],
    ['2025-09-02 18:15:00+00', '4.583333333333333'],
    ['2025-09-02 18:16:00+00', '4.769230769230769'],
    ['2025-09-02 18:16:30+00', '4.714285714285714'],
    ['2025-09-02 18:17:30+00', '4.714285714285714'],
    ['2025-09-02 18:18:30+00', '4.714285714285714'],
    ['2025-09-02 18:19:00+00', '4.714285714285714'],
    ['2025-09-02 18:20:00+00', '4.8'],
    ['2025-09-02 18:21:00+00', '4.8125'],
    ['2025-09-02 18:23:00+00', '4.8125'],
    ['2025-09-02 18:25:00+00', '4.8125'],
    ['2025-09-02 18:27:00+00', '4.8125'],
    ['2025-09-02 18:29:00+00', '4.8125'],
    ['2025-09-02 18:31:00+00', '4.8125'],
    ['2025-09-02 18:33:00+00', '4.588235294117647'],
    ['2025-09-02 18:35:00+00', '4.588235294117647'],
    ['2025-09-02 18:37:00+00', '4.588235294117647'],
    ['2025-09-02 18:39:00+00', '4.588235294117647'],
    ['2025-09-02 18:41:00+00', '4.588235294117647'],
    ['2025-09-02 18:43:00+00', '4.588235294117647'],
    ['2025-09-02 18:45:00+00', '4.611111111111111'],
    ['2025-09-02 18:47:00+00', '4.611111111111111'],
    ['2025-09-02 18:49:00+00', '4.611111111111111'],
    ['2025-09-02 18:51:00+00', '4.473684210526316'],
    ['2025-09-02 18:53:00+00', '4.473684210526316'],
    ['2025-09-02 18:55:00+00', '4.473684210526316'],
    ['2025-09-02 18:57:00+00', '4.473684210526316'],
    ['2025-09-02 18:59:00+00', '4.473684210526316'],
    ['2025-09-02 19:01:00+00', '4.473684210526316'],
    ['2025-09-02 19:03:00+00', '4.3'],
    ['2025-09-02 19:05:00+00', '4.238095238095238'],
    ['2025-09-02 19:07:00+00', '4.238095238095238'],
    ['2025-09-02 19:09:00+00', '4.090909090909091'],
    ['2025-09-02 19:11:00+00', '4.130434782608695'],
    ['2025-09-02 19:13:00+00', '4.130434782608695'],
    ['2025-09-02 19:15:00+00', '4.0'],
    ['2025-09-02 19:17:00+00', '4.0'],
    ['2025-09-02 19:19:00+00', '3.92'],
    ['2025-09-02 19:21:00+00', '3.92'],
    ['2025-09-02 19:23:00+00', '3.8846153846153846'],
    ['2025-09-02 19:25:00+00', '3.8846153846153846'],
    ['2025-09-02 19:27:00+00', '3.8846153846153846'],
    ['2025-09-02 19:29:00+00', '3.8846153846153846'],
    ['2025-09-02 19:31:00+00', '3.8846153846153846'],
    ['2025-09-02 19:33:00+00', '3.8518518518518516'],
    ['2025-09-02 19:35:00+00', '3.8518518518518516'],
    ['2025-09-02 19:37:00+00', '3.8518518518518516'],
    ['2025-09-02 19:39:00+00', '3.8518518518518516'],
    ['2025-09-02 19:41:00+00', '3.8518518518518516'],
  ])

  mockData.push([
    ['2025-09-02 17:53:30+00', '2.0'],
    ['2025-09-02 17:54:00+00', '2.0'],
    ['2025-09-02 17:55:00+00', '2.0'],
    ['2025-09-02 17:56:00+00', '2.0'],
    ['2025-09-02 17:56:30+00', '2.0'],
    ['2025-09-02 17:57:30+00', '2.5'],
    ['2025-09-02 17:58:30+00', '2.5'],
    ['2025-09-02 17:59:00+00', '2.5'],
    ['2025-09-02 18:00:00+00', '2.3333333333333335'],
    ['2025-09-02 18:01:00+00', '2.3333333333333335'],
    ['2025-09-02 18:01:30+00', '2.3333333333333335'],
    ['2025-09-02 18:02:30+00', '2.3333333333333335'],
    ['2025-09-02 18:03:30+00', '2.4285714285714284'],
    ['2025-09-02 18:04:00+00', '2.4285714285714284'],
    ['2025-09-02 18:05:00+00', '2.4285714285714284'],
    ['2025-09-02 18:06:00+00', '2.4285714285714284'],
    ['2025-09-02 18:06:30+00', '2.5'],
    ['2025-09-02 18:07:30+00', '2.4444444444444446'],
    ['2025-09-02 18:08:30+00', '2.4444444444444446'],
    ['2025-09-02 18:09:00+00', '2.4444444444444446'],
    ['2025-09-02 18:10:00+00', '2.4444444444444446'],
    ['2025-09-02 18:11:00+00', '2.4'],
    ['2025-09-02 18:11:30+00', '2.4'],
    ['2025-09-02 18:12:30+00', '2.4'],
    ['2025-09-02 18:13:30+00', '2.4545454545454546'],
    ['2025-09-02 18:14:00+00', '2.2916666666666665'],
    ['2025-09-02 18:15:00+00', '2.2916666666666665'],
    ['2025-09-02 18:16:00+00', '2.3846153846153846'],
    ['2025-09-02 18:16:30+00', '2.357142857142857'],
    ['2025-09-02 18:17:30+00', '2.357142857142857'],
    ['2025-09-02 18:18:30+00', '2.357142857142857'],
    ['2025-09-02 18:19:00+00', '2.357142857142857'],
    ['2025-09-02 18:20:00+00', '2.4'],
    ['2025-09-02 18:21:00+00', '2.40625'],
    ['2025-09-02 18:23:00+00', '2.40625'],
    ['2025-09-02 18:25:00+00', '2.40625'],
    ['2025-09-02 18:27:00+00', '2.40625'],
    ['2025-09-02 18:29:00+00', '2.40625'],
    ['2025-09-02 18:31:00+00', '2.40625'],
    ['2025-09-02 18:33:00+00', '2.2941176470588234'],
    ['2025-09-02 18:35:00+00', '2.2941176470588234'],
    ['2025-09-02 18:37:00+00', '2.2941176470588234'],
    ['2025-09-02 18:39:00+00', '2.2941176470588234'],
    ['2025-09-02 18:41:00+00', '2.2941176470588234'],
    ['2025-09-02 18:43:00+00', '2.2941176470588234'],
    ['2025-09-02 18:45:00+00', '2.3055555555555554'],
    ['2025-09-02 18:47:00+00', '2.3055555555555554'],
    ['2025-09-02 18:49:00+00', '2.3055555555555554'],
    ['2025-09-02 18:51:00+00', '2.263157894736842'],
    ['2025-09-02 18:53:00+00', '2.263157894736842'],
    ['2025-09-02 18:55:00+00', '2.263157894736842'],
    ['2025-09-02 18:57:00+00', '2.263157894736842'],
    ['2025-09-02 18:59:00+00', '2.263157894736842'],
    ['2025-09-02 19:01:00+00', '2.263157894736842'],
    ['2025-09-02 19:03:00+00', '2.15'],
    ['2025-09-02 19:05:00+00', '2.0952380952380953'],
    ['2025-09-02 19:07:00+00', '2.0952380952380953'],
    ['2025-09-02 19:09:00+00', '2.0454545454545454'],
    ['2025-09-02 19:11:00+00', '2.0434782608695654'],
    ['2025-09-02 19:13:00+00', '2.0434782608695654'],
    ['2025-09-02 19:15:00+00', '2.0'],
    ['2025-09-02 19:17:00+00', '2.0'],
    ['2025-09-02 19:19:00+00', '1.96'],
    ['2025-09-02 19:21:00+00', '1.96'],
    ['2025-09-02 19:23:00+00', '1.9230769230769231'],
    ['2025-09-02 19:25:00+00', '1.9230769230769231'],
    ['2025-09-02 19:27:00+00', '1.9230769230769231'],
    ['2025-09-02 19:29:00+00', '1.9230769230769231'],
    ['2025-09-02 19:31:00+00', '1.9230769230769231'],
    ['2025-09-02 19:33:00+00', '1.8888888888888888'],
    ['2025-09-02 19:35:00+00', '1.8888888888888888'],
    ['2025-09-02 19:37:00+00', '1.8888888888888888'],
    ['2025-09-02 19:39:00+00', '1.8888888888888888'],
    ['2025-09-02 19:41:00+00', '1.8888888888888888'],
  ])

  useEffect(() => {
    if (!dashboardId) return    

    let mounted = true
    setIsDashboardLoading(true)
    
    const init = async () => {
      try {
        const res = await listGraphsForDashboard(dashboardId)
        const list = Array.isArray(res) ? res : []

        // initialize graph state with per-graph loading flag
        if (!mounted) return
        setGraphs(
          list.map((g) => ({ ...g, pointsLoading: true, pointsError: null }))
        )

        // fire off parallel requests to fetch points for each graph
        list.forEach((g) => {
          // call getGraphPoints; update each graph as its response arrives
          getGraphPoints(g)
            .then((data) => {
              if (data.series.length === 1) {
                data.series[0].data = mockData[0]
              }
              if (data.series.length >= 2){
                for (let i=0;i<data.series.length;i++){
                  data.series[i].data = mockData[i % mockData.length]
                }
              }
              if (!mounted) return
              setGraphs((prev) =>
                prev.map((pg) =>
                  pg.graphId ===
                  (data && data.graphId ? data.graphId : g.graphId)
                    ? {
                        ...pg,
                        // prefer returned series/settings; fall back to original
                        series: data.series || pg.series,
                        settings: data.settings || pg.settings,
                        pointsLoading: false,
                        pointsError: null,
                      }
                    : pg
                )
              )
            })
            .catch((err) => {
              console.error('Error fetching graph points for', g.graphId, err)
              if (!mounted) return
              setGraphs((prev) =>
                prev.map((pg) =>
                  pg.graphId === g.graphId
                    ? {
                        ...pg,
                        pointsLoading: false,
                        pointsError: err?.message || 'Failed to fetch points',
                      }
                    : pg
                )
              )
            })
        })
      } catch (err) {
        console.error('Error loading graphs:', err)
        if (!mounted) return
        setGraphs([])
      } finally {
        setIsDashboardLoading(false)
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [dashboardId])

  const showToast = (message, type = 'info') => {
    setToast({ message, type, visible: true })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }
  const closeToast = () => setToast((p) => ({ ...p, visible: false }))


  const handleGraphClick = (graphObject) => {
    setSelectedGraph(graphObject)
  }


  const handleConfirmDelete = () => {
    const id = confirmDelete.graphId
    if (!id) return

    deleteGraph(id)
      .then(() => {
        setGraphs((prev) => prev.filter((g) => g.graphId !== id))
        showToast('Graph deleted successfully', 'success')
      })
      .catch((err) => {
        console.error('Error deleting graph:', err)
        showToast(
          'Failed to delete graph: ' + (err?.message || 'Unknown error'),
          'error'
        )
      })

    setConfirmDelete({ visible: false, graphId: null })
  }
  const handleCancelDelete = () => {
    setConfirmDelete({ visible: false, graphId: null })
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen overflow-y-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h5 className="text-2xl font-bold text-gray-900">Manage Graphs</h5>
          <p className="text-gray-400">
            Create and manage your graphs for better insights
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-lime-400 text-black font-medium px-4 py-2 rounded-lg hover:bg-lime-500 transition"
        >
          Create Graph
        </button>
      </div>

      {graphs.length === 0 && !isDashboardLoading && (
        <p className="text-gray-500">No graphs available for this dashboard.</p>
      )}

      {isDashboardLoading && (
        <div className="w-48 h-12">Loading Dashboard...</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {graphs.map((g) => {
          const parsedSettings = g.settings
            ? (() => {
                try {
                  return JSON.parse(g.settings)
                } catch {
                  return {}
                }
              })()
            : {}

          return (
            <div
              key={g.graphId}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition relative"
            >
              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setConfirmDelete({
                    visible: true,
                    graphId: g.graphId,
                  })
                }}
                className="absolute top-2 right-2 p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
              >
                <Trash2 size={20} className="text-red-500" cursor="pointer"/>
              </button>

              <div onClick={() => handleGraphClick(g)}>
                <h2 className="text-lg font-semibold mb-2 cursor-pointer">
                  {g.graphName}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {g.graphType || 'Unknown type'} • Time range:{' '}
                  {epochToReadable(g.defaultTimeRange?.split('|')[0])} -{' '}
                  {epochToReadable(g.defaultTimeRange?.split('|')[1]) ||
                    'Not specified'}
                </p>

                {/* Per-graph loading indicator while points are being fetched */}
                {g.pointsLoading ? (
                  // ---------------- LOADING ----------------
                  <div className="relative">
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                      <div className="w-10 h-10 border-4 border-lime-400 border-t-lime-200 rounded-full animate-spin"></div>
                    </div>
                    <div className="text-gray-400 italic">
                      Loading graph data...
                    </div>
                  </div>
                ) : g.pointsError ? (
                  // ---------------- ERROR ----------------
                  <div className="text-sm text-red-600">{g.pointsError}</div>
                ) : (
                  // ---------------- DATA (INCLUDING EMPTY) ----------------
                  <>
                    {/* Show this message if ALL series have empty data arrays */}
                    {Array.isArray(g.series) &&
                      g.series.length > 0 &&
                      g.series.every(
                        (s) => Array.isArray(s.data) && s.data.length === 0
                      ) && (
                        <p className="text-gray-400 italic">
                          No results for this time range. Adjust the time filter
                          to view results.
                        </p>
                      )}

                    {/* Still render the graph (empty graph allowed) */}
                    <GraphView
                      type={g.graphType}
                      series={g.series}
                      settings={parsedSettings}
                      height={350}
                      width={'100%'}
                    />
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {/* Large Graph Modal */}
      {selectedGraph && (
        <LargeGraphModal
          graph={selectedGraph}
          setGraphs={setGraphs}
          onClose={() => setSelectedGraph(null)}
        />
      )}

      {/* Create Graph Modal */}
      <DashboardCreateModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        dashboardId={dashboardId}
        onCreated={(created) => {
          // If API returns created graph object, append it to the list
          if (created) setGraphs((prev) => [created, ...prev])
        }}
      />
      <ActionConfirmModal
        visible={confirmDelete.visible}
        type="delete"
        message="Are you sure you want to delete this graph?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isConfirmButtonVisible={true}
        isCancelButtonVisible={true}
        confirmButtonName="Yes, Delete"
        cancelButtonName="Cancel"
      />

      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  )
}
