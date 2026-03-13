import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import dayjs from 'dayjs'

export const GraphView = ({
  graphType = 'line', // "line" | "area"
  series,
  settings,
  height = 350,
  width = '100%',
}) => {
  if (!Array.isArray(series) || series.length === 0) {
    return <p className="text-gray-400 italic">No graph data available</p>
  }

  // Convert API data → Recharts-friendly
  const mergedData = {}

  series?.forEach((s) => {
    s?.data?.forEach(([timestamp, value]) => {
      const d = dayjs(timestamp)
      const dateKey = d.format('YYYY-MM-DD') // full date
      const timeKey = d.format('HH:mm') // time only

      const xKey = `${timeKey}` // combined X-axis label

      if (!mergedData[xKey]) {
        mergedData[xKey] = {
          timestamp: xKey,
          date: dateKey,
          time: timeKey,
          fullTimestamp: d.format('YYYY-MM-DD HH:mm:ss'), // ← Add this
        }
      }


      mergedData[xKey][s.metricName] = Number(value)
    })

  })

  const parsedData = Object.values(mergedData)

  const dateChangeMarkers = []
  for (let i = 1; i < parsedData.length; i++) {
    if (parsedData[i].date !== parsedData[i - 1].date) {
      dateChangeMarkers.push({
        x: parsedData[i].timestamp,
        date: parsedData[i].date,
      })
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null

    const full = payload[0]?.payload?.fullTimestamp

    return (
      <div className="bg-white p-3 border rounded shadow text-sm">
        <p className="font-semibold text-gray-700">{full}</p>
        {payload?.map((item, idx) => (
          <p key={idx} style={{ color: item?.color }}>
            {item?.name}: {item?.value}
          </p>
        ))}
      </div>
    )
  }



  const colors = ['#0ea5e9', '#84cc16', '#f97316', '#a855f7']

  return (
    <div className="p-4 border border-lime-300 rounded-lg shadow-sm bg-white cursor-pointer">
      <ResponsiveContainer width={width} height={height}>
        {graphType === 'area' ? (
          // ------------------------------------
          //        AREA CHART
          // ------------------------------------
          <AreaChart
            data={parsedData}
            margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            {/* FIX: Use time string directly as X-axis, no formatter */}
            <XAxis dataKey="timestamp" stroke="#6b7280" />

            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ marginLeft: 10, marginRight: 40 }}>{value}</span>
              )}
            />

            {series?.map((s, idx) => (
              <Area
                key={s.seriesId}
                type="monotone"
                dataKey={s.metricName}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length] + '55'}
                strokeWidth={2}
                dot={false}
                fillOpacity={0.3}
              />
            ))}

            {/* Reference lines same as LineChart */}
            {dateChangeMarkers?.map((d, idx) => (
              <ReferenceLine
                key={idx}
                x={d.x}
                stroke="#9ca3af"
                strokeDasharray="4 4"
                label={{
                  value: dayjs(d.date).format('DD MMM'),
                  position: 'top',
                  fill: '#374151',
                  fontSize: 12,
                }}
              />
            ))}
          </AreaChart>
        ) : (
          // ------------------------------------
          //        LINE CHART (default)
          // ------------------------------------
          <LineChart
            data={parsedData}
            margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="timestamp" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />

            <Legend />

            {series?.map((s, idx) => (
              <Line
                key={s.seriesId}
                type="monotone"
                dataKey={s.metricName}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
            {dateChangeMarkers?.map((d, idx) => (
              <ReferenceLine
                key={idx}
                x={d.x}
                stroke="#9ca3af"
                strokeDasharray="4 4"
                label={{
                  value: dayjs(d.date).format('DD MMM'),
                  position: 'top',
                  fill: '#374151',
                  fontSize: 12,
                }}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
