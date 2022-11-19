const map = new BMap.Map('map')
// 途径的点
const routes = []
// 路径点
const pathPoints = []

function loadRoute () {
  // const list = plus.storage.getAllKeys().map(t => ({ value: t, text: t }))
  // const picker = new mui.PopPicker()
  // picker.setData(list)
  // picker.show(function (item) {
  //   console.log(item)
  // })
}

function init () {
  const point = new BMap.Point(120.300835, 31.463311)
  map.centerAndZoom(point, 18)
}

$('#map').addEventListener(
  'pointermove',
  function () {
    console.log('aasdfas')
  },
  true
)
export default function () {
  init()
  loadRoute()
}
