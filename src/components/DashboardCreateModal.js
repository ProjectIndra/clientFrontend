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
        aggregation: 'sum',
        filters: {
          provider_id: "",
          entity_name: "all_vms",
        },
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
  const [entityType, setEntityType] = useState('vm')

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

        // Set default selections after data is loaded
        setForm((prevForm) => ({
          ...prevForm,
          series: prevForm.series.map((s) => {
            if (s.entityType === 'vm') {
              const providerIdsSet = new Set(
                hisVms.map((v) => v.provider_id)
              )
              const providerIds = Array.from(providerIdsSet)
              return {
                ...s,
                filters: {
                  ...s.filters,
                  provider_id: providerIds,
                  entity_name: "all_vms",
                },
              }
            } else if (s.entityType === 'provider' && !s.filters.provider_id) {
              const providerIdsSet = new Set(
                hisProviders.map((p) => p.value)
              )
              const providerIds = Array.from(providerIdsSet)
              return {
                ...s,
                filters: {
                  ...s.filters,
                  provider_id: providerIds,
                },
              }
            }
            return s
          }),
        }))

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

  const addSeries = () => {
    // Determine defaults based on entity type
    const vmsProviderIdsSet = new Set(
      entityOptions.hisVms.map((v) => v.provider_id)
    )
    const providerIds = Array.from(vmsProviderIdsSet)

    setForm((p) => ({
      ...p,
      series: [
        ...p.series,
        {
          metricId: '',
          metricName: '',
          entityType: 'vm',
          aggregation: 'sum',
          filters: {
            provider_id: providerIds,
            entity_name: "all_vms",
          },
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
    const vmsProviderIdsSet = new Set(
      entityOptions.hisVms.map((v) => v.provider_id)
    )
    const providerIds = Array.from(vmsProviderIdsSet)

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
          aggregation: 'sum',
          filters: {
            provider_id: providerIds,
            entity_name: "all_vms",
          },
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
      if (!s.filters?.entity_name && s.entityType === 'vm') {
        showToast(`VM is required for series ${i + 1}`, 'error')
        return
      }
      if (!s.filters?.entity_name && s.entityType === 'provider' && s.filters?.provider_id !== 'all_providers') {
        showToast(`VM is required for series ${i + 1}`, 'error')
        return
      }
      if (!s.filters?.provider_id && s.entityType === 'provider') {
        showToast(`Provider ID filter is required for series ${i + 1}`, 'error')
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

    // const endTime = Date.now()
    // const startTime = endTime - form.defaultTimeRange * 60 * 1000

    // all provider IDs of the user
    const userProviderIdsSet = new Set(
      entityOptions.hisProviders.map((p) => p.value)
    )
    const userProviderIds = Array.from(userProviderIdsSet)

    // all VM provider IDs of the user where he/she has created vm
    const vmsProviderIdsSet = new Set(
      entityOptions.hisVms.map((p) => p.provider_id)
    )
    const vmsProviderIds = Array.from(vmsProviderIdsSet)

    const payload = {
      dashboardId,
      graphName: form?.graphName,
      graphType: form?.graphType,
      defaultTimeRange: `${form?.defaultTimeRange}|0`,
      refreshIntervalSeconds: Number(form?.refreshIntervalSeconds) || 30,
      settings: JSON.stringify({}),
      series: form?.series.map((s) => ({
        metricId: '',
        metricName: s?.metricName,
        entityType: s?.entityType,
        aggregation: s?.aggregation,
        filters: {
          provider_id: s?.filters?.provider_id ==='all_providers'
              ? JSON.stringify(userProviderIds) : s?.filters?.entity_name ==='all_vms'
              ? JSON.stringify(vmsProviderIds) :
               s?.filters?.provider_id ,
          // if entity_name is all_vms, then we don't need any key named entity_name in filters
          ...(s?.filters?.entity_name &&
          s?.filters?.entity_name !== 'all_vms' &&
          s?.filters?.provider_id &&
          s?.filters?.provider_id !== 'all_providers'
            ? { entity_name: s?.filters?.entity_name }
            : {}),
        },
        groupBy: [],
        yAxisPosition: s?.yAxisPosition,
      })),
    }
    console.log('Submitting graph payload:', payload)
    try {
      setLoading(true)
      const res = await createGraph(payload)
      if (onCreated) onCreated(res)
      showToast('Graph created successfully', 'success')
      onClose()

    const vmsProviderIdsSet = new Set(
      entityOptions.hisVms.map((v) => v.provider_id)
    )
    const providerIds = Array.from(vmsProviderIdsSet)
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
            aggregation: 'sum',
            filters: {
              provider_id: providerIds,
              entity_name: "all_vms",
            },
            groupBy: [],
            yAxisPosition: 'left',
          },
        ],
      })

      window.location.reload()
    } catch (err) {
      console.error(err)
      showToast('Failed to create graph. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const graphTypeOptions = [{ label: 'Time series', value: 'time_series' }]

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
    { label: 'Average', value: 'avg' },
    { label: 'Sum', value: 'sum' },
    // { label: 'Minimum', value: 'min' },
    // { label: 'Maximum', value: 'max' },
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
            options={graphTypeOptions}
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
                <DropdownSelect
                  label="Entity Type"
                  value={s?.entityType}
                  onChange={(v) => {
                    updateSeriesField(idx, 'entityType', v)

                    // Set defaults based on entity type
                    if (v === 'vm') {
                      const providerIds = entityOptions.hisVms.map(
                        (vm) => vm.provider_id
                      )
                      updateSeriesField(idx, 'filters', {})
                      updateSeriesFilter(idx, 'provider_id', providerIds)
                      updateSeriesFilter(idx, 'entity_name', 'all_vms')
                      updateSeriesField(idx, 'entity_name', '')
                      setEntityType('vm')
                    } else if (v === 'provider') {
                      const providerIds = entityOptions.hisProviders.map(
                        (p) => p.value
                      )
                      updateSeriesField(idx, 'filters', {})
                      updateSeriesFilter(idx, 'provider_id', providerIds)
                      updateSeriesField(idx, 'metricName', '')
                      setEntityType('provider')
                    } else {
                      updateSeriesFilter(idx, 'provider_id', '')
                      updateSeriesFilter(idx, 'entity_name', '')
                      updateSeriesField(idx, 'metricName', '')
                      setEntityType(v)
                    }
                  }}
                  options={entityTypeOptions}
                />

                <DropdownSelect
                  label={`Select ${s?.entityType}`}
                  value={
                    s?.entityType === 'provider' ? s?.filters?.provider_id
                     : s?.filters?.entity_name
                  }
                  onChange={(val) => {
                    if (s?.entityType === 'vm') {
                      if (val === 'all_vms') {
                        updateSeriesField(idx, 'filters', {})
                        updateSeriesFilter(idx, 'entity_name', 'all_vms')
                        updateSeriesField(idx, 'aggregation', 'sum')
                        return
                      }

                      const found = entityOptions.hisVms.find(
                        (v) => v.value === val
                      )
                      updateSeriesField(idx, 'aggregation', 'avg')
                      const providerId = found ? found.provider_id : ''
                      updateSeriesFilter(idx, 'provider_id', providerId)
                      updateSeriesFilter(idx, 'entity_name', val)
                      
                    } else if (s?.entityType === 'provider') {
                      updateSeriesField(idx, 'filters', {})
                      if (val === 'all_providers') {
                        updateSeriesFilter(idx, 'provider_id', 'all_providers')
                        updateSeriesField(idx, 'aggregation', 'sum')
                        setEntityType('provider')
                        return
                      }
                      updateSeriesField(idx, 'aggregation', 'sum')
                      updateSeriesFilter(idx, 'provider_id', val)
                    }
                  }}
                  options={[
                    {
                      label: `All ${s?.entityType}s`,
                      value: `all_${s?.entityType}s`,
                    },
                    ...(s?.entityType === 'vm'
                      ? entityOptions.hisVms.map((v) => ({
                          label: v.label,
                          value: v.value,
                        }))
                      : s?.entityType === 'provider'
                      ? entityOptions.hisProviders.map((p) => ({
                          label: p.label,
                          value: p.value,
                        }))
                      : []),
                  ]}
                  loading={entityLoading}
                />

                {/* Conditional VM List dropdown for provider entity type */}
                {s?.entityType === 'provider' &&
                  !Array.isArray(s?.filters.provider_id) &&
                  s?.filters.provider_id !== 'all_providers' &&
                  (() => {
                    const provider = entityOptions.hisProviders.find(
                      (p) => p.value === s?.filters.provider_id
                    )
                    const vmOptions = provider
                      ? provider.allVms.map((vm) => ({
                          label: vm.vm_name,
                          value: vm.vm_id,
                        }))
                      : []
                    return (
                      <DropdownSelect
                        label="Select VM"
                        value={s?.filters.entity_name || 'all_vms'}
                        onChange={(val) => {
                          if (val === 'all_vms') {
                            updateSeriesFilter(idx, 'entity_name', 'all_vms')
                            updateSeriesField(idx, 'aggregation', 'sum')
                            setEntityType('provider')
                            return
                          }
                          setEntityType('vm')
                          updateSeriesField(idx, 'aggregation', 'avg')
                          updateSeriesFilter(idx, 'entity_name', val)
                        }}
                        options={[
                          { label: 'All VMs', value: 'all_vms' },
                          ...vmOptions,
                        ]}
                        loading={entityLoading}
                      />
                    )
                  })()}

                <DropdownSelect
                  label="Metric Name"
                  value={s?.metricName}
                  onChange={(v) => updateSeriesField(idx, 'metricName', v)}
                  options={[
                    { label: '', value: '' },
                    ...(metric_name_entity_type_mapping[entityType] || []),
                  ]}
                />

                <DropdownSelect
                  label="Aggregation"
                  value={s?.aggregation}
                  disabled={!s?.metricName}
                  onChange={(v) => updateSeriesField(idx, 'aggregation', v)}
                  options={aggregationOptions}
                />
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
            className="px-4 py-2 bg-lime-500 text-white rounded"
          >
            {loading ? 'Creating...' : 'Create & Submit'}
          </button>
        </div>
      </form>

      {toast?.visible && (
        <Toast
          message={toast?.message}
          type={toast?.type}
          onClose={closeToast}
        />
      )}
    </div>
  )
}

export default DashboardCreateModal
