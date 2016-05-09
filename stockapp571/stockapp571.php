<?php 
    header("Access-Control-Allow-Origin: *");
    if(isset($_GET["Symbol"]))
    {
        $RSymbol=$_GET["Symbol"];
        $QuoteURL="http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=".$RSymbol;
        $jsonValue = file_get_contents($QuoteURL);
        echo $jsonValue;
    }

    if(isset($_GET["favSymbol"]))
    {
        $values = $_GET["favSymbol"];
        $data   = json_decode($values, true);
        $jsonArray = array();
        $length = count($data);
        for ($i = 0; $i < $length; $i++) {
            $QuoteURL="http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=".$data[$i];
            $jsonValue = file_get_contents($QuoteURL);
            array_push($jsonArray,$jsonValue);
        }
        header('Content-Type:application/json');
        echo json_encode($jsonArray);
    }
    
    if(isset($_GET["SearchSymbol"]))
    {
        $SearchSym = $_GET["SearchSymbol"];
        $LOOKUP = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=".$SearchSym;
        $jsonValue = file_get_contents($LOOKUP);
        echo $jsonValue;
    }

    if(isset($_GET["ChartSymbol"]))
    {
        $ChartSymbol = $_GET["ChartSymbol"];
        $Result = "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=%7b%22Normalized%22:false,%22NumberOfDays%22:1095,%22DataPeriod%22:%22Day%22,%22Elements%22:%5b%7b%22Symbol%22:%22". $ChartSymbol."%22,%22Type%22:%22price%22,%22Params%22:%5b%22c%22%5d%7d%5d%7d";
        $jsonValue = file_get_contents($Result);
        header('Content-Type:application/json');
        echo $jsonValue;
    }

    if(isset($_GET["NewsSymbol"]))
    {
        $NewsSymbol = $_GET["NewsSymbol"];
        $accountKey = '6vLNAHUvOvQ0RPIRAYkeY+YX7DeV1e65c+FbUZ6jEtY';
        $WebSearchURL ='https://api.datamarket.azure.com/Bing/Search/v1/News?Query=%27'.$NewsSymbol.'%27&$format=json';
        $context = stream_context_create(array(
            'http' => array(
                'request_fulluri' => true,
                'header' => "Authorization: Basic " . base64_encode($accountKey . ":" . $accountKey)
            )
        ));
        $request = $WebSearchURL;
        $response = file_get_contents($request, 0, $context);
        echo $response;
    }
?>
    
