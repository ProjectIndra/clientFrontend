export const epochToReadable = (epoch) => {

  const cleanEpoch = Number(epoch) // convert safely

  const date = new Date(cleanEpoch)

  return date.toLocaleString()
}
