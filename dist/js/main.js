var stateScope = '', lgaScope = '',
    sectors = [],
    geoData = null,
    dataLayer = null,
    markerGroup = null,
    stateData = null,
    stateLayer = null, lgaLayer = null,
    lgaLabels = [],
    showLga = false,
    typeList = [], serviceList = [], amenityList = []

var map = L.map('map', {
    center: [10, 8],
    zoom: 7,
    zoomControl: false,
    minZoom: 6

});


map.fitBounds([
    [2.668432, 4.277144], [14.680073, 13.892007]
])

/*map.on('zoomend', function () {
    adjustLayerbyZoom(map.getZoom())
})*/

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(map);

new L.Control.Zoom({
    position: 'topright'
}).addTo(map);

L.control.scale({
    position: 'bottomright',
    maxWidth: 150,
    metric: true,
    updateWhenIdle: true
}).addTo(map);


function triggerUiUpdate() {
    stateScope = $('#stateScope').val()
    lgaScope = $('#lgaScope').val()
   // var query = buildQuery(scope, sectors)
    //getData(query)
}


function lgaShow() {
    stateSelect1 = $('#stateScope').val();
    show = document.getElementById("lgaScope");
    if(stateSelect1 == "Kano") {
    show.style.visibility="visible"
  }
  else{
    show.style.visibility="hidden"
  }
}



function buildSelectedSectors(sector) {
    var idx = sectors.indexOf(sector)
    if (idx > -1)
        sectors.splice(idx, 1)
    else if (idx == -1) {
        if (sector != null)
            sectors.push(sector)
    }
    toggleClass(sector)
    triggerUiUpdate()
}



function buildQuery(stateSelect, lgaSelect, type, service, amenity) {
  var needsAnd = false;
  query = 'http://ehealthafrica.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM conflict_and_security_data';
  if (stateSelect.length > 0 || lgaSelect.length > 0 || type.length > 0 || service.length > 0 || amenity > 0){
    query = query.concat(' WHERE')
    if (conflictScenario.length > 0){
      query = query.concat(" conflict_scenario = '".concat(conflictScenario.concat("'")))
      needsAnd = true
    }
    if (monthSelect.length > 0){
      query = needsAnd  ? query.concat(" AND event_month = '".concat(monthSelect.concat("'"))) :  query.concat(" event_month = '".concat(monthSelect.concat("'")))
      needsAnd = true
    }

    if (yearRange.length > 1){
      query = needsAnd  ? query.concat(" AND event_year BETWEEN ".concat(yearRange[0]).concat(" AND ".concat(yearRange[1]))) : query = query.concat(" event_year BETWEEN ".concat(yearRange[0]).concat(" AND ".concat(yearRange[1])))
    }

    else query = 'http://ehealthafrica.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM conflict_and_security_data';
  }
  return query

}



function buildQuery(_scope, _sectors) {
    //returns geojson
    var containsAnd = false;
    query = 'http://ehealthafrica.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM health_facilities_4';
    query = (_scope.length > 0 || _sectors.length > 0) ? query.concat(' WHERE') : query;
    if (_scope.length > 0) {
        query = (_sectors.length > 0) ? query.concat(" scope_of_work = '".concat(scope.concat("' AND"))) : query.concat(" scope_of_work = '".concat(scope.concat("'")))
    }
    if (_sectors.length > 0) {
        for (var i = 0; i < _sectors.length; i++) {
            if (i == 0)
                query = query.concat(" sector='" + _sectors[i] + "'");
            else query = query.concat(" OR sector='" + _sectors[i] + "'")
        }
    }
    //console.log("Query ", query)
    return query;
}


//TODO: fix the issue of lga layer not reoving after data filtering



function addAdminLayersToMap(layers) {

    var layerStyles = {
            'state': {
                "clickable": true,
                "color": '#B81609',
                "fillColor": '#FFFFFF',
                "weight": 2.0,
                "opacity": 0.7,
                "fillOpacity": 0.1
            },
            'lga': {
                "clickable": true,
                "color": '#e2095c',
                "fillColor": '#FFFFFF',
                "weight": 2.5,
                "opacity": 0.7,
                "fillOpacity": 0.1
            }
        }
    stateSelect = $('#stateScope').val()
    lgaSelect = $('#lgaScope').val()
    if(stateLayer != null)
      map.removeLayer(stateLayer)

    stateLayer = L.geoJson(layers['state'], {
        filter: function(feature) {
          return feature.properties.StateName === stateSelect
        },
        style: layerStyles['state'],
    }).addTo(map)
    map.fitBounds(stateLayer.getBounds())

    // Adding LGA to Map
    if(lgaLayer != null)
      map.removeLayer(lgaLayer)
    lgaLayer = L.geoJson(layers['lga'], {
        filter: function(feature) {
          return feature.properties.LGAName === lgaSelect
      },
      style: layerStyles['lga'],
      }).addTo(map)
    map.fitBounds(lgaLayer.getBounds())
}




function displayInfo(feature) {
    //console.log('displaying info..')
    var infoContent = buildPopupContent(feature)
        //console.log("info", infoContent)
    $('#infoContent').html(infoContent)
}

function normalizeName(source) {
    source = source.replace("_", " ").replace('of_', ' of ')
    source = source.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return source
}



function showLoader() {
    $('.fa-spinner').addClass('fa-spin')
    $('.fa-spinner').show()
}

function hideLoader() {
    $('.fa-spinner').removeClass('fa-spin')
    $('.fa-spinner').hide()
}


function getData(queryUrl) {
    showLoader()
    $.post(queryUrl, function (data) {
        hideLoader()
        addDataToMap(data)
    }).fail(function () {
        console.log("error!")
    });
}

function getAdminLayers() {
    showLoader()
    var adminLayers = {}
    $.get('resources/state_boundary.geojson', function (stateData) {
        //add admin layers to map
        adminLayers['state'] = JSON.parse(stateData)
       addAdminLayersToMap(adminLayers)
    }).fail(function () {
        logError(null) //TODO: Fix this terrible code
    });
   $.get('resources/lga_boundary.geojson', function (lgaData) {
            adminLayers['lga'] = JSON.parse(lgaData)
                //return the layers
             addAdminLayersToMap(adminLayers)
        }).fail(function () {
            logError(null)
        });
}

function logError(error) {
    console.log("error!")
}


function typeCheckBox(type) {
  var idType = typeList.indexOf(type)
  if (idType > -1)
    typeList.splice(idType, 1)
  else if(idType == -1){
    if (idType != null)
      typeList.push(type)
  }
  console.log(type)
  for(i = 0; i <typeList.length; i++){
    console.log("Array List:  ", typeList[i])
  }

}

function serviceCheckBox(service) {
    var idService = serviceList.indexOf(service)
  if (idService > -1)
    serviceList.splice(idService, 1)
  else if(idService == -1){
    if (idService != null)
      serviceList.push(service)
  }
  console.log(service)
  for(i = 0; i <serviceList.length; i++){
    console.log("Array List:  ", serviceList[i])
  }

}

function amenityCheckBox(amenity) {
    var idAmenity = amenityList.indexOf(amenity)
  if (idAmenity > -1)
    amenityList.splice(idAmenity, 1)
  else if(idAmenity == -1){
    if (idAmenity != null)
      amenityList.push(amenity)
  }
  console.log(amenity)
  for(i = 0; i <amenityList.length; i++){
    console.log("Array List:  ", amenityList[i])
  }

}


getAdminLayers()
triggerUiUpdate()
