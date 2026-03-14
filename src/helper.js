export const epochToReadable = (epoch) => {
  const cleanEpoch = Number(epoch)

  if (Number.isNaN(cleanEpoch)) return "-"

  return new Date(cleanEpoch * 1000).toLocaleString()
}

export const getReadableTimeRange = (range) => {
  const normalized = normalizeTimeRange(range)
  const [start, end] = normalized.split('|')

  return {
    startReadable: epochToReadable(start),
    endReadable: epochToReadable(end)
  }
}

export const readableToEpoch = (readable) => {
  const date = new Date(readable)
  return Math.floor(date.getTime() / 1000)
}


const getDefaultRange = () => {
  const now = Math.floor(Date.now() / 1000)
  return `${now - 3600}|${now}`
}

export const isEpochFormat = (value) => {`
  const num = Number(value)`
  if (Number.isNaN(num)) return false
  return String(Math.floor(num)).length >= 10
}

const normalizeEpoch = (value) => {
  let epoch = Number(value)
  if (epoch > 100000000000) {
    epoch = Math.floor(epoch / 1000)
  }
  return epoch
}

export const normalizeTimeRange = (timeRangeString) => {

  if (!timeRangeString) {
    return getDefaultRange()
  }

  const parts = timeRangeString.split('|')
  if (parts.length !== 2) {
    return getDefaultRange()
  }

  const now = Math.floor(Date.now() / 1000)

  let [startValue, endValue] = parts

  let startEpoch
  let endEpoch

  if (isEpochFormat(startValue)) {
    startEpoch = normalizeEpoch(startValue)
  } else {
    const minutes = Number(startValue) || 60
    startEpoch = now - minutes * 60
  }

  if (isEpochFormat(endValue)) {
    endEpoch = normalizeEpoch(endValue)
  } else {
    const minutes = Number(endValue)
    endEpoch = minutes === 0 ? now : now - minutes * 60
  }

  if (startEpoch > endEpoch) {
    [startEpoch, endEpoch] = [endEpoch, startEpoch]
  }

  return `${startEpoch}|${endEpoch}`
}