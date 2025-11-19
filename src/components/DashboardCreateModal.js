import React, { useState } from 'react'
import { createGraph } from '../apiServices'
import { TextInput, NumberInput, DropdownSelect } from './FormControls'

const DashboardCreateModal = ({ visible, onClose, dashboardId, onCreated }) => {
  const [form, setForm] = useState({
    graphName: '',
    graphType: 'time_series',
    defaultTimeRange: '',
    refreshIntervalSeconds: 30,
    settings: '',
    series: [
      {
        metricId: '',
        metricName: '',
        entityType: 'vm',
        aggregation: 'AVG',
        filters: { provider_id: '', entity_name: '' },
        groupBy: [],
        yAxisPosition: 'left',
      },
    ],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!visible) return null

  const updateField = (name, value) => setForm((p) => ({ ...p, [name]: value }))
  const updateSeriesField = (idx, name, value) => {
    setForm((p) => {
      const s = [...p.series]
      s[idx] = { ...s[idx], [name]: value }
      return { ...p, series: s }
    })
  }

  const updateSeriesFilter = (idx, key, value) => {
    setForm((p) => {
      const s = [...p.series]
      s[idx] = { ...s[idx], filters: { ...s[idx].filters, [key]: value } }
      return { ...p, series: s }
    })
  }

  // groupBy and metricId are not taken from user now; we keep internal defaults

  const addSeries = () => {
    setForm((p) => ({
      ...p,
      series: [
        ...p.series,
        {
          metricId: '',
          metricName: '',
          entityType: 'vm',
          aggregation: 'AVG',
          filters: { provider_id: '', entity_name: '' },
          groupBy: [],
          yAxisPosition: 'left',
        },
      ],
    }))
  }

  const removeSeries = (idx) => {
    setForm((p) => ({ ...p, series: p.series.filter((_, i) => i !== idx) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Basic validation
    if (!form.graphName) {
      setError('Graph name is required')
      return
    }

    const payload = {
      dashboardId,
      graphName: form.graphName,
      graphType: form.graphType,
      defaultTimeRange: form.defaultTimeRange,
      refreshIntervalSeconds: Number(form.refreshIntervalSeconds) || 30,
      // send stringified empty JSON for settings as requested
      settings: JSON.stringify({}),
      series: form.series.map((s) => ({
        // metricId and groupBy should be empty as requested
        metricId: '',
        metricName: s.metricName,
        entityType: s.entityType,
        aggregation: s.aggregation,
        filters: s.filters,
        groupBy: [],
        yAxisPosition: s.yAxisPosition,
      })),
    }

    try {
      setLoading(true)
      const res = await createGraph(payload)
      if (onCreated) onCreated(res)
      onClose()
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Failed to create graph')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-[400px] max-w-full max-h-[500px] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create Graph</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 p-1 rounded"
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
        </div>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextInput
            label="Graph Name"
            value={form.graphName}
            onChange={(v) => updateField('graphName', v)}
            placeholder="Graph Name"
          />

          <DropdownSelect
            label="Graph Type"
            value={form.graphType}
            onChange={(v) => updateField('graphType', v)}
            // options={["time_series", "gauge", "bar"]}
            options={['time_series']} // limited to time_series per request
          />

          <NumberInput
            label="Default Time Range (in minutes)"
            value={form.defaultTimeRange}
            onChange={(v) => updateField('defaultTimeRange', v)}
            placeholder="60"
          />

          <NumberInput
            label="Refresh Interval (in seconds)"
            value={form.refreshIntervalSeconds}
            onChange={(v) => updateField('refreshIntervalSeconds', v)}
            placeholder="30"
          />
          {/* settings removed per request - we send stringified empty JSON in payload */}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Series</h4>
            <button
              type="button"
              onClick={addSeries}
              className="text-sm text-lime-600"
            >
              + Add series
            </button>
          </div>

          {form.series.map((s, idx) => (
            <div key={idx} className="border rounded p-3 mb-3">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium">Series #{idx + 1}</div>
                {form.series.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSeries(idx)}
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* metricId and groupBy are not editable per request; metricName kept */}
                <TextInput
                  label="Metric Name"
                  value={s.metricName}
                  onChange={(v) => updateSeriesField(idx, 'metricName', v)}
                  placeholder="metricName"
                />

                <DropdownSelect
                  label="Entity Type"
                  value={s.entityType}
                  onChange={(v) => updateSeriesField(idx, 'entityType', v)}
                  options={['vm', 'provider', 'network']}
                />

                <DropdownSelect
                  label="Aggregation"
                  value={s.aggregation}
                  onChange={(v) => updateSeriesField(idx, 'aggregation', v)}
                  // options={["AVG", "SUM", "MIN", "MAX", "COUNT"]}
                  options={['AVG']}
                />

                <TextInput
                  label="Provider ID (filter)"
                  value={s.filters.provider_id}
                  onChange={(v) => updateSeriesFilter(idx, 'provider_id', v)}
                  placeholder="provider_id"
                />

                <DropdownSelect
                  label={`Entity Name ${s.entityType ? `(${s.entityType})` : ''}`}
                  value={s.filters.entity_name}
                  onChange={(v) => updateSeriesFilter(idx, 'entity_name', v)}
                  options={['', 'entity1', 'entity2', 'entity3']} // example
                />

                {/* <DropdownSelect
                  label="Y Axis Position"
                  value={s.yAxisPosition}
                  onChange={(v) => updateSeriesField(idx, 'yAxisPosition', v)}
                  options={["left", "right"]}
                /> */}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-lime-500 text-white rounded"
          >
            {loading ? 'Creating...' : 'Create & Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DashboardCreateModal
