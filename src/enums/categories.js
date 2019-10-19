const categories = [
  { id: 0, name: 'Not Specified', icon: 'location_on' },
  { id: 1, name: 'Private Bar', icon: 'local_bar' },
  { id: 2, name: 'Home Night Club', icon: 'local_bar' },
  { id: 3, name: 'Electrician', icon: 'flash_on' }, // or power
  { id: 4, name: 'Painter', icon: 'format_paint' },
  { id: 5, name: 'Plumber', icon: 'invert_colors' },
  { id: 6, name: 'Locksmith', icon: 'lock_open' },
  { id: 7, name: 'Man with a Van', icon: 'local_shipping' },
  { id: 8, name: 'Roofing constractor', icon: 'home' },
  { id: 9, name: 'Home Cinema', icon: 'movie_filter' },
  { id: 10, name: 'Private Parking', icon: 'local_parking' },
  { id: 11, name: 'Hair Care', icon: 'face' },
  { id: 12, name: 'Private Teacher', icon: 'school' },
  { id: 13, name: 'Home cafe', icon: 'local_cafe' },
  { id: 14, name: 'Home Resturant', icon: 'room_service' },
  { id: 15, name: 'Mechanicist', icon: 'directions_car' },
  { id: 17, name: 'Laundry', icon: 'local_laundry_service' },
  { id: 18, name: 'Pet care', icon: 'pets' },
  { id: 20, name: 'Designer', icon: 'brush' },
  { id: 21, name: 'Software Engineer', icon: 'laptop' },
  { id: 22, name: 'Lawyer', icon: 'gavel' },
  { id: 23, name: 'Babysitter', icon: 'child_care' },
  { id: 24, name: 'Photographer', icon: 'camera_enhance' },
  { id: 25, name: 'Old People care', icon: 'accessible' },
  { id: 26, name: 'Florist', icon: 'local_florist' },
  { id: 27, name: 'Printer', icon: 'local_printshop' }
].map(item => {
  item.icon = `baseline-${item.icon}-24px.svg`
  return item
})

export const getCategoryById = id =>
  categories.filter(c => c.id === Number(id))[0]

export default categories
