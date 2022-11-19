const map = new BMap.Map('map')
// 途径的点
const routes = []
// 路径点
const pathPoints = []

function init () {
  var point = new BMap.Point(120.300835, 31.463311)
  map.centerAndZoom(point, 18)
}

async function selectLocation () {
  const location = map.getCenter()
  let distance = 0
  let text = '起点'
  let plan = null

  if (routes.length > 0) {
    let result = null
    try {
      result = await searchWay(routes[routes.length - 1].location, location)
    } catch (e) {
      window.alert('无法规划路线')
      return
    }
    pathPoints.push(...result.path)
    plan = result.plan
    text = `${plan.getDistance()}， ${plan.getDuration()}`
  }

  routes.push({ location, distance, text, plan })
  setMarker(location)
  updateUi()
}

// 设置标记点
function setMarker (point) {
  const imageSize = new BMap.Size(12, 12)
  const icon = new BMap.Icon('../assets/location.png', imageSize, {
    imageSize,
    anchor: new BMap.Size(8, 8)
  })
  const marker = new BMap.Marker(point, { icon, isTop: true })
  map.addOverlay(marker)
}

function searchWay (start, end) {
  return new Promise((resolve, reject) => {
    const driving = new BMap.RidingRoute(map, {
      renderOptions: { map: map }
    })

    driving.setSearchCompleteCallback(() => {
      try {
        const result = driving.getResults()
        let minPlan = null
        let minDistance = Number.MAX_VALUE
        for (let i = 0, count = result.getNumPlans(); i < count; i++) {
          const plan = result.getPlan(i)
          const distance = parseInt(plan.getDuration())
          if (minDistance > distance) {
            minPlan = plan
            minDistance = distance
          }
        }

        const paths = []
        for (let i = 0, count = minPlan.getNumRoutes(); i < count; i++) {
          paths.push(...minPlan.getRoute(i).getPath())
        }
        resolve({
          plan: minPlan,
          path: paths
        })
      } catch (e) {
        reject(new Error(''))
      }
    })

    driving.search(start, end)
  })
}

function updateUi () {
  const ul = $('#plan-show')
  ul.innerHTML = ''
  for (const { text } of routes) {
    ul.innerHTML += `<li class="mui-table-view-cell">${text}</li>`
  }
}

// 设置路线点
function setWaypoint () {}

function loadEdit () {}

function saveEdit () {}

function exitEdit () {
  mui.confirm('是否退出编辑', '警告', ['是', '否'], function ({ index }) {
    if (index === 0) {
      window.location.href = './bicycle.html'
    }
  })
}
export default function () {
  init()
  $('#select-location').onclick = selectLocation

  $('#load-edit').onclick = loadEdit
  $('#save-edit').onclick = saveEdit
  $('#exit-edit').onclick = exitEdit
}
