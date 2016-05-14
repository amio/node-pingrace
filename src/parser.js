export function parseLog (txt) {
  const segments = txt.split('\n\n')
  return {
    trips: segments[0].trim(),
    statics: segments[1].trim()
  }
}

/*
 * Raw format:
 * --- p1.hk2.vpnko.com ping statistics ---
 * 1 packets transmitted, 1 packets received, 0.0% packet loss
 * round-trip min/avg/max/stddev = 190.845/190.845/190.845/0.000 ms
 */
export function parseStatics (rawStatics) {
  const lines = rawStatics.split('\n')
  const [host] = lines[0].match(/\b[\w\d.]+/)
  const [total, received, lossRate] = lines[1].match(/[\d.%]+/g)
  const [min, avg, max, stddev] = (received === '0' ? [0, 0, 0, 0] : lines[2].match(/[\d.]+/g))
  return {
    host: host,
    total: total,
    received: received,
    lossRate: lossRate,
    min: parseFloat(min, 10),
    max: parseFloat(max, 10),
    avg: parseFloat(avg, 10),
    stddev: stddev
  }
}
