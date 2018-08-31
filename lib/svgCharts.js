;(function($, window, undefined) {

    var win = $(window),
    //doc = $(document),
        count = 1,
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

            //this.create();
            //
            //if (this.settings.lock) {
            //    this.lock();
            //}
            //
            //if (!isNaN(this.settings.time)&&this.settings.time!==null) {
            //    this.time();
            //}
            var opts = this.opts;
            this.opts.width = opts.svgEle.width();
            this.opts.height = opts.svgEle.height();
            if (opts.height == 0){
                opts.height = document.getElementById(opts.id).offsetHeight;
            }
            if (opts.width == 0){
                opts.width = document.getElementById(opts.id).offsetWidth;
            }
            var padding = opts.padding;
            this.opts.separateYSpacing = (opts.height - (padding.top + padding.bottom) )/ opts.separateYNum;
            this.opts.svg = Snap(opts.id);
            this.initCmb();
            this.calculateData(this.opts.dataList);

        },

        initCmb:function(){
            var opts = this.opts;
            this.opts.dataSpacing =( opts.width - (opts.padding.left + opts.padding.right)) / (opts.dataNum - 1.0);
        },


        /**
         * 创建
         */
        draw:function() {
            if (this.opts.dataList.length < 1 || this.opts.dataList[0].length<=0){
                return;
            }
            this.drawLatitude();
            this.drawLongitude();
            this.drawYAliax();
            this.drawXAliax();
            this.drawLine();
            this.drawPoint();
        },
        drawBorder:function(){

        },
        /**
         * 绘制经线
         */
        drawLongitude:function(){
            var opts = this.opts;
            var svg = opts.svg;
            var xdataSpacing = opts.dataSpacing;
            var bgStyle = opts.backgroundLine;
            var padding = opts.padding,dataNum = opts.dataNum;
            var left = padding.left, right=opts.width - padding.right, top=padding.top, bottom=opts.height - padding.bottom;
            for (var i = 0;i < dataNum;i=i+opts.separateDataNum){
                var x = left + xdataSpacing * i;
                svg.paper.line(x, top, x, bottom).attr({
                    stroke: bgStyle.stroke,
                    strokeWidth: bgStyle.width
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
            var left = padding.left, right=opts.width - padding.right, top=padding.top, bottom=opts.height - padding.bottom;
            for (var i = 0;i <= opts.separateYNum;i++){
                var y = top + separateYSpacing * i;
                svg.paper.line(left, y, right, y).attr({
                    stroke: bgStyle.stroke,
                    strokeWidth: bgStyle.width
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
            var left = padding.left, right=opts.width - padding.right, top=padding.top, bottom=opts.height;
            var dlist = opts.dataList[0];
            svg.paper.text(0,bottom,dlist[0].x).attr({
                fontSize:xalias.fontSize,
                fontFamily:xalias.fontFamily
            });
            if (dlist.length > separateDataNum){
                var dNumless = dlist.length - opts.separateDataNum;
                for (var i = opts.separateDataNum;i < dNumless;i=i+opts.separateDataNum){
                    var datetext = dlist[i].x;
                    var x = left + xdataSpacing * i - 12;
                    svg.paper.text(x,bottom,datetext).attr({
                        fontSize:xalias.fontSize,
                        fontFamily:xalias.fontFamily
                    });
                }
                var x  = left + xdataSpacing * i - 12;
                var datetext = dlist[i].x;
                var remain = (dlist.length - 1 - i);
                if (remain < 2){
                    x  = left + xdataSpacing * (dlist.length - 1) - 24;
                    datetext = dlist[dlist.length - 1].x;
                    svg.paper.text(x,bottom,datetext).attr({
                        fontSize:xalias.fontSize,
                        fontFamily:xalias.fontFamily
                    });
                }
                else{
                    svg.paper.text(x,bottom,datetext).attr({
                        fontSize:xalias.fontSize,
                        fontFamily:xalias.fontFamily
                    });
                    //x  = left + xdataSpacing * (dlist.length - 1) - 24;
                    //datetext = dlist[dlist.length - 1].x;
                    //svg.paper.text(x,bottom,datetext).attr({
                    //    fontSize:xalias.fontSize,
                    //    fontFamily:xalias.fontFamily
                    //});
                }
            }

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
            var left = padding.left, right=opts.width - padding.right, top=padding.top, bottom=opts.height - padding.bottom;
            var ySeparateValue = (yMax - yMin) / opts.separateYNum;
            if (yMax < 0){
                stroke = '#8abc56';
            }
            else if (yMax >0){
                stroke = '#ff524a';
            }
            else{
                stroke = '#5c6165';
            }
            var yMaxText = yMax * 100;
            if (yMaxText < 10){
                yMaxText = yMaxText.toFixed(2);
            }
            else if (yMaxText < 100){
                yMaxText = yMaxText.toFixed(1);
            }
            else{
                yMaxText = parseInt(yMaxText);
            }
            var t1 = svg.paper.text(right-30, 8, yMaxText + '%').attr({
                width:'80px',
                textAlign:'right',
                fontSize:'10px',
                fontFamily:'Helvetica',
                fontWeight:'lighter',
                stroke:stroke
            });
            for (var i = 1;i < opts.separateYNum;i++){
                var yValueText = yMax - i * ySeparateValue;
                var stroke = '#5c6165';
                if (yValueText < 0){
                    stroke = '#8abc56';
                }
                else if (yValueText >0){
                    stroke = '#ff524a';
                }
                else{
                    stroke = '#5c6165';
                }
                yValueText = yValueText*100;
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

                svg.paper.text(right-30, i * separateYSpacing - 2, yValueText + '%').attr({
                    textAlign:'right',
                    fontSize:'10px',
                    fontFamily:'Helvetica',
                    fontWeight:'lighter',
                    stroke:stroke
                });
            }
            if (yMin < 0){
                stroke = '#8abc56';
            }
            else if (yMin >0){
                stroke = '#ff524a';
            }
            else{
                stroke = '#5c6165';
            }
            var yMinText = yMin * 100;
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
            var t1 = svg.paper.text(right-30, bottom-1, yMinText + '%').attr({
                width:'80px',
                textAlign:'right',
                fontSize:'10px',
                fontFamily:'Helvetica',
                fontWeight:'lighter',
                stroke:stroke
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
            var left = padding.left, right=opts.width - padding.right, top=padding.top, bottom=opts.height - padding.bottom;
            var ySeparateValue = (bottom - top) / (yMax - yMin);
            var dataList = opts.dataList;
            for (var i = 0;i < dataList.length;i++){
                var dlist = dataList[i];
                var lineSet = opts.line[i];
                var x1 = left;
                var y1 = bottom - ySeparateValue * (dlist[0].y-yMin);
                var pointList=[x1,y1];
                for (var j = 1;j < dlist.length;j++){
                    var x2 = j * opts.dataSpacing + left;
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
         * 绘制点
         */
        drawPoint:function(){
            var opts = this.opts;
            var svg = opts.svg;
            var yMax = opts.yMax, yMin = opts.yMin;
            var padding = opts.padding;
            var left = padding.left, right=opts.width - padding.right, top=padding.top, bottom=opts.height - padding.bottom;
            var ySeparateValue = (bottom - top) / (yMax - yMin);
            var dataList = opts.dataList;
            for (var i = 0;i < dataList.length;i++){
                var dlist = dataList[i];
                var pointSet = opts.point[i];
                if (pointSet.show){
                    for (var j = 0;j < dlist.length;j++){
                        var x = left + j * opts.dataSpacing;
                        var y = bottom - ySeparateValue * (dlist[j].y-yMin);
                        svg.paper.circle(x, y, pointSet.radius).attr({
                            fill: pointSet.stroke
                        });
                    }
                }

            }
        },
        calculateData:function(dataList){
            var opts = this.opts;
            var svg = opts.svg;
            var separateYSpacing = opts.separateYSpacing;
            var bgStyle = opts.backgroundLine;
            var padding = opts.padding;
            var left = padding.left, right=opts.width - padding.right, top=padding.top, bottom=opts.height - padding.bottom;
            if (dataList.length === 0 || dataList[0].length === 0){
                return false;
            }
            var opts = this.opts;
            var yMax = opts.yMax, yMin = opts.yMin;
            var startC = dataList[0].length - opts.dataNum;
            if (startC<0){
                startC = 0;
            }
            for (var i = 0;i<dataList.length;i++){
                dataList[i] = dataList[i].slice(startC);
                var dataItem = dataList[i];
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

            if (yMax > 0){
                this.opts.yMax = yMax * 1.025;
            }
            else if (yMax < 0){
                this.opts.yMax = yMax * 0.975;
            }
            else{
                this.opts.yMax = yMax;
            }
            if (yMin > 0){
                this.opts.yMin = (yMin * 0.975);
            }
            else if (yMin < 0){
                this.opts.yMin = (yMin * 1.025);
            }
            else{
                this.opts.yMin = yMin;
            }

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

        line:[{stroke:'#50a6ff',strokeWidth:2},{stroke:'#cf0037',strokeWidth:2}],
        point:[{show:true,stroke:'#50a6ff',radius:3},{show:false,stroke:'#cf0037',radius:2}],

        backgroundLine:{strokeWidth:1,stroke:'#efefef'},

        yMax:-9999,

        yMin:9999,

        dataList:[],

        id:'svg',

        dataSpacing:30,

        dataNum:21,

        separateYNum:5,

        separateDataNum:4,

        padding:{left:3,top:0,right:3,bottom:16},

        xAlias:{fontSize:'10px',fontFamily:'Helvetica'},

        yAlias:{strokeWidth:1}

    };

    var svgChart = function(options) {
        return new Chart(options);
    };

    window.svgChart = $.svgChart = svgChart;

})(window.jQuery || window.Zepto, window);
