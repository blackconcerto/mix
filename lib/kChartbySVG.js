;(function($, window, undefined) {

    var win = $(window),
    //doc = $(document),
        MAData = [],MAKey=[],
        isLock = false;

    var Chart = function(options) {

        this.opts = $.extend({}, Chart.defaults, options);
        this.opts.svgEle = $(this.opts.id);
        this.init();
        this.draw();
    };

    Chart.prototype = {
        /**
         * 初始化
         */
        init : function() {
            var opts = this.opts;
            this.opts.width = opts.svgEle.width();
            this.opts.height = opts.svgEle.height();
            if (opts.height == 0){
                opts.height = document.getElementById(opts.id).offsetHeight;
            }
            if (opts.width == 0){
                opts.width = document.getElementById(opts.id).offsetWidth;
            }
            this.opts.svg = Snap(opts.id);
            this.initChartSetting();
            this.calculateData(this.opts.dataList);

        },

        initChartSetting:function(){
            var opts = this.opts;
            var padding = opts.padding;
            this.opts.dataNum = ( opts.width - (opts.padding.left + opts.yAliasWidth + opts.padding.right + 2)) /( opts.candleWidth * 1.25) - 1;
            this.opts.separateYSpacing = (opts.height - (padding.top + padding.bottom + opts.xAliasHeight + opts.lineLegendHeight + 2) )/ opts.separateYNum;
        },


        /**
         * 创建
         */
        draw:function() {
            if (this.opts.dataList.length < 1 || this.opts.dataList[0].length<=0){
                return;
            }
            this.drawLegend();
            this.drawBorder();
            this.drawLatitude();
            this.drawLongitude();
            this.drawYAliax();
            this.drawXAliax();
            this.drawCandle();
            this.drawLine();

        },
        drawBorder:function(){
            var opts = this.opts;
            var svg = opts.svg;
            var separateYSpacing = opts.separateYSpacing;
            var bgStyle = opts.backgroundLine;
            var padding = opts.padding;
            var left = padding.left + opts.yAliasWidth, right=opts.width - padding.right, top=padding.top+opts.lineLegendHeight, bottom=opts.height - padding.bottom - opts.xAliasHeight;

            svg.paper.line(left, bottom, right, bottom).attr({
                stroke: bgStyle.stroke,
                strokeWidth: bgStyle.width
            });
            svg.paper.line(left, top, right, top).attr({
                stroke: bgStyle.stroke,
                strokeWidth: bgStyle.width
            });
            svg.paper.line(left, top, left, bottom).attr({
                stroke: bgStyle.stroke,
                strokeWidth: bgStyle.width
            });
            svg.paper.line(right, top, right, bottom).attr({
                stroke: bgStyle.stroke,
                strokeWidth: bgStyle.width
            });
        },
        drawLegend:function(){
            var opts = this.opts;
            var svg = opts.svg;
            var padding = opts.padding;
            var top=padding.top+10,left=padding.left + opts.yAliasWidth;
            var xlength = 60, x,xCnt=0;
            for (var i = 0;i < MAKey.length;i++) {
                var ma = MAKey[i];
                var maList = MAData[i];
                if (maList.length>0){
                    var maValue=maList[maList.length - 1];
                    var lineSet = opts.line[i];
                    x = xCnt * xlength;
                    svg.paper.text(left + x, top, 'MA'+ma+':'+(maValue.y).toFixed(2)).attr({
                        fontSize: '8px',
                        fontFamily: 'Helvetica',
                        fontWeight: 'lighter',
                        stroke: lineSet.stroke,
                    });
                    xCnt += 1;
                }

            }
        },
        /**
         * 绘制经线
         */
        drawLongitude:function(){
            //var opts = this.opts;
            //var svg = opts.svg;
            //var xdataSpacing = opts.dataSpacing;
            //var bgStyle = opts.backgroundLine;
            //var padding = opts.padding,dataNum = opts.dataNum;
            //var left = padding.left + opts.yAliaxWidth, right=opts.width - padding.right, top=padding.top, bottom=opts.height - padding.bottom - opts.xAliaxheight;
            //for (var i = 0;i < dataNum;i=i+opts.separateDataNum){
            //    var x = left + xdataSpacing * i;
            //    svg.paper.line(x, top, x, bottom).attr({
            //        stroke: bgStyle.stroke,
            //        strokeWidth: bgStyle.width,
            //
            //    });
            //}
        },

        /**
         * 绘制纬线
         */
        drawLatitude:function(){
            var opts = this.opts;
            var svg = opts.svg;
            var separateYSpacing = opts.separateYSpacing;
            var bgStyle = opts.backgroundLine;
            var padding = opts.padding;
            var left = padding.left + opts.yAliasWidth+1, right=opts.width - padding.right-1, top=padding.top+opts.lineLegendHeight+1, bottom=opts.height - padding.bottom - opts.xAliasHeight-1;

            for (var i = 1;i < opts.separateYNum;i++){
                var y = top + separateYSpacing * i;
                svg.paper.line(left, y, right, y).attr({
                    stroke: bgStyle.stroke,
                    strokeWidth: bgStyle.width,
                    "stroke-dashoffset" : 2,
                    strokeDasharray: '10 5'
                });
            }

        },


        /**
         * 绘制x坐标轴
         */
        drawXAliax:function(){
            //var opts = this.opts;
            //var svg = opts.svg,separateDataNum = opts.separateDataNum;
            //var xdataSpacing = opts.dataSpacing;
            //var xalias = opts.xAlias;
            //var padding = opts.padding,dataNum = opts.dataNum;
            //var left = padding.left, right=opts.width - padding.right, top=padding.top, bottom=opts.height;
            //var dlist = opts.dataList[0];
            //svg.paper.text(0,bottom,dlist[0].x).attr({
            //    fontSize:xalias.fontSize,
            //    fontFamily:xalias.fontFamily
            //});
            //if (dlist.length > separateDataNum){
            //    var dNumless = dlist.length - opts.separateDataNum;
            //    for (var i = opts.separateDataNum;i < dNumless;i=i+opts.separateDataNum){
            //        var datetext = dlist[i].x;
            //        var x = left + xdataSpacing * i - 12;
            //        svg.paper.text(x,bottom,datetext).attr({
            //            fontSize:xalias.fontSize,
            //            fontFamily:xalias.fontFamily
            //        });
            //    }
            //    var x  = left + xdataSpacing * i - 12;
            //    var datetext = dlist[i].x;
            //    var remain = (dlist.length - 1 - i);
            //    if (remain < 2){
            //        x  = left + xdataSpacing * (dlist.length - 1) - 24;
            //        datetext = dlist[dlist.length - 1].x;
            //        svg.paper.text(x,bottom,datetext).attr({
            //            fontSize:xalias.fontSize,
            //            fontFamily:xalias.fontFamily
            //        });
            //    }
            //    else{
            //        svg.paper.text(x,bottom,datetext).attr({
            //            fontSize:xalias.fontSize,
            //            fontFamily:xalias.fontFamily
            //        });
            //        //x  = left + xdataSpacing * (dlist.length - 1) - 24;
            //        //datetext = dlist[dlist.length - 1].x;
            //        //svg.paper.text(x,bottom,datetext).attr({
            //        //    fontSize:xalias.fontSize,
            //        //    fontFamily:xalias.fontFamily
            //        //});
            //    }
            //}

        },

        /**
         * 绘制Y坐标轴
         */
        drawYAliax:function(){
            var opts = this.opts;
            var svg = opts.svg;
            var separateYSpacing = opts.separateYSpacing;
            var yMax = opts.yMax, yMin = opts.yMin;
            var padding = opts.padding;
            var left = padding.left+1, right=opts.width - padding.right-1, top=padding.top+opts.lineLegendHeight+1, bottom=opts.height - padding.bottom - opts.xAliasHeight-1;
            var ySeparateValue = (yMax - yMin) / opts.separateYNum;
            var yMaxText = yMax;
            if (yMaxText < 10){
                yMaxText = yMaxText.toFixed(2);
            }
            else if (yMaxText < 100){
                yMaxText = yMaxText.toFixed(1);
            }
            else{
                yMaxText = parseInt(yMaxText);
            }
            var t1 = svg.paper.text(left, top + 4, yMaxText).attr({
                fontSize:'10px',
                fontFamily:'Helvetica',
                fontWeight:'lighter'
            });

            for (var i = 1;i < opts.separateYNum;i++){
                var yValueText = yMax - i * ySeparateValue;
                yValueText = yValueText;
                var yMarg = Math.abs(yValueText);
                if (yMarg<10){
                    yValueText=yValueText.toFixed(2);
                }
                else if (yMarg<100){
                    yValueText=yValueText.toFixed(1);
                }
                else{
                    yValueText = parseInt(yValueText);
                }

                svg.paper.text(left, top+i * separateYSpacing + 4, yValueText).attr({
                    fontSize:'10px',
                    fontFamily:'Helvetica',
                    fontWeight:'lighter',
                });
            }
            var yMinText = yMin;
            var yMinMags = Math.abs(yMinText);
            if (yMinMags < 10){
                yMinText = yMinText.toFixed(2);
            }
            else if (yMinMags < 100){
                yMinText = yMinText.toFixed(1);
            }
            else{
                yMinText = parseInt(yMinText);
            }
            var t1 = svg.paper.text(left, bottom-1, yMinText).attr({
                fontSize:'10px',
                fontFamily:'Helvetica',
                fontWeight:'lighter',
            });
        },

        /**
         * 绘制线
         */
        drawLine:function(){
            var opts = this.opts;
            var svg = opts.svg;
            var yMax = opts.yMax, yMin = opts.yMin;
            var padding = opts.padding;
            var left = padding.left + opts.yAliasWidth+1, right=opts.width - padding.right-1, top=padding.top+opts.lineLegendHeight+1, bottom=opts.height - padding.bottom - opts.xAliasHeight-1;
            var ySeparateValue = (bottom - top) / (yMax - yMin),quaterCw=opts.candleWidth / 4,halfCw=opts.candleWidth / 2;
            var maDataList = MAData;
            for (var i = 0;i < maDataList.length;i++){
                var dlist = maDataList[i];
                var lineSet = opts.line[i];
                var x1 = left + quaterCw + halfCw;
                var y1 = bottom - ySeparateValue * (dlist[0].y-yMin);
                var pointList=[x1,y1];
                for (var j = 1;j < dlist.length;j++){
                    var x2 = left + j * opts.candleWidth * 1.25 + quaterCw + halfCw;
                    var y2 = bottom - ySeparateValue * (dlist[j].y-yMin);
                    pointList.push(x2);
                    pointList.push(y2)
                }
                svg.paper.polyline(pointList).attr({
                    stroke: lineSet.stroke,
                    strokeWidth: lineSet.strokeWidth,
                    fill:'transparent'
                });
                pointList = [];
            }
        },

        /**
         * 绘制蜡烛图
         */
        drawCandle:function(){
            var opts = this.opts;
            var svg = opts.svg;
            var yMax = opts.yMax, yMin = opts.yMin;
            var padding = opts.padding;
            var left = padding.left + opts.yAliasWidth+1, right=opts.width - padding.right-1, top=padding.top+opts.lineLegendHeight+1, bottom=opts.height - padding.bottom - opts.xAliasHeight-1;
            var yHeight = (bottom - top) / (yMax - yMin);
            var dataList = opts.dataList;
            if (dataList.length <= 0){
                return false;
            }
            var item, x, y1, y2, stroke, y,candleHeight, y3, y4, curMth, mthCnt= 0,aliasX,quaterCw=opts.candleWidth / 4,halfCw=opts.candleWidth / 2;
            var firstItem = dataList[0];
            var month=firstItem.date.substr(5,2);
            var bgStyle = opts.backgroundLine;

            for (var i = 0;i < dataList.length;i++){
                item = dataList[i];
                x = left + (i) * opts.candleWidth * 1.25 + quaterCw;
                y1 = bottom - yHeight * (item.open-yMin);
                y2 = bottom - yHeight * (item.close-yMin);
                stroke = opts.riseColor;
                y = y1;
                candleHeight = Math.abs(y1 - y2);
                if (item.close > item.open){
                    stroke = opts.riseColor;
                    y = y2;
                }
                else if (item.close < item.open){
                    stroke = opts.fallColor;
                    y = y1;
                }
                else{
                    if (i > 0){
                        var preItem = dataList[i - 1];
                        if (item.close > preItem.close){
                            stroke = opts.riseColor;
                        }
                        else if (item.close < preItem.close){
                            stroke = opts.fallColor;
                        }
                    }
                }

                curMth = item.date.substr(5,2);
                if (curMth != month){
                    aliasX = x + halfCw;
                    if (mthCnt>0){
                        var t1 = svg.paper.text(aliasX-4, bottom + opts.xAliasHeight, curMth).attr({
                            fontSize:'8px',
                            fontFamily:'Helvetica',
                            fontWeight:'lighter',
                            textAlign:'center'
                        });

                    }
                    else{
                        var t1 = svg.paper.text(aliasX - 12, bottom + opts.xAliasHeight, item.date.substr(0,7).replace('-','')).attr({
                            fontSize:'8px',
                            fontFamily:'Helvetica',
                            fontWeight:'lighter',
                            textAlign:'center'
                        });
                        mthCnt+=1;
                    }
                    svg.paper.line(aliasX, top, aliasX, bottom).attr({
                        stroke: bgStyle.stroke,
                        strokeWidth: bgStyle.width,
                        "stroke-dashoffset" : 2,
                        strokeDasharray: '10 5'
                    });
                    month=curMth;
                }
                else{

                }
                if (candleHeight>0){
                    svg.paper.rect(x,y,opts.candleWidth, candleHeight).attr({
                        fill: stroke
                    });
                }
                else{
                    svg.paper.line(x, y, x+opts.candleWidth, y).attr({
                        stroke: stroke,
                        strokeWidth: '1px'
                    });
                }

                y3 = bottom - yHeight * (item.high-yMin);
                y4 = bottom - yHeight * (item.low-yMin);
                if (y3 > y4 || y3 < y4){
                    svg.paper.line(x+halfCw, y3, x+halfCw, y4).attr({
                        stroke: stroke,
                        strokeWidth: 1,
                    });
                }



            }
        },

        calculateMAData:function(dataList, ma){
            var maLast = dataList.length - ma;
            var maData = [];
            if (dataList.length == 0){
                return false;
            }
            if (maLast < 0){
                var sum = dataList[0].close;
                for (var i = 1;i<dataList.length;i++){
                    var item = dataList[i];
                    sum += item.close;
                    maData.push({x:item.date, y:sum/i})
                }
                return false;
            }

            sum = 0;
            var avg = 0;
            for (var i = dataList.length-1;i>=maLast;i--){
                sum += dataList[i].close;
            }
            for (var i = dataList.length - 1;i>=0;i--){
                var item = dataList[i];
                if (i < ma){
                    avg = sum /( i +1);
                }
                else{
                    var preItem = dataList[i-ma];
                    avg = sum / ma;
                    sum += preItem.close;

                }
                maData.unshift({x:item.date,y:avg});
                sum -= item.close;
            }
            var opts = this.opts;
            if (opts.dataNum < dataList.length){
                return maData.slice(dataList.length - opts.dataNum);
            }
            else{
                return maData;
            }

        },

        calculateMA:function(dataList){
            MAKey = [5,10,20,30];
            MAData.push(this.calculateMAData(dataList,5));
            MAData.push(this.calculateMAData(dataList,10));
            MAData.push(this.calculateMAData(dataList,20));
            MAData.push(this.calculateMAData(dataList,30));
        },

        calculateData:function(dataList){
            var opts = this.opts;
            if (dataList.length === 0 || dataList[0].length === 0){
                return false;
            }

            // trim data num
            var dataNum = opts.dataNum;

            // calculate ma data
            this.calculateMA(dataList);
            if (dataNum < dataList.length){
                dataList = dataList.slice(dataList.length - dataNum);
                opts.dataList=dataList;
            }
            // calculate max and min in the chart
            var opts = this.opts;
            var yMax = opts.yMax, yMin = opts.yMin;
            for (var i = 0;i<dataList.length;i++){
                var item = dataList[i];
                if (yMax < item.high){
                    yMax = item.high;
                }
                if (yMin > item.low){
                    yMin = item.low;
                }
            }

            for (var i = 0;i < MAData.length;i++){
                var maDataList = MAData[i];
                if (maDataList.length > 0 ){
                    for (var j = 0;j < maDataList.length - 1;j++){
                        var item = maDataList[j];
                        if (yMax < item.y){
                            yMax = item.y;
                        }
                        if (yMin > item.y){
                            yMin = item.y;
                        }
                    }
                }
            }
            this.opts.yMax = Math.ceil(yMax);
            this.opts.yMin = Math.floor(yMin);
        },
        getMax:function(data,key,isMultiData){
            if(!isMultiData){
                var maxY = data.values[key]["value"+key][0].y;
                var length = data.values[key]["value"+key].length;
                var keystr = "value"+key;
                for( var i=1;i< length;i++ ){
                    if(maxY< data.values[key][keystr][i].y) maxY=data.values[key][keystr][i].y;
                }
                return maxY;//返回最大值 如果不是多数据
            }else{
                var maxarr=[];
                var count = data.values.length;//多条数据的数据长度
                for(var i=0;i< count;i++){
                    maxarr.push(LineChart.getMax(data,i,false));
                }
                var maxvalue = maxarr[0];
                for(var i=1;i< maxarr.length;i++){
                    maxvalue = (maxvalue< maxarr[i])?maxarr[i]:maxvalue;
                }
                return maxvalue;
            }
        },

        getMin:function(data,key,isMultiData){
            if(!isMultiData){
                var minY = data.values[key]["value"+key][0].y;
                var length = data.values[key]["value"+key].length;
                var keystr = "value"+key;
                for( var i=1;i< length;i++ ){
                    if(minY> data.values[key][keystr][i].y) minY=data.values[key][keystr][i].y;
                }
                return minY;//返回最大值 如果不是多数据
            }else{
                var minarr=[];
                var count = data.values.length;//多条数据的数据长度
                for(var i=0;i< count;i++){
                    minarr.push(LineChart.getMin(data,i,false));
                }
                var minvalue = minarr[0];
                for(var i=1;i< minarr.length;i++){
                    minvalue = (minvalue> minarr[i])?minarr[i]:minvalue;
                }
                return minvalue;
            }//如果是多数据
        }


    };

    /**
     * 默认配置
     */
    Chart.defaults = {

        // 内容
        content: '加载中...',

        // 标题
        title: 'load',

        // 宽度
        width: 'auto',

        // 高度
        height: 'auto',

        line:[{stroke:'#e92600',strokeWidth:1},{stroke:'#f79900',strokeWidth:1},
            {stroke:'#348e00',strokeWidth:1},{stroke:'#4d97ff',strokeWidth:1}],
        point:[{show:true,stroke:'#50a6ff',radius:3},{show:false,stroke:'#cf0037',radius:2}],

        backgroundLine:{strokeWidth:1,stroke:'#efefef'},

        yMax:-99999,

        yMin:99999,

        dataList:[],

        id:'svg',

        dataSpacing:26,

        dataNum:40,

        separateYNum:4,

        separateDataNum:4,

        padding:{left:3,top:0,right:3,bottom:0},
        xAlias:{fontSize:'10px',fontFamily:'Helvetica'},
        yAlias:{strokeWidth:1},
        yAliasWidth:26,
        xAliasHeight:16,
        lineLegendHeight:16,
        candleWidth:6,
        riseColor:'#ed5037',
        fallColor:'#39a242'

    };


    var KChart = function(options) {
        return new Chart(options);
    };

    window.KChart = $.KChart = KChart;

})(window.jQuery || window.Zepto, window);
