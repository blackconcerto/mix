# mix
a tool set for chart drawing

##  time - line chart

```js
var dataList = [];
// serverMinutePrice with key-value dict :time:price: {"9:30":12.12,"9:31":12.14}
for (var i = 0; i < minutes.length;i++){
    var min = minutes[i];
    dataList.push({x:min, y:parseFloat(serverMinutePrice[min])});
}

// response
$.TimeLineChart({id:'#fenshi-charts', title:'600001');

```


##  candle - line chart

```js
for (var j = kdailyData.length-1;j> -1;j--){
    var item = kdailyData[j];
    priceData.push({open:parseFloat(item.openIndex),close:parseFloat(item.closeIndex),low:parseFloat(item.lowestIndex),high:parseFloat(item.highestIndex),
    date:item.indexDate});
}
$.KChart({id:'#kcharts',dataList:priceData});
```