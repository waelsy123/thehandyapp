const items = [
  { id: 5000, name: '5 km' },
  { id: 10000, name: '10 km' },
  { id: 20000, name: '20 km' },
  { id: 50000, name: '50 km' },
  { id: 100000, name: '100 km' },
  { id: 1000000, name: '1000 km' },
]

export const getRadiusById = id => items.filter(c => c.id === Number(id))[0]

export default items
