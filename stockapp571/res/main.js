 $(document).ready(function(){
      
    window.fbAsyncInit = function() {
    FB.init({
      appId      : '1280616651955391',
      xfbml      : true,
      version    : 'v2.5'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
     
    var Symbol = "NoSymbol"; 
    
     $(".facebook").click(function(e){
         var facebookSym  = $('#table tr:eq(1) td:eq(1)').text();
         $.get( 
            "http://stockapp571.appspot.com/php",
             { Symbol:facebookSym },
             function(data) {
                 var name = "";
                 var amount = "";
                 var change = "";
                 var symbol = facebookSym;
                 var changePercent = "";
                 $.each($.parseJSON(data),function(k,v)
                 {
                    switch(k)
                    {
                        case 'Name':
                              name = v;     
                              break;
                        case 'LastPrice':
                              amount = "$" +v;
                              break;
                        case 'Change':
                              change = v.toFixed(2); 
                              break;
                        case 'ChangePercent':
                              changePercent = v.toFixed(2) + "%";
                              break;    
                    }
                 }); 
            var picLink= "http://chart.finance.yahoo.com/t?s=" + facebookSym +"&lang=en-US&width=400&height=300";
             
            FB.ui({
                     method: 'feed',
                     link: 'http://dev.markitondemand.com/MODApis/',
                     name: 'Current Stock Price of ' + name + ' is ' + amount,
                     caption: 'LAST TRADE PRICE: ' + amount + ', ' + 'CHANGE:' + change+'('+changePercent+')', 
                     description : 'Stock Information of '+name+' ('+facebookSym+')',
                     picture : picLink
            }, function(response){
                if(response && response.post_id)
                {
                    alert("Posted successfully");    
                }
                else{
                    alert("Not Posted");
                }
            });  
        });
                 
    });  
     
   //On Window load disable next button
   $("#nextButton").attr('disabled','disabled'); 
     
    //On Window load clear text field
   $('#Stock_Name').val('');
     
    //On Window load reset autorefresh button 
     $('#autoRefresh').removeAttr("checked"); // Reset state
     
     if(localStorage.favSym)
      {
            var symsJSONString = localStorage.favSym;
            var fav = $.get( 
                "http://stockapp571.appspot.com/php?callback=?",
                { favSymbol:symsJSONString },
                function(data) {
                },"jsonp"
            );

             fav.complete(function(data){
                    var result = data.responseText;
                    $.each($.parseJSON(result), function (index,value){
                        drawFavTable($.parseJSON(value));
                    });
             });
      }
     
    
    function loadFavList()
    {
      if(localStorage.favSym)
      {
            var symString = localStorage.favSym;
            var ref = $.get( 
                "http://stockapp571.appspot.com/php?callback=?",
                { favSymbol:symString },
                function(data) {
                },"jsonp"
            );

             ref.complete(function(data){
                    var res = data.responseText;
                    $(".favTableRow").remove(); //Clear old data before adding new row.
                    $.each($.parseJSON(res), function (index,value){
                        drawFavTable($.parseJSON(value));
                    });
             });
      }
         
    }
    
    //Autorefresh Feature.
    var x; 
    $(function(){
        $("#autoRefresh").change(function (){
            var toggle = $(this);
            if (toggle.is(':checked')) 
            {
                x=setInterval(function(){ loadFavList() },5000);
            }
            else
            {
                clearInterval(x);       
            }
        })  
    })
    
    //Refresh Feature
     $("#refresh").click(function(e){
        loadFavList();
     });
     
     $(function() {
     
     function log( message ) {
      $( "<div>" ).text( message ).prependTo( "#log" );
      $( "#log" ).scrollTop( 0 );     
    }
    var sendSymbol;
   
    $( "#Stock_Name" ).autocomplete({
        source: function( request, response ) {
        $.ajax({
          url: "http://stockapp571.appspot.com/php",
          dataType: "json",
          data: {
            SearchSymbol: $('#Stock_Name').val()
          },
          success: function( data ) {
            if(data.length === 0)
            {
                Symbol = "NoSymbol";          
            }
            else
            {
               response($.map(data, function(item) {
               return item.Symbol + " - " + item.Name + " ( " + item.Exchange + " ) ";
            })); 
            }  
          }
        });
      },
      minLength: 1,
      select: function( event, ui ) {
         var res= ui.item.label;
         var space = res.indexOf("-");
         space = space-1;  
         sendSymbol = res.slice(0,space);
         Symbol = sendSymbol;
         $('#Stock_Name').val(sendSymbol);  
         return false;
      },
      open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function( event, ui) {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
      }
    });          
});
     
     $('#nextButton').attr('title',"Display Stock Information");
     $('#refresh').attr('title',"Refresh Stock Values");
     
     $("#clear").click(function(e){
         $("#Stock_Name").val="";
         $('#himica').carousel(0);
         $("#nextButton").attr('disabled','disabled'); 
         document.getElementById("errorMessage").innerHTML="";
         Symbol = "dummy";
     });
     
        $("#getQuote").click(function (e) {
            $("#table").empty();
            $("#tab3").empty();
            var selectedText = $("#Stock_Name").find("option:selected").text();
            var selectedValue = $("#Stock_Name").val();
            if( Symbol === "NoSymbol")
            {
               document.getElementById("errorMessage").innerHTML = "Select a valid entry";
               e.preventDefault();    
            }
            else if( Symbol == "dummy")
            {
                document.getElementById("Stock_Name").required = true;    
            }
            else{ 
              e.preventDefault();   
                $.get( 
                  "http://stockapp571.appspot.com/php",
                  { Symbol:Symbol },
                  function(data) {
                    $("#nextButton").removeAttr('disabled'); 
                    if(localStorage.favSym)
                    {
                        var lclSt = localStorage.favSym;
                        var lclString = $.parseJSON(lclSt);
                        var indx = lclString.indexOf(Symbol); 
                        if(indx > -1)
                        {
                            $(".favIcon").attr('src',"http://www-scf.usc.edu/~nalwad/hw4/images/yellow_star.png");    
                        }
                        else
                        {
                            $(".favIcon").attr('src',"http://www-scf.usc.edu/~nalwad/hw4/images/white_star.png");
                        }      
                    }
                    else
                    {
                        $(".favIcon").attr('src',"http://www-scf.usc.edu/~nalwad/hw4/images/white_star.png");    
                    }
                    drawTable($.parseJSON(data));         
                  }    
               );      
               var link= "http://chart.finance.yahoo.com/t?s=" + Symbol +"&lang=en-US&width=400&height=300";
               $("#iFra").attr("src",link);  
                
                // Populating chart  
                        
               var dfd  =$.get( 
                  "http://stockapp571.appspot.com/php?callback=?",
                  { ChartSymbol:Symbol },
                  function(data) {
                  },"jsonp"    
               )
                dfd.complete(function(data){
                   console.log($.parseJSON(data.responseText));
                   populateHistoricalChart($.parseJSON(data.responseText),Symbol);      
                });

                
                //Populating News feed.
                
               var newsDfd = $.get( 
                  "http://stockapp571.appspot.com/php",
                  { NewsSymbol:Symbol },
                  function(data) {
                  },"jsonp"    
               )
               newsDfd.complete(function(data){
                   console.log($.parseJSON(data.responseText));
                   populateNewsFeed($.parseJSON(data.responseText),Symbol);      
                });           
            }
        });
     
     function populateNewsFeed(data,selectedSym)
     {
        if(data)
        {
            var length=data.length;
            var newsFeedLength=data.d.results.length;  
            for(i=0;i<newsFeedLength;i++)
            {
                var row = $("<tr />");
                $("#tab3").append(row);
                 var uRL=data.d.results[i].Url;
                 var title=data.d.results[i].Title;
                 var source=data.d.results[i].Source;
                 var date=data.d.results[i].Date;
                 var description=data.d.results[i].Description;
                 var fym = selectedSym;
                 var regex = new RegExp(fym,'g');
                 description = description.replace(regex,fym.bold());
                 row.append($("<div class='panel panel-default' id='news'>" + "<BR>"
                 + "<a href="+uRL+"target='_blank'>"+title + "<BR>" + "<BR>" +"</a>"
                 + description + "<BR>" + "<BR>"
                 + "<B> Publisher : "+ source + "</B>" + "</BR>" +"<BR>"
                 + "<B> Date : "+ moment(date).format('D MMMM YYYY, HH:mm:ss') + "</B>" + "</BR>"+ "</div>"+"<BR>"));
            }
        }
     }
     
     function populateHistoricalChart(data,chartSelectedSymbol)
     {
        var elements = data.Elements[0].DataSeries.close.values;
        var dates = data.Dates;

        var newData = [];

        for(i=0; i<dates.length; i++)
        {
            var dat = new Date(dates[i]);
            var UtcDate = Date.UTC(dat.getFullYear(),dat.getMonth(),dat.getDate());
            var coOr = [UtcDate, elements[i]];
            newData.push(coOr);
        }
         
        // Create the chart
        $("#chartsContainer").highcharts('StockChart', {

            rangeSelector : {
                    buttons : [{
                        type : 'week',
                        count : 1,
                        text : '1w'
                    }, {
                        type : 'month',
                        count : 1,
                        text : '1m'
                    },{
                        type : 'month',
                        count : 3,
                        text : '3m'
                    },
                    {
                        type : 'month',
                        count : 6,
                        text : '6m'
                    },{
                        type : 'ytd',
                        count : 1,
                        text : 'YTD'
                    },{
                        type : 'year',
                        count : 1,
                        text : '1y'
                    },{
                        type : 'all',
                        count : 1,
                        text : 'All'
                    }],
                    selected : 0,
                    inputEnabled : false
                },

                title : {
                    text : chartSelectedSymbol + ' Stock Price'
                },
            
                yAxis: [{
                    title: {
                        text: 'Stock Value'
                    },
                    min:0,
                    tickInterval: 25
                }],

                series : [{
                    name : chartSelectedSymbol,
                    type : 'area',
                    yAxis: 0,
                    threshold: null,
                    data : newData,
                    tooltip: {
                        valueDecimals: 2,
                        valuePrefix: '$'
                    },
                    fillColor : {
                        linearGradient : {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops : [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    }
                }]
            });

     }
          
     function drawTable(result) {
         var change = ""; 
         var changeYTD = ""; 
         var flag = false;
        $.each(result,function(key,value)
        {
            switch(key)
            {
                case 'Status':
                      if ( value ==='Failure|APP_SPECIFIC_ERROR')
                      {
                          document.getElementById("errorMessage").innerHTML = "Not Stock Information available"; 
                          $("#nextButton").attr('disabled','disabled');  
                          flag = true;
                          $('#himica').carousel(0); 
                      }
                      else
                      {
                          $('#himica').carousel(1);      
                      }
                      break;        
                case 'Name':
                      var row = $("<tr />")
                      $("#table").append(row);
                      row.append($("<td><B>" + "Name" + "</B></td>"));   
                      row.append($("<td>" + value + "</td>"));
                      break;
                case 'Symbol':
                      var row = $("<tr />")
                      $("#table").append(row);
                      row.append($("<td><B>" + "Symbol" + "</B></td>"));   
                      row.append($("<td>" + value + "</td>"));
                      break;
                case 'LastPrice':
                      var row = $("<tr />")
                      $("#table").append(row);
                      row.append($("<td><B>" + "Last Price" + "</B></td>"));   
                      row.append($("<td>" + "$ " +value + "</td>"));
                      break;
                case 'Change':
                       change = value.toFixed(2); 
                       break;
                case 'ChangePercent':
                      var row = $("<tr />")
                      $("#table").append(row);
                      row.append($("<td><B>" + "Change (Change Percent)" + "</B></td>"));
                      if( change < 0 || value < 0)
                      {
                         row.append($("<td style='color:red;'>" + change + " ( " + value.toFixed(2) + "%" + " )" + "<img src='http://cs-server.usc.edu:45678/hw/hw8/images/down.png'>" + "</td>"));      
                      }
                      else if( change > 0 || value > 0)
                      {
                         row.append($("<td style='color:green;'>" + change + " ( " + value.toFixed(2) + "%" + " )" + "<img src='http://cs-server.usc.edu:45678/hw/hw8/images/up.png'>" + "</td>"));      
                      }
                      else
                      {
                        row.append($("<td>" + change + " ( " + value.toFixed(2) + "%" + " )" + "</td>"));        
                      }
                      break;
                case 'Timestamp':
                      var row = $("<tr />")
                      $("#table").append(row);
                      row.append($("<td><B>" + "Time and Date" + "</B></td>"));   
                      row.append($("<td>" + moment(value).format('D MMMM YYYY, h:mm:ss a') + "</td>"));
                      break;  
                case 'MarketCap':
                      var row = $("<tr />")
                      $("#table").append(row);
                      row.append($("<td><B>" + "Market Cap" + "</B></td>"));
                      var marValue = (value/1000000000);
                      var marUpdatedValueMi = (marValue*1000);
                      if ( marUpdatedValueMi < 10 )
                      {
                         row.append($("<td>" + marUpdatedValueMi.toFixed(2) + " Million" + "</td>"));     
                      }
                      else
                      {
                         row.append($("<td>" + marValue.toFixed(2) + " Billion" + "</td>"));
                      }   
                      break;
                 case 'Volume':
                      var row = $("<tr />")
                      $("#table").append(row);
                      row.append($("<td><B>" + "Volume" + "</B></td>"));   
                      row.append($("<td>" + value + "</td>"));
                      break;
                case 'ChangeYTD':
                      changeYTD = value.toFixed(2);
                      break;
                case 'ChangePercentYTD':
                      var row = $("<tr />")
                      $("#table").append(row);
                      row.append($("<td><B>" + "Change YTD (Change Percent YTD)" + "</B></td>"));   
                      if( changeYTD < 0 || value < 0)
                      {
                         row.append($("<td style='color:red;'>" + changeYTD + " ( " + value.toFixed(2) + "%" + " )" + "<img src='http://cs-server.usc.edu:45678/hw/hw8/images/down.png'>" + "</td>"));      
                      }
                      else if( changeYTD > 0 || value > 0)
                      {
                         row.append($("<td style='color:green;'>" + changeYTD + " ( " + value.toFixed(2) + "%" + " )" + "<img src='http://cs-server.usc.edu:45678/hw/hw8/images/up.png'>" + "</td>"));      
                      }
                      else
                      {
                        row.append($("<td>" + changeYTD + " ( " + value.toFixed(2) + "%" + " )" + "</td>"));        
                      }
                      break; 
                 case 'High':
                      var row = $("<tr />")
                      $("#table").append(row);
                      row.append($("<td><B>" + "High Price" + "</B></td>"));   
                      row.append($("<td>" + "$ " +value + "</td>"));
                      break;      
                 case 'Low':
                      var row = $("<tr />")
                      $("#table").append(row);
                      row.append($("<td><B>" + "Low Price" + "</B></td>"));   
                      row.append($("<td>" + "$ " +value + "</td>"));
                      break;  
                 case 'Open':
                      var row = $("<tr />")
                      $("#table").append(row);
                      row.append($("<td><B>" + "Opening Price" + "</B></td>"));   
                      row.append($("<td>" + "$ " +value + "</td>"));
                      break;      
            }
        });    
     }
     
     //local storage
     
     $(".favIcon").click(function (e)
     {
        var favoriteSym  = $('#table tr:eq(1) td:eq(1)').text(); 
        if (typeof (Storage) !== "undefined")
        {
            if (localStorage.favSym)
            {
                var symsJSONString = localStorage.favSym;
                var symJsons = $.parseJSON(symsJSONString);
                var ind = symJsons.indexOf(favoriteSym);
                if(ind > -1) //If in local storage remove it
                {   
                    //Delete from storage and remove from table.
                    $(".favIcon").attr('src',"http://www-scf.usc.edu/~nalwad/hw4/images/white_star.png");
                    symJsons.splice(ind, 1);
                    var symJson = JSON.stringify(symJsons);
                    localStorage.setItem("favSym", symJson);
                     $(".favTableRow").remove(); //Clear old data before adding new rows.
                    var newFavData = $.get( 
                        "http://stockapp571.appspot.com/php?callback=?",
                        { favSymbol:symJson },
                        function(data) {
                        },"jsonp"
                    );

                    newFavData.complete(function(data){
                        var result = data.responseText;
                        $.each($.parseJSON(result), function (index,value){
                            drawFavTable($.parseJSON(value));
                        });
                    });
                }
                else //Add to local storage and to favorite table
                {
                    $(".favIcon").attr('src',"http://www-scf.usc.edu/~nalwad/hw4/images/yellow_star.png");
                    symJsons.push(favoriteSym);
                    var symJson = JSON.stringify(symJsons);
                    localStorage.setItem("favSym", symJson);
                     $.get( 
                         "http://stockapp571.appspot.com/php",
                         { Symbol:favoriteSym },
                        function(data) {
                            drawFavTable($.parseJSON(data)); 
                    });       
                }
            }
            else //adding first time
            {
                $(".favIcon").attr('src',"http://www-scf.usc.edu/~nalwad/hw4/images/yellow_star.png");
                var symbols = [Symbol];
                var symJson = JSON.stringify(symbols);
                localStorage.setItem("favSym",symJson);
                $.get( 
                    "http://stockapp571.appspot.com/php",
                    { Symbol:favoriteSym },
                    function(data) {
                         drawFavTable($.parseJSON(data)); 
                    });
            }
        }   
        
     });
     
     var trash; 
     
     function drawFavTable(result) {    
        var Change = ""; 
        var ChangePercent = "";
        var name = "";
        var symbol = "";
        var marketCap = "";
        var stockPrice = "";
        trash = $('<button>Test</button>') 
        $.each(result,function(key,value)
        {
            switch(key)
            {
                case 'Name':
                      name = value;
                      break;
                case 'Symbol':
                      symbol = value;
                      break;
                case 'LastPrice':
                      stockPrice = value;
                      break;
                case 'Change':
                      Change = value.toFixed(2); 
                      break;
                case 'ChangePercent':
                      ChangePercent = value.toFixed(2)+"%";
                      break;
                case 'MarketCap':
                      var marValue = (value/1000000000);
                      var marUpdatedValueMi = (marValue*1000);
                      if ( marUpdatedValueMi < 10 )
                      {
                        marketCap = marUpdatedValueMi.toFixed(2) + " Million";     
                      }
                      else
                      {
                        marketCap = marValue.toFixed(2) + " Billion";
                      }   
                      break;          
            }
         });
        var row = $("<tr class='favTableRow' />")
        $("#favtable").append(row);
        row.append($("<td>" + "<button type='button' class='btn btn-link'>"+symbol+"</button></td>").click(function(){
            selectedFavSymbol = $(this).text();
            var storedvalues = localStorage.favSym;
            var pre = storedvalues.indexOf(selectedFavSymbol);
            if(pre > -1)
            {
               $(".favIcon").attr('src',"http://www-scf.usc.edu/~nalwad/hw4/images/yellow_star.png");       
            }
            else
            {
                $(".favIcon").attr('src',"http://www-scf.usc.edu/~nalwad/hw4/images/white_star.png"); 
            }
            $("#nextButton").removeAttr('disabled'); 
            $("#table").empty();
            $("#tab3").empty();   
                $.get( 
                  "http://stockapp571.appspot.com/php",
                  { Symbol:selectedFavSymbol },
                  function(data) {
                     drawTable($.parseJSON(data));
                  }    
               );      
               var link= "http://chart.finance.yahoo.com/t?s=" + selectedFavSymbol +"&lang=en-US&width=400&height=300";
               $("#iFra").attr("src",link);  
                
                // Populating chart  
                        
               var dfd  =$.get( 
                  "http://stockapp571.appspot.com/php?callback=?",
                  { ChartSymbol:selectedFavSymbol },
                  function(data) {
                  },"jsonp"    
               )
                dfd.complete(function(data){
                   console.log($.parseJSON(data.responseText));
                   populateHistoricalChart($.parseJSON(data.responseText),selectedFavSymbol);      
                });

                
                //Populating News feed.
                
               var newsDfd = $.get( 
                  "http://stockapp571.appspot.com/php",
                  { NewsSymbol:selectedFavSymbol },
                  function(data) {
                  },"jsonp"    
               )
               newsDfd.complete(function(data){
                   console.log($.parseJSON(data.responseText));
                   populateNewsFeed($.parseJSON(data.responseText),selectedFavSymbol);      
                });          
            
            //End
        }));  
        row.append($("<td style='padding-top: 13px'>" + name + "</td>"));
        row.append($("<td style='padding-top: 13px'>" + "$" +stockPrice + "</td>"));   
        if( Change < 0 || ChangePercent < 0)
        {
            row.append($("<td style='color:red;'>" + Change + " ( " + ChangePercent + " )" + "<img src='http://cs-server.usc.edu:45678/hw/hw8/images/down.png'>" + "</td>"));      
        }
        else if( Change > 0 || ChangePercent > 0)
        {
            row.append($("<td style='color:green;'>" + Change + " ( " + ChangePercent + " )" + "<img src='http://cs-server.usc.edu:45678/hw/hw8/images/up.png'>" + "</td>"));      
        }
        else
        {
            row.append($("<td>" + Change + " ( " + ChangePercent + " )" + "</td>"));        
        } 
        row.append($("<td>" + marketCap + "</td>")); 
        var trash = $('<button class="btn btn primary"type="reset"><span class="glyphicon glyphicon-trash"></span></button>').click(function () {
               if (typeof (Storage) !== "undefined")
               {
                  if (localStorage.favSym)
                  {
                      var symsJSONString = localStorage.favSym;
                      var symJsons = $.parseJSON(symsJSONString);
                      var fSym = $(this).parent().siblings(":first").text();
                      var p = symJsons.indexOf(fSym);
                      if(p > -1)
                      {
                         symJsons.splice(p, 1);
                      }
                      var symJson = JSON.stringify(symJsons);
                      localStorage.setItem("favSym", symJson);      
                  }
               }
               $(this).parent().parent().remove();
        }); 
        $('<td>').append(trash).appendTo(row); 
     }
});