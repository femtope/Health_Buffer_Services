var lowerlimit, upperlimit;
$(function() {
$( "#slider-range" ).slider({
range: "min",
min: 0,
max: 5,
values: 0,
slide: function( event, ui ) {
  $( "#amount" ).val( ui.value + "  Km");
  triggerUiUpdate()
}
});
$( "#amount" ).val($( "#slider-range" ).slider( "values" ) + "  Km" );
});

var a, b, c, yr, yrs = [], month, year, conType;

function myYear()
{
    yr = document.getElementById("amount").value;
    yrs = yr.split('  -  ');
  console.log(yrs)
    return yrs
}


function myMonth()
{
    a = document.getElementById("monthScope");
    month = a.options[a.selectedIndex].text;
    console.log(month);
}


function myConflict()
{
    b = document.getElementById("categoryScope");
    conType = b.options[b.selectedIndex].text;
    console.log(conType);
    return;
}

function myExecute()
{
    myYear();
    console.log(month+"===="+conType+"======"+year);
   // console.log(conType);

}
