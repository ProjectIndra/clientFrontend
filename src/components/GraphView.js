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

  series.forEach((s) => {
    s.data.forEach(([timestamp, value]) => {
      const t = dayjs(timestamp).format('HH:mm')

      if (!mergedData[t]) mergedData[t] = { timestamp: t }
      mergedData[t][s.metricName] = Number(value)
    })
  })

  const parsedData = Object.values(mergedData)

  const colors = ['#0ea5e9', '#84cc16', '#f97316', '#a855f7']

  return (
    <div className="p-4 border border-lime-300 rounded-lg shadow-sm bg-white">
      <ResponsiveContainer width={width} height={height}>
        {graphType === 'area' ? (
          // ------------------------------------
          //        AREA CHART
          // ------------------------------------
          <AreaChart
            data={parsedData}
            margin={{ top: 20, right: 10, left: -25, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="timestamp" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend
              formatter={(value) => (
                <span style={{ marginLeft: 10, marginRight: 40 }}>{value}</span>
              )}
            />

            {series.map((s, idx) => (
              <Area
                key={s.seriesId}
                type="monotone"
                dataKey={s.metricName}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length] + '55'} // light fill
                strokeWidth={2}
                dot={false}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        ) : (
          // ------------------------------------
          //        LINE CHART (default)
          // ------------------------------------
          <LineChart
            data={parsedData}
            margin={{ top: 20, right: 10, left: -25, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="timestamp" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />

            {series.map((s, idx) => (
              <Line
                key={s.seriesId}
                type="monotone"
                dataKey={s.metricName}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
