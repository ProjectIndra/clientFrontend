import { useEffect, useState } from 'react'
import { getReadableTimeRange } from '../helper'
import { GraphView } from '../components/GraphView'
import { useSearchParams } from 'react-router-dom'
import { LargeGraphModal } from '../components/largeGraphModal'
import { listGraphsForDashboard, deleteGraph, getGraphPoints } from '../apiServices'
import { DeleteIcon } from '../utils/icons'
import Toast from '../components/ToastService'
import ActionConfirmModal from '../components/actionConfirmModal'
import DashboardCreateModal from '../components/DashboardCreateModal'

export const DashboardView = () => {
  const [searchParams] = useSearchParams()
  const dashboardId = searchParams.get('id')
  const [graphs, setGraphs] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [toast, setToast] = useState({
    message: '',
    type: 'info',
    visible: false,
  })
  const [confirmDelete, setConfirmDelete] = useState({
    visible: false,
    graphId: null,
  })
  const [selectedGraph, setSelectedGraph] = useState(null)
  const [isDashboardLoading, setIsDashboardLoading] = useState(false)

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
          list?.map((g) => ({ ...g, pointsLoading: true, pointsError: null }))
        )

        // fire off parallel requests to fetch points for each graph
        list?.forEach((g) => {
          // call getGraphPoints; update each graph as its response arrives
          getGraphPoints(g)
            .then((data) => {
              if (!mounted) return
              setGraphs((prev) =>
                prev?.map((pg) =>
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
                prev?.map((pg) =>
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
    <div className="p-6 bg-palette-wrapper min-h-screen overflow-y-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h5 className="text-2xl font-bold text-palette-textPrimary">Manage Graphs</h5>
          <p className="text-palette-textMuted">
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
        <p className="text-palette-textMuted">No graphs available for this dashboard.</p>
      )}

      {isDashboardLoading && (
        <div className="w-48 h-12">Loading Dashboard...</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {graphs?.map((g) => {
          const parsedSettings = g.settings
            ? (() => {
                try {
                  return JSON.parse(g.settings)
                } catch {
                  return {}
                }
              })()
            : {}
          
          const { startReadable, endReadable } = getReadableTimeRange(g.defaultTimeRange)


          return (
            <div
              key={g.graphId}
              className="bg-palette-surface p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition relative"
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
                <DeleteIcon className="text-red-500" />
              </button>

              <div onClick={() => handleGraphClick(g)}>
                <h2 className="text-lg font-semibold mb-2 cursor-pointer">
                  {g.graphName}
                </h2>
                <p className="text-sm text-palette-textSecondary mb-4">
                  {g.graphType || 'Unknown type'} • Time range: {startReadable} - {endReadable}
                </p>

                {/* Per-graph loading indicator while points are being fetched */}
                {g.pointsLoading ? (
                  // ---------------- LOADING ----------------
                  <div className="relative">
                    <div className="absolute inset-0 bg-palette-surface bg-opacity-75 flex items-center justify-center z-10">
                      <div className="w-10 h-10 border-4 border-lime-400 border-t-lime-200 rounded-full animate-spin"></div>
                    </div>
                    <div className="text-palette-textMuted italic">
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
                        <p className="text-palette-textMuted italic">
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
