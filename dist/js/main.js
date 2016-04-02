var stateScope = '', lgaScope = '', coldchain = '', antenatal = '', malaria = '', family_planning = '', hiv = '', tb = '', ri = '', phcn = '',
    sectors = [],
    geoData = null, geoDataSettlement = null,
    dataLayer = null, buffered = null, bufferLayer = null, settlementLayer = null,
    markerGroup = null, settlementGroup = null,
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
    coldChainChk()

    stateScope1 = $('#stateScope').val()
    lgaScope1 = $('#lgaScope').val()

    var query = buildQuery(stateScope1, lgaScope1, typeList, coldchain, ri, hiv, tb, family_planning, antenatal, malaria, phcn)
    getData(query)
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




function buildQuery(stateScope, lgaScope, type, coldchain, ri, hiv, tb, family_planning, antenatal, malaria, phcn) {
  var needsAnd = false;
  query = 'http://ehealthafrica.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM health_facilities_4_copy';
  if (stateScope != null || lgaScope != null || typeList.length > 0 || coldchain != null || malaria != null || antenatal != null || hiv != null || tb != null || ri != null || family_planning != null || phcn != null){
    console.log("State Selecte:  ", stateScope)
    query = query.concat(' WHERE')
    if (stateScope.length > 0){
      query = query.concat(" state_name = '".concat(stateScope.concat("'")))
      needsAnd = true
    }

    if (lgaScope.length > 0){
      query = needsAnd  ? query.concat(" AND lga_name = '".concat(lgaScope.concat("'"))) :  query.concat(" lga_name = '".concat(lgaScope.concat("'")))
      needsAnd = true
    }

    if(coldchain.length > 0) {
      query = needsAnd  ? query.concat(" AND coldchain = '".concat(coldchain.concat("'"))) :  query.concat(" coldchain = '".concat(coldchain.concat("'")))
      needsAnd = true
    }

    if(malaria.length > 0) {
      query = needsAnd  ? query.concat(" AND malaria = '".concat(malaria.concat("'"))) :  query.concat(" malaria = '".concat(malaria.concat("'")))
      needsAnd = true
    }

    if(antenatal.length > 0) {
      query = needsAnd  ? query.concat(" AND antenatal = '".concat(antenatal.concat("'"))) :  query.concat(" antenatal = '".concat(antenatal.concat("'")))
      needsAnd = true
    }

    if(hiv.length > 0) {
      query = needsAnd  ? query.concat(" AND hiv = '".concat(hiv.concat("'"))) :  query.concat(" hiv = '".concat(hiv.concat("'")))
      needsAnd = true

      console.log("Hiv Query: ", query)
    }

    if(tb.length > 0) {
      query = needsAnd  ? query.concat(" AND sphcda_tb = '".concat(tb.concat("'"))) :  query.concat(" sphcda_tb = '".concat(tb.concat("'")))
      needsAnd = true

      console.log("TB Query: ", query)
    }

    if(ri.length > 0) {
      query = needsAnd  ? query.concat(" AND sphcda_ri_ = '".concat(ri.concat("'"))) :  query.concat(" sphcda_ri_ = '".concat(ri.concat("'")))
      needsAnd = true

      console.log("RI Query: ", query)
    }

    if(family_planning.length > 0) {
      query = needsAnd  ? query.concat(" AND family_planning = '".concat(family_planning.concat("'"))) :  query.concat(" family_planning = '".concat(family_planning.concat("'")))
      needsAnd = true

      console.log("Family Query: ", query)
    }

    if(phcn.length > 0) {
      query = needsAnd  ? query.concat(" AND phcn = '".concat(phcn.concat("'"))) :  query.concat(" phcn = '".concat(phcn.concat("'")))
      needsAnd = true

      console.log("PHCN Query: ", query)
    }

    if (typeList.length > 0){
      for(var i = 0; i < typeList.length; i++) {
        if (i == 0) {
            query = needsAnd ? query.concat(" AND type IN ( '" + typeList[i] + "')") : query.concat(" type IN ( '".concat(typeList[i].concat("')")));
        //console.log("Type Query Include:  ", query)
          }

        else
          query = query.concat(" ,'" + typeList[i] + "')").replace(")", "")
       // console.log("Type Query Include2:  ", query)
      }
    }



   // else query = 'http://ehealthafrica.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM health_facilities_4';
  }
  return query

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




function coldChainChk() {
  if(document.getElementById("ColdChain").checked)
    coldchain = 'Yes';
  else
    coldchain = ''

  if(document.getElementById("Malaria").checked)
    malaria = 'Yes';
  else
    malaria = ''

  if(document.getElementById("Family Planning").checked)
    family_planning = 'Yes';
  else
    family_planning = ''

  if(document.getElementById("Antenatal").checked)
     antenatal = 'Yes';
  else
    antenatal = ''

  if(document.getElementById("HIV").checked)
     hiv = 'Yes';
  else
    hiv = ''

  if(document.getElementById("TB").checked)
     tb = 'Yes';
  else
    tb = ''

  if(document.getElementById("RI").checked)
     ri = 'Yes';
  else
    ri = ''

   if(document.getElementById("PHCN").checked)
     phcn = 'Yes';
  else
    phcn = ''

  console.log("ID = ", coldchain +"  "+ malaria +"  "+ antenatal +"  "+ tb +"  "+ ri)
}


function addDataToMap(geoData) {
    // adjustLayerbyZoom(map.getZoom())
    //remove all layers first

    if (dataLayer != null)
        map.removeLayer(dataLayer)

    if (markerGroup != null)
        map.removeLayer(markerGroup)

    if (bufferLayer != null)
        map.removeLayer(bufferLayer)
      //bufferLayer.remove();


    var _radius = 8
    var _outColor = "#fff"
    var _weight = 2
    var _opacity = 2
    var _fillOpacity = 2.0

    var allColours = {
        'Primary': {
            radius: _radius,
            fillColor: "#0000A0",
            color: _outColor,
            weight: _weight,
            opacity: _opacity,
            fillOpacity: _fillOpacity
        },
        'Secondary': {
            radius: _radius,
            fillColor: "#008000",
            color: _outColor,
            weight: _weight,
            opacity: _opacity,
            fillOpacity: _fillOpacity
        },
        'Tertiary': {
            radius: _radius,
            fillColor: "#00ffff",
            color: _outColor,
            weight: _weight,
            opacity: _opacity,
            fillOpacity: _fillOpacity
        },
        'Others': {
            radius: _radius,
            fillColor: "#ff0000",
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
            var marker = L.circleMarker(latlng, allColours[feature.properties.type])
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
    var kmValue = document.getElementById("amount").value;
    console.log("Buffer Value: ", kmValue);
    var km = kmValue.split('  ');
    var bufferValue = km[0];
    console.log("Buffer Value: ", bufferValue);
    var data = geoData;
    var unit = 'kilometers';
    buffered = turf.buffer(data, bufferValue, unit);
    buffered.properties = {
        "fillColor": "#f0f1ff",
        "stroke": false,
       // "stroke-width": 0,
        "opacity": 0.1
    };


    bufferLayer = L.geoJson(buffered, {});
    bufferLayer.addTo(map)



}

hideLoader()

function buildPopupContent(feature) {
    var subcontent = ''
    var propertyNames = ['primary_na','state_name','lga_name', 'type', 'coldchain', 'malaria', 'antenatal']
    for (var i = 0; i < propertyNames.length; i++) {
        subcontent = subcontent.concat('<p><strong>' + normalizeName(propertyNames[i]) + ': </strong>' + feature.properties[propertyNames[i]] + '</p>')

    }
    return subcontent;
}


function getSettlementData(queryUrl) {
    showLoader()
    $.post(queryUrl, function(data) {
      hideLoader()
      addSettlementToMap(data)
    }).fail(function () {
        console.log("error!!!")
    });
}

function addSettlementToMap(geoDataSettlement) {

    var markerOptions = L.icon({
        iconUrl: "resources/iconMarker.png",
        iconSize: [30, 30],
        iconAnchor: [25, 25]
    });

    if(settlementLayer != null)
      map.removeLayer(settlementLayer)

    if(settlementGroup != null)
      map.removeLayer(settlementGroup)

      settlementGroup = L.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            removeOutsideVisibleBounds: true
      })

      settlementLayer = L.geoJson(geoDataSettlement, {
          pointToLayer: function (feature, layer) {
            var settlementMarker = L.marker(layer, {icon: markerOptions})
            return settlementMarker
          },
        onEachFeature: function (feature, layer) {
          if(feature.properties && feature.properties.cartodb_id) {
            layer.on('mouseover', function(e) {
              displaySettlement(feature)

              //this.openPopup();
            })
          }
        }
      })

      map.addLayer(settlementLayer);
}

function querySettlement(lgaScope) {
    querySet = 'http://ehealthafrica.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM kanopopnedited';
    //querySet = (lgaScope.length > 0) ? querySet.concat(' WHERE ') : querySet;
    if(lgaScope.length > 0) {
        querySet = querySet.concat(' WHERE ');
        querySet = querySet.concat(" lga = '".concat(lgaScope.concat("'")));
    }
  return querySet

}

function callSettlement() {
    lgaScope2 = $('#lgaScope').val()
    var querySet = querySettlement(lgaScope2);
  console.log("Settlement Query:  ", querySet)
    getSettlementData(querySet);
}

function displaySettlement(feature) {
    //console.log('displaying info..')
    var infoSettlement = buildPopupSettlement(feature)
        //console.log("info", infoContent)
    $('#infoSettlement').html(infoSettlement)
}

function buildPopupSettlement(feature) {
    var subcontent = ''
    var propertyNames = ['settleme_1', 'total']
    for (var i = 0; i < propertyNames.length; i++) {
        subcontent = subcontent.concat('<p><strong>' + normalizeName(propertyNames[i]) + ': </strong>' + feature.properties[propertyNames[i]] + '</p>')

    }
    return subcontent;
}
