import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import dayjs from 'dayjs'

export const GraphView = ({ type, series, settings }) => {
  if (!Array.isArray(series) || series.length === 0) {
    return <p className="text-gray-400 italic">No graph data available</p>
  }

  // Convert your API format into Recharts-friendly array
  const mergedData = {}

  series.forEach((s) => {
    s.data.forEach(([timestamp, value]) => {
      const t = dayjs(timestamp).format('HH:mm') // format for X-axis

      if (!mergedData[t]) mergedData[t] = { timestamp: t }
      mergedData[t][s.metricName] = Number(value)
    })
  })

  const parsedData = Object.values(mergedData)

  return (
    <div className="p-4 border border-lime-300 rounded-lg shadow-sm bg-white">
      <ResponsiveContainer width="100%" height={350}>
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
              strokeWidth={2}
              stroke={['#0ea5e9', '#84cc16', '#f97316', '#a855f7'][idx % 4]}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
