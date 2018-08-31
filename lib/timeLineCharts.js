;(function($, window, undefined) {

    var win = $(window);
    //doc = $(document),

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
            this.calculateData();

        },

        initChartSetting:function(){
            var opts = this.opts;
            var padding = opts.padding;
            this.opts.separateYSpacing = (opts.height - (padding.top + padding.bottom + opts.xAliasHeight + opts.lineLegendHeight) )/ opts.separateYNum;
        },


        /**
         * 创建
         */
        draw:function() {
            if (this.opts.dataList.length < 1 || this.opts.dataList[0].length<=0){
                return;
            }
            this.drawLegend();
            this.drawLine();
            this.drawLatitude();
            this.drawLongitude();
            this.drawYAliax();
            this.drawXAliax();
            this.drawBorder();
        },
        drawBorder:function(){
            var opts = this.opts;
            var svg = opts.svg;
            var bgStyle = opts.backgroundLine;
            var padding = opts.padding,dataNum = opts.dataNum;
            var left = padding.left, right=opts.width - padding.right,  top=padding.top+opts.lineLegendHeight, bottom=opts.height - padding.bottom-opts.xAliasHeight ;
            svg.paper.line(left, top, left, bottom).attr({
                stroke: bgStyle.stroke,
                strokeWidth: bgStyle.width,
            });
            svg.paper.line(right, top, right, bottom).attr({
                stroke: bgStyle.stroke,
                strokeWidth: bgStyle.width,
            });
            svg.paper.line(left, bottom, right, bottom).attr({
                stroke: bgStyle.stroke,
                strokeWidth: bgStyle.width,
            });
        },
        drawLegend:function(){
        },
        /**
         * 绘制经线
         */
        drawLongitude:function(){
            var opts = this.opts;
            var svg = opts.svg;
            var bgStyle = opts.backgroundLine;
            var padding = opts.padding,dataNum = opts.dataNum;
            var left = padding.left+1, right=opts.width - padding.right-1,  top=padding.top+opts.lineLegendHeight+1, bottom=opts.height - padding.bottom - opts.xAliasHeight-1;
            var xSpacing = (right - left) / opts.separateDataNum;
            for (var i = 1;i <opts.separateDataNum;i+=1){
                var x = left + xSpacing * i;
                svg.paper.line(x, top, x, bottom).attr({
                    stroke: bgStyle.stroke,
                    strokeWidth: bgStyle.width,
                    "stroke-dashoffset" : 2,
                    strokeDasharray: '10 5'
                });
            }

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
            var left = padding.left +1, right=opts.width - padding.right-1,  top=padding.top+opts.lineLegendHeight+1, bottom=opts.height - padding.bottom - opts.xAliasHeight-1;
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
            var opts = this.opts;
            var svg = opts.svg,separateDataNum = opts.separateDataNum;
            var xdataSpacing = opts.dataSpacing;
            var xalias = opts.xAlias;
            var padding = opts.padding,dataNum = opts.dataNum;
            var left = padding.left +1, right=opts.width - padding.right-1,  top=padding.top+opts.lineLegendHeight+1, bottom=opts.height - padding.bottom;
            var xDate = opts.stockInfo.quoteDate.substr(5,5).replace('-','/');
            svg.paper.text(left,bottom,xDate).attr({
                fontSize:xalias.fontSize,
                fontFamily:xalias.fontFamily
            });
            var quaWidth = (right - left)/4;
            svg.paper.text(left+quaWidth-12,bottom,'10:30').attr({
                fontSize:xalias.fontSize,
                fontFamily:xalias.fontFamily
            });
            svg.paper.text(left+quaWidth*2-28,bottom,'11:30/13:00').attr({
                fontSize:xalias.fontSize,
                fontFamily:xalias.fontFamily
            });
            svg.paper.text(left+quaWidth*3-12,bottom,'14:00').attr({
                fontSize:xalias.fontSize,
                fontFamily:xalias.fontFamily
            });
            svg.paper.text(right-24,bottom,'15:00').attr({
                fontSize:xalias.fontSize,
                fontFamily:xalias.fontFamily
            });
        },

        /**
         * 绘制Y坐标轴
         */
        drawYAliax:function(){
            var opts = this.opts;
            var svg = opts.svg;
            var separateYSpacing = opts.separateYSpacing/2;
            var yMax = opts.yMax, yMin = opts.yMin;
            var closeYes = parseFloat(opts.stockInfo.closeYesterday);
            var calyMargs = this._calYMargs(yMax,yMin,closeYes);
            var yValMax = calyMargs.yValMax, yValMin = calyMargs.yValMin, mod=calyMargs.mod;

            var padding = opts.padding;
            var left = padding.left, right=opts.width - padding.right-1,  top=padding.top+opts.lineLegendHeight+1, bottom=opts.height - padding.bottom - opts.xAliasHeight-1;
            var ySeparateValue = (yValMax - yValMin) / 4;
            var yMaxText = this.formatNum(yValMax);
            var yRange = (yValMax - closeYes)/closeYes*100;
            var color = opts.riseColor;
            var yRangeText = this.formatNum(yRange) + '%';
            if (yRange > 0){
                color = opts.riseColor;
                yRangeText = '+' + yRangeText;
            }
            else if (yRange < 0){
                color = opts.fallColor;
            }
            svg.paper.text(left, top + 12, yMaxText).attr({
                fontSize:'9px',
                fontFamily:'Helvetica',
                fontWeight:'lighter',
                stroke:color
            });

            svg.paper.text(right -32, top + 12, yRangeText).attr({
                fontSize:'9px',
                fontFamily:'Helvetica',
                fontWeight:'lighter',
                stroke:color
            });
            var yValueText = yValMax - ySeparateValue;
            var yRange = (yValueText - closeYes)/closeYes*100;
            var yRangeText = this.formatNum(yRange) + '%';
            if (yRange > 0){
                color = opts.riseColor;
                yRangeText = '+' + yRangeText;
            }
            else if (yRange < 0){
                color = opts.fallColor;
            }
            svg.paper.text(left, top+separateYSpacing + 4, this.formatNum(yValueText)).attr({
                fontSize:'9px',
                fontFamily:'Helvetica',
                fontWeight:'lighter',
                stroke:color
            });

             svg.paper.text(right -32, top+separateYSpacing + 4, yRangeText).attr({
                fontSize:'9px',
                fontFamily:'Helvetica',
                fontWeight:'lighter',
                 stroke:color
            });
            if (mod == 1){
                yValueText = yValMax - 2 * ySeparateValue;
                var yRange = (yValueText - closeYes)/closeYes*100;
                var yRangeText = this.formatNum(yRange) + '%';
                if (yRange > 0){
                    color = opts.riseColor;
                    yRangeText = '+' + yRangeText;
                }
                else if (yRange < 0){
                    color = opts.fallColor;
                }
                svg.paper.text(left, top+2 * separateYSpacing + 4, this.formatNum(yValueText)).attr({
                    fontSize:'9px',
                    fontFamily:'Helvetica',
                    fontWeight:'lighter',
                    stroke:color
                });

                svg.paper.text(right -30, top+2 * separateYSpacing + 4,  this.formatNum(yValueText)).attr({
                    fontSize:'9px',
                    fontFamily:'Helvetica',
                    fontWeight:'lighter',
                    stroke:color
                });
            }
            else{
                svg.paper.text(left, top+2 * separateYSpacing + 4, this.formatNum(closeYes)).attr({
                    fontSize:'9px',
                    fontFamily:'Helvetica',
                    fontWeight:'lighter',
                });
                svg.paper.text(right -26, top+2 * separateYSpacing + 4, '0.00%').attr({
                    fontSize:'9px',
                    fontFamily:'Helvetica',
                    fontWeight:'lighter'
                });
            }

            yValueText = yValMax - 3 * ySeparateValue;
            var yRange = (yValueText - closeYes)/closeYes*100;
            var yRangeText = this.formatNum(yRange) + '%';
            if (yRange > 0){
                color = opts.riseColor;
                yRangeText = '+' + yRangeText;
            }
            else if (yRange < 0){
                color = opts.fallColor;
            }
            svg.paper.text(left, top+3 * separateYSpacing + 4, this.formatNum(yValueText)).attr({
                fontSize:'9px',
                fontFamily:'Helvetica',
                fontWeight:'lighter',
                stroke:color
            });
            svg.paper.text(right -32, top+3 * separateYSpacing + 4, yRangeText).attr({
                fontSize:'9px',
                fontFamily:'Helvetica',
                fontWeight:'lighter',
                stroke:color
            });
            var yMinText = this.formatNum(yValMin);
            var yRangeText = this.formatNum((yValMin - closeYes)/closeYes*100) + '%';
            if (yRange > 0){
                color = opts.riseColor;
                yRangeText = '+' + yRangeText;
            }
            else if (yRange < 0){
                color = opts.fallColor;
            }
            svg.paper.text(left, bottom-1, yMinText).attr({
                fontSize:'9px',
                fontFamily:'Helvetica',
                fontWeight:'lighter',
                stroke:color
            });
            svg.paper.text(right -32, bottom-1, yRangeText).attr({
                fontSize:'9px',
                fontFamily:'Helvetica',
                fontWeight:'lighter',
                stroke:color
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
            var left = padding.left +1, right=opts.width - padding.right-1,  top=padding.top+opts.lineLegendHeight+1, bottom=opts.height - padding.bottom - opts.xAliasHeight-1;
            var closeYes = parseFloat(opts.stockInfo.closeYesterday);
            var calyMargs = this._calYMargs(yMax,yMin,closeYes);
            var yValMax = calyMargs.yValMax, yValMin = calyMargs.yValMin, mod=calyMargs.mod;
            var ySeparateValue = (bottom - top) / (yValMax - yValMin);
            var xPointWidth = ( opts.width - (opts.padding.left+ opts.padding.right)) / (opts.dataNum - 1);
            var dataList = opts.dataList;
            for (var i = 0;i < dataList.length;i++){
                var dlist = dataList[i];
                var lineSet = opts.line[i];
                var x1 = left;
                var y1 = bottom - ySeparateValue * (dlist[0].y-yValMin);
                var pointList=[x1,y1];
                var x2= 0,y2=0;
                for (var j = 1;j < dlist.length;j++){
                    var x2 = left + j * xPointWidth;
                    var y2 = bottom - ySeparateValue * (dlist[j].y-yValMin);
                    pointList.push(x2);
                    pointList.push(y2);
                }
                pointList.push(x2)
                pointList.push(bottom);
                pointList.push(left);
                pointList.push(bottom);
                svg.paper.polygon(pointList).attr({
                    stroke: lineSet.stroke,
                    strokeWidth: lineSet.strokeWidth,
                    fill:lineSet.backgroundColor
                });
                pointList = [];
            }
        },


        calculateData:function(){
            var opts = this.opts;
            if (opts.dataList.length === 0 || opts.dataList[0].length === 0){
                return false;
            }

            // trim data num
            var dataNum = opts.dataNum;

            // calculate max and min in the chart
            var opts = this.opts;
            var yMax = opts.yMax, yMin = opts.yMin;
            for (var i = 0;i<opts.dataList.length;i++){
                if (dataNum < opts.dataList[i].length){
                    opts.dataList[i] = opts.dataList[i].slice(opts.dataList[i].length - dataNum);
                }
                var dataItem = opts.dataList[i];
                for (var j=0;j<dataItem.length;j++){
                    var item = dataItem[j];
                    if (yMax < item.y){
                        yMax = item.y;
                    }
                    if (yMin > item.y){
                        yMin = item.y;
                    }
                }
            }
            this.opts.yMax = yMax;
            this.opts.yMin = yMin;
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
            }//如果是多数据
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
        },
        formatNum:function(num){
            var mags = Math.abs(num);
            if (mags < 10){
                num = num.toFixed(2);
            }
            else if (mags < 100){
                num = num.toFixed(2);
            }
            else if (mags < 1000){
                num = num.toFixed(1);
            }
            else{
                num = parseInt(num);
            }
            return num;
        },
        _calYMargs:function(yMax,yMin,closeYes){
            var yValMax = yMax, yValMin=yMin,mod=0;
            if (Math.abs(yMax-closeYes) - Math.abs(yMin-closeYes) > 0 && yMax < closeYes * 1.12 && yMin > closeYes * 0.88){
                yValMax = Math.abs(yMax);
                yValMin = closeYes - (yMax-closeYes);
            }
            else if (Math.abs(yMax-closeYes) - Math.abs(yMin-closeYes) < 0 && yMax < closeYes * 1.12 && yMin > closeYes * 0.88) {
                yValMax = closeYes + (closeYes-yMin);
                yValMin = yMin;
            }
            else if (yMax > closeYes * 1.12 || yMin < closeYes * 0.88){
                yValMax = yMax;
                yValMin = yMin;
                mod = 1;
            }
            if (yMax - yMin < 0.001 && mod == 0){
                if (yValMax - closeYes > 0.001){
                    yValMin = closeYes - (yMax-closeYes);
                    yValMax = yMax;
                }
                else if (yValMax - closeYes < 0){
                    yValMax = closeYes + (closeYes-yMin);
                    yValMin = yMin;
                }
                else{
                    yValMax = closeYes * 1.1;
                    yValMin = yMin * 0.9;
                }


            }
            return {yValMin:yValMin,yValMax:yValMax,mod:mod};
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

        //line:[{stroke:'#c2cddd',strokeWidth:'1px',backgroundColor:'#ecf3fd'}],
        line:[{stroke:'#c2cddd',strokeWidth:'0px',backgroundColor:'#ecf3fd'}],

        backgroundLine:{strokeWidth:'1px',stroke:'#dddddd'},
        yMax:-99999,
        yMin:99999,
        dataList:[],
        id:'svg',
        dataSpacing:26,
        dataNum:241,
        separateYNum:2,
        separateDataNum:4,
        padding:{left:3,top:0,right:3,bottom:0},
        xAlias:{fontSize:'10px',fontFamily:'Helvetica'},
        yAlias:{strokeWidth:1},
        yAliasWidth:24,
        xAliasHeight:16,
        lineLegendHeight:0,
        candleWidth:6,
        riseColor:'#e67367',
        fallColor:'#39a242'

    };


    var TimeLineChart = function(options) {
        return new Chart(options);
    };

    window.TimeLineChart = $.TimeLineChart = TimeLineChart;

})(window.jQuery || window.Zepto, window);
