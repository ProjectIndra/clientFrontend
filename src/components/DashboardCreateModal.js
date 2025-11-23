import React, { useState, useEffect } from 'react'
import { createGraph } from '../apiServices'
import { TextInput, NumberInput, DropdownSelect } from './FormControls'
import Toast from './ToastService'
import { listAllServices } from '../apiServices'

const DashboardCreateModal = ({ visible, onClose, dashboardId, onCreated }) => {
  const [form, setForm] = useState({
    graphName: '',
    graphType: 'time_series',
    defaultTimeRange: 60,
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
  const [toast, setToast] = useState({
    message: '',
    type: 'info',
    visible: false,
  })

  // useEffect to load the entity names and build options for dropdowns
  const [entityOptions, setEntityOptions] = useState({
    hisVms: [],
    hisProviders: [],
  })
  const [entityLoading, setEntityLoading] = useState(false)

  useEffect(() => {
    if (!visible) return

    const fetchEntityNames = async () => {
      try {
        setEntityLoading(true)
        const services = await listAllServices()

        const hisVms = Array.isArray(services.hisvms)
          ? services.hisvms.map((vm) => ({
            label: vm?.vmName || vm?.internalVmName,
            value: vm?.internalVmName,
            provider_id: vm?.providerId,
          }))
          : []

        const hisProviders = Array.isArray(services.hisproviders)
          ? services.hisproviders.map((provider) => ({
            label: provider?.providerName,
            value: provider?.providerId,
            allVms: Array.isArray(provider.vmsInThisProvider)
              ? provider.vmsInThisProvider.map((vm) => ({
                vm_id: vm?.vmId,
                vm_name: vm?.vmName || vm?.vmId,
              }))
              : [],
          }))
          : []

        setEntityOptions({ hisVms, hisProviders })
        setEntityLoading(false)
      } catch (err) {
        console.error('Failed to fetch entity names', err)
        setEntityLoading(false)
      }
    }

    fetchEntityNames()
  }, [visible])

  const showToast = (message, type = 'info') => {
    setToast({ message, type, visible: true })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  const closeToast = () => setToast((p) => ({ ...p, visible: false }))

  if (!visible) return null

  const updateField = (name, value) => setForm((p) => ({ ...p, [name]: value }))
  const updateSeriesField = (idx, name, value) => {
    setForm((p) => {
      const s = [...p?.series]
      s[idx] = { ...s[idx], [name]: value }
      return { ...p, series: s }
    })
  }

  const updateSeriesFilter = (idx, key, value) => {
    setForm((p) => {
      const s = [...p?.series]
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
    setForm((p) => ({ ...p, series: p.series?.filter((_, i) => i !== idx) }))
  }

  const handleCancel = () => {
    // reset form
    setForm({
      graphName: '',
      graphType: 'time_series',
      defaultTimeRange: 60,
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
    onClose()
  }
  const handleSubmit = async (e) => {
    e.preventDefault()  
    setError(null)
    // Basic validation (use toast for user-visible validation)
    if (!form.graphName) {
      showToast('Graph name is required', 'error')
      return
    }
    if (!form.graphType) {
      showToast('Graph type is required', 'error')
      return
    }
    if (form.defaultTimeRange <= 0) {
      showToast('Default time range must be positive', 'error')
      return
    }
    if (form.refreshIntervalSeconds <= 0) {
      showToast('Refresh interval must be positive', 'error')
      return
    }
    if (form.series?.length === 0) {
      showToast('At least one series is required', 'error')
      return
    }
    for (let i = 0; i < form.series?.length; i++) {
      const s = form.series[i]
      if (!s.entityType) {
        showToast(`Entity type is required for series ${i + 1}`, 'error')
        return
      }
      if (!s.filters?.entity_name) {
        showToast(
          `VM is required for series ${i + 1}`,
          'error'
        )
        return
      }
      if (!s.filters?.provider_id) {
        showToast(
          `Provider ID filter is required for series ${i + 1}`,
          'error'
        )
        return
      }
      if (!s.metricName) {
        showToast(`Metric name is required for series ${i + 1}`, 'error')
        return
      }
      if (!s.aggregation) {
        showToast(`Aggregation is required for series ${i + 1}`, 'error')
        return
      }
    }
    // current time in epoch value through epoch conversion
    const endTime = Date.now()
    const startTime = endTime - form.defaultTimeRange * 60 * 1000

    const payload = {
      dashboardId,
      graphName: form?.graphName,
      graphType: form?.graphType,
      defaultTimeRange: `${startTime}|${endTime}`,
      // defaultTimeRange: '1756835615|1756846615',
      refreshIntervalSeconds: Number(form?.refreshIntervalSeconds) || 30,
      // send stringified empty JSON for settings as requested
      settings: JSON.stringify({}),
      series: form?.series.map((s) => ({
        // metricId and groupBy should be empty as requested
        metricId: '',
        metricName: s?.metricName,
        entityType: s?.entityType,
        aggregation: s?.aggregation,
        filters: s?.filters,
        // filters: {
        // "provider_id": "736f2ffd-cfdd-45d1-9dce-5bec637ecfaa",
        // "entity_name": "736f2ffd-cfdd-45d1-9dce-5bec637ecfaa"
        // },
        groupBy: [],
        yAxisPosition: s?.yAxisPosition,
      })),
    }

    try {
      setLoading(true)
      const res = await createGraph(payload)
      if (onCreated) onCreated(res)
      showToast('Graph created successfully', 'success')
      onClose()
      //reset form
      setForm({
        graphName: '',
        graphType: 'time_series',
        defaultTimeRange: 60,
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
      // reload the page to reflect new graph
      window.location.reload()
    } catch (err) {
      console.error(err)
      showToast('Failed to create graph. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const graphTypeOptions = [
    { label: 'Time series', value: 'time_series' },
    // { label: 'Gauge', value: 'gauge' },
    // { label: 'Bar', value: 'bar' },
  ]

  const entityTypeOptions = [
    { label: 'Network', value: 'network' },
    { label: 'VM', value: 'vm' },
    { label: 'Provider', value: 'provider' },
  ]

  const metric_name_entity_type_mapping = {
    network: [
      { label: 'Active Network', value: 'network_active' },
      { label: 'Inactive Network', value: 'network_inactive' },
    ],

    vm: [
      { label: 'CPU Used', value: 'vm_cpu_used' },
      { label: 'RAM Allocated', value: 'vm_ram_allocated' },
      { label: 'CPU Allocated', value: 'vm_cpu_allocated' },
      { label: 'RAM Used', value: 'vm_ram_used' },
      { label: 'State', value: 'vm_state' },
    ],

    provider: [
      { label: 'Active VMs', value: 'active_vms' },
      { label: 'Inactive VMs', value: 'inactive_vms' },
      { label: 'Provider Heartbeat', value: 'provider_heartbeat' },
    ],
  }

  const aggregationOptions = [
    { label: 'Average', value: 'AVG' },
    // { label: 'SUM', value: 'SUM' },
    // { label: 'MIN', value: 'MIN' },
    // { label: 'MAX', value: 'MAX' },
    // { label: 'COUNT', value: 'COUNT' },
  ]
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
            value={form?.graphName}
            onChange={(v) => updateField('graphName', v)}
            placeholder="Graph Name"
          />

          <DropdownSelect
            label="Graph Type"
            value={form?.graphType}
            onChange={(v) => updateField('graphType', v)}
            // options={["time_series", "gauge", "bar"]}
            options={graphTypeOptions} // limited to time_series per request
          />

          <NumberInput
            label="Graph Default Time Window(in minutes)"
            value={form?.defaultTimeRange}
            onChange={(v) => updateField('defaultTimeRange', v)}
            placeholder="60"
          />

          <NumberInput
            label="Graph Refresh Interval (in seconds)"
            value={form?.refreshIntervalSeconds}
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
                <div className="text-sm font-medium">Series {idx + 1}</div>
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
                {/* <TextInput
                  label="Metric Name"
                  value={s.metricName}
                  onChange={(v) => updateSeriesField(idx, 'metricName', v)}
                  placeholder="metricName"
                /> */}

                <DropdownSelect
                  label="Entity Type"
                  value={s?.entityType}
                  onChange={(v) => {
                    updateSeriesField(idx, 'entityType', v)
                    updateSeriesFilter(idx, 'provider_id', '')
                    updateSeriesFilter(idx, 'entity_name', '')
                  }}
                  options={entityTypeOptions}
                />

                {/* Entity Name dropdown: options depend on selected entityType */}
                <DropdownSelect
                  label={`Select ${s?.entityType}`}
                  value={s?.entityType === 'provider'
                    ? s?.filters.provider_id
                    : s?.filters.entity_name
                  }
                  onChange={(val) => {
                    if (s?.entityType === 'vm') {
                      // find provider_id for selected vm
                      const found = entityOptions.hisVms?.find(
                        (v) => v.value === val
                      )
                      const providerId = found ? found.provider_id : ''
                      updateSeriesFilter(idx, 'provider_id', providerId)
                      updateSeriesFilter(idx, 'entity_name', val)
                    } else if (s?.entityType === 'provider') {
                      updateSeriesFilter(idx, 'provider_id', val)
                      updateSeriesFilter(idx, 'entity_name', '')
                    }
                  }}
                  options={[
                    { label: '', value: '' },
                    ...(s?.entityType === 'vm'
                      ? entityOptions.hisVms?.map((v) => ({
                        label: v.label,
                        value: v.value,
                      }))
                      : s?.entityType === 'provider'
                        ? entityOptions.hisProviders?.map((p) => ({
                          label: p.label,
                          value: p.value,
                        }))
                        : []),
                  ]}
                  loading={entityLoading}
                />

                {/*  Conditional VM List dropdown for provider entity type */}
                {
                  s?.entityType === 'provider' ?
                    (() => {
                      const provider = entityOptions.hisProviders?.find(
                        (p) => p.value === s?.filters.provider_id
                      )
                      const vmOptions = provider
                        ? provider.allVms?.map((vm) => ({
                          label: vm.vm_name,
                          value: vm.vm_id,
                        }))
                        : []
                      return (
                        <DropdownSelect
                          label="Select vm"
                          value={s?.filters.entity_name}
                          onChange={(val) => {
                            // set entity_name as vm_id and keep provider_id
                            updateSeriesFilter(idx, 'entity_name', val)
                          }}
                          options={[{ label: '', value: '' }, ...vmOptions]}
                          loading={entityLoading}
                        />
                      )
                    })()
                    : <></>
                }

                <DropdownSelect
                  label="Metric Name"
                  value={s?.metricName}
                  onChange={(v) => updateSeriesField(idx, 'metricName', v)}
                  options={[{ label: '', value: '' }, ...metric_name_entity_type_mapping[s?.entityType] || []]}
                />

                <DropdownSelect
                  label="Aggregation"
                  value={s?.aggregation}
                  onChange={(v) => updateSeriesField(idx, 'aggregation', v)}
                  options={aggregationOptions}
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
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="px-4 py-2 bg-lime-500 text-white rounded"
          >
            {loading ? 'Creating...' : 'Create & Submit'}
          </button>
        </div>
      </form>
      {/* Toast (local to modal) */}
      {toast?.visible && (
        <Toast message={toast?.message} type={toast?.type} onClose={closeToast} />
      )}
    </div>
  )
}

export default DashboardCreateModal
