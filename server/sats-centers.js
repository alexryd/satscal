import SatsApi from './sats-api'

const CENTERS = new Map()

const SatsCenters = {
  load() {
    const api = new SatsApi()

    api.getCenters()
      .then((result) => {
        let count = 0

        for (const region of result.regions) {
          for (const center of region.centers) {
            CENTERS.set(center.id, {
              name: center.name
            })
            count++
          }
        }

        console.log(`${count} SATS centers loaded`)
      })
      .catch((error) => {
        console.error(`Error loading SATS centers: ${error}`)
      })
  },

  get(id) {
    return CENTERS.get(id) || null
  }
}

export default SatsCenters
