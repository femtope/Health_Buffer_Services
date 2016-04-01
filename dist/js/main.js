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

/*function toggleClass(id) {
    console.log("Selected", id)
    if (id != null) {
        if ($('#'.concat(id)).hasClass('btn-primary')) {
            $('#'.concat(id)).removeClass('btn-primary')
            $('#'.concat(id)).addClass('btn-'.concat(id))
        } else if ($('#'.concat(id)).hasClass('btn-'.concat(id))) {
            $('#'.concat(id)).removeClass('btn-'.concat(id))
            $('#'.concat(id)).addClass('btn-primary')
        }
    }
}*/

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
function addDataToMap(geoData) {
    // adjustLayerbyZoom(map.getZoom())
    //remove all layers first


    if (dataLayer != null)
        map.removeLayer(dataLayer)

    if (markerGroup != null)
        map.removeLayer(markerGroup)


    var _radius = 10
    var _outColor = "#fff"
    var _weight = 1
    var _opacity = 1
    var _fillOpacity = 0.5

    var allColours = {
        'Nutrition': {
            radius: _radius,
            fillColor: "#ff7800",
            color: _outColor,
            weight: _weight,
            opacity: _opacity,
            fillOpacity: _fillOpacity
        },
        'Agriculture': {
            radius: _radius,
            fillColor: "#33cc33",
            color: _outColor,
            weight: _weight,
            opacity: _opacity,
            fillOpacity: _fillOpacity
        },
        'Health': {
            radius: _radius,
            fillColor: "#0099cc",
            color: _outColor,
            weight: _weight,
            opacity: _opacity,
            fillOpacity: _fillOpacity
        },
        'Education': {
            radius: _radius,
            fillColor: "#ffff66",
            color: _outColor,
            weight: _weight,
            opacity: _opacity,
            fillOpacity: _fillOpacity
        },
        'Research': {
            radius: _radius,
            fillColor: "#ee82ee",
            color: _outColor,
            weight: _weight,
            opacity: _opacity,
            fillOpacity: _fillOpacity
        },
        'Finance': {
            radius: _radius,
            fillColor: "#cc3300",
            color: _outColor,
            weight: _weight,
            opacity: _opacity,
            fillOpacity: _fillOpacity
        }
    }


    $('#projectCount').text(geoData.features.length)

    markerGroup = L.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            removeOutsideVisibleBounds: true
        })
        //console.log("geoData", geoData)
    dataLayer = L.geoJson(geoData, {
        pointToLayer: function (feature, latlng) {
            var marker = L.circleMarker(latlng, allColours[feature.properties.sector])
                //markerGroup.addLayer(marker);
            return marker
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.cartodb_id) {
                //layer.bindPopup(buildPopupContent(feature));
                layer.on('click', function () {
                    displayInfo(feature)
                })
            }

        }

    })

    markerGroup.addLayer(dataLayer);
    map.addLayer(markerGroup);

}


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

function buildPopupContent(feature) {
    var subcontent = ''
    var propertyNames = ['sector', 'state', 'scope_of_work', 'duration', 'bmgf_point', 'grantee_organisation', 'beneficiary', 'title_of_grant', 'nature_of_work', 'focal_state', 'organisation']
    for (var i = 0; i < propertyNames.length; i++) {
        subcontent = subcontent.concat('<p><strong>' + normalizeName(propertyNames[i]) + ': </strong>' + feature.properties[propertyNames[i]] + '</p>')

    }
    return subcontent;
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
