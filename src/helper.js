
// convert epoch to readable time
export const epochToReadable = (epoch) => {
  const date = new Date(epoch * 1000)
  return date.toLocaleString()
}
