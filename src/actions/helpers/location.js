const iplocation = require('iplocation').default

export const getMyIp = () => {
  return window.ip
}

export const fetchMyGeo = async () => {
  console.log(window.ip)
  return new Promise((resolve, reject) => {
    iplocation(window.ip)
      .then(res => {
        console.log(res)
        window.geo = res
        resolve(res)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}
;(() => {
  fetchMyGeo()
})()
/* res:

        {
            as: 'AS11286 KeyBank National Association',
            city: 'Cleveland',
            country: 'United States',
            countryCode: 'US',
            isp: 'KeyBank National Association',
            lat: 41.4875,
            lon: -81.6724,
            org: 'KeyBank National Association',
            query: '156.77.54.32',
            region: 'OH',
            regionName: 'Ohio',
            status: 'success',
            timezone: 'America/New_York',
            zip: '44115'
        }

    */
