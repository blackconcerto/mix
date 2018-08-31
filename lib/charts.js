var LineChart={
    keynames:[],//数据信息数组
    can:undefined,
    ctx:undefined,
    width:undefined,
    lineColor:undefined,
    dotColor:undefined,
    isBg:false,
    isMultiData:false,
    splitNumber:1,
    lineSets:[],
    paddingArr:[],
    data:undefined,
    padding:0,
    setData:function(canId,data,padding,lineColor,dotColor,isBg,isMultiData,splitNumber){
        this.lineColor = lineColor;
        this.dotColor = dotColor;
        this.can = document.getElementById(canId);
        this.ctx = this.can.getContext("2d");
        this.isBg = isBg;
        this.isMultiData = isMultiData;
        this.splitNumber = splitNumber;
        this.padding=padding;
        this.data=data;
    },
    drawCombination:function(){
        this.drawXY_Combination(this.data,0,this.padding,this.can);
    },
    setLineData:function(d){
        this.lineSets=d;
    },
    /**
     * [p1,p2,p3,p4],和css中的padding一样，分别显示上，右，下，左
     * @param arr
     */
    setPaddingArr:function(arr){
        this.paddingArr = arr;
    },
    isMultiData:function(data){
        if(data.values.length>1){
            this.isMultiData = true;
        }
    },//是否是多条数据线

    drawXY:function(data,key,padding,can){
        this.ctx.lineWidth="2";
        this.ctx.strokeStyle="black";
        this.ctx.font = '15px sans-serif';
        this.ctx.beginPath();
        this.ctx.moveTo(padding,0)
        this.ctx.lineTo(padding,can.height-padding);
        this.ctx.lineTo(can.width,can.height-padding);
        this.ctx.stroke();
        var perwidth = this.getPixel(data,key,can.width,padding);//x 轴每一个数据占据的宽度
        var maxY =  this.getMax(data,0,this.isMultiData);//获得Y轴上的最大值
        var yPixel = this.getYPixel(maxY,can.height,padding).pixel;
        var ycount = this.getYPixel(maxY,can.height,padding).ycount;
        var textWidth = perwidth * this.splitNumber;
        for( var i=0,ptindex;i< data.values[key]["value"+key].length/this.splitNumber;i++ ){
            ptindex = i+1;
            var x_x = this.getCoordX(padding,textWidth,ptindex);
            var x_y = can.height-padding+20;
            this.ctx.fillText(data.values[key]["value"+key][i].x,x_x,x_y,perwidth);
        }
        this.ctx.textAlign = "right";//y轴文字靠右写
        this.ctx.textBaseline = "middle";//文字的中心线的调整
        var yIndexVal = can.width-2;
        for(var i=0;i< ycount/10;i++){
            this.ctx.fillText(i*10,yIndexVal,(ycount/10-i)*10*yPixel,perwidth);
        }
        if(this.isBg){
            var x =  padding;
            this.ctx.lineWidth="1";
            //this.ctx.strokeStyle="#e8e8e8";
            for( var i=0;i< ycount/10;i++ ){
                var y = (ycount/10-i)*10*yPixel;
                this.ctx.moveTo(x,y);
                this.ctx.lineTo(can.width,y);
                this.ctx.stroke();
            }
        }//选择绘制背景线
        this.ctx.closePath();
        this.drawData(data,0,padding,perwidth,yPixel,this.isMultiData);
    },//绘制XY坐标 线 以及点

    drawXY_Combination:function(data,key,padding,can){
        this.ctx.lineWidth="2";
        //this.ctx.strokeStyle="#333333";
        this.ctx.font = '12px Helvetica';
        this.ctx.beginPath();
        var xPadding = padding, yPadding = padding;
        if (this.paddingArr && this.paddingArr.length > 3){
            xPadding = padding + this.paddingArr[1]+this.paddingArr[3];
            yPadding = padding + this.paddingArr[0]+this.paddingArr[2];
        }
        var perwidth = this.getPixel(data,key,can.width,xPadding);//x 轴每一个数据占据的宽度
        var maxY =  this.getMax(data,0,this.isMultiData);//获得Y轴上的最大值
        var minY = this.getMin(data, 0, this.isMultiData);
        var tmax = maxY;
        var tminY = minY;
        if (tmax > 0){
            tmax = tmax * 1.1;
        }
        else{
            tmax = tmax * 0.9;
        }
        if (tminY > 0){
            tminY = tminY * 0.9;
        }
        else{
            tminY = tminY * 1.1;
        }
        var yCeil = Math.ceil(tmax * 100);
        var yFloor = Math.floor(tminY * 100);
        var valDis = (tmax - tminY);
        var yPixel = this.getCmbYPixel(valDis,can.height,yPadding).pixel;

        var textWidth = perwidth * this.splitNumber;
        var lineBackSeting = [];
        for( var i=0;i< data.values[key]["value"+key].length/this.splitNumber;i++ ){
            var x_x = this.getCoordX(padding,textWidth,i);
            this.ctx.fillText(data.values[key]["value"+key][i*this.splitNumber].x,x_x,this.can.height,perwidth);
            lineBackSeting.push(x_x)
        }
        this.ctx.textAlign = "right";//y轴文字靠右写
        this.ctx.textBaseline = "middle";//文字的中心线的调整


        var dis = parseInt((yCeil - yFloor) / 4);
        var yIndexVal = can.width-2;
        var p3 = padding, p1 = padding;;
        if (this.paddingArr.length > 3){
            p1=this.paddingArr[0];
            p3 = this.paddingArr[2];
        }
        var cHeight = (this.can.height - p3-p1);
        var yhdis = cHeight / 4;
        var fontOffset = 5;
        this.ctx.fillText(yCeil + '%',yIndexVal,p1+5);
        this.ctx.fillText(yCeil-dis + '%',yIndexVal,p1+yhdis-fontOffset);
        this.ctx.fillText(yCeil-2*dis + '%',yIndexVal,p1+2*yhdis-fontOffset);
        this.ctx.fillText(yCeil-3*dis + '%',yIndexVal,p1+3*yhdis-fontOffset);
        this.ctx.fillText(yFloor+ '%',yIndexVal ,p1+cHeight-fontOffset);


        if(this.isBg){
            var x1 =  padding, x2 = padding;

            if (this.paddingArr.length > 3){
                x1=this.paddingArr[3];
                x2 = this.paddingArr[1];
            }
            this.ctx.lineWidth="1";
            //this.ctx.strokeStyle="#efefef";
            var ly1 = this.can.height - this.paddingArr[2];
            var ly2 = this.paddingArr[0];
            this.ctx.moveTo(padding,ly1);
            this.ctx.lineTo(padding,ly2);
            this.ctx.stroke();

            for (var j = 1;j < lineBackSeting.length;j++){
                var lx = lineBackSeting[j] + 5;
                this.ctx.dashedLineTo(lx,ly1, lx, ly2,5);
                //this.ctx.stroke();
            }
            var right1 = can.width-x2;
            x1 = x1 + 5;
            this.ctx.moveTo(x1,p1);
            this.ctx.lineTo(right1,p1);
            //this.ctx.stroke();

            this.ctx.moveTo(x1,p1+yhdis);
            this.ctx.lineTo(right1,p1+yhdis);
            this.ctx.stroke();

            this.ctx.lineWidth=1;
            this.ctx.moveTo(x1,p1+yhdis*2);
            this.ctx.lineTo(right1,p1+yhdis*2);
            //this.ctx.stroke();


            this.ctx.moveTo(x1,p1+yhdis*3);
            this.ctx.lineTo(right1,p1+yhdis*3);
            //this.ctx.stroke();


            this.ctx.moveTo(x1,p1+yhdis*4);
            this.ctx.lineTo(right1,p1+yhdis*4);
            this.ctx.stroke();
        }//选择绘制背景线
        this.ctx.closePath();
        this.drawData(data,0,padding,perwidth,yPixel,this.isMultiData,minY);
    },//绘制XY坐标 线 以及点


    drawData:function(data,key,padding,perwidth,yPixel,isMultiData,baseY,lineSet){
        if(!isMultiData){
            var keystr = "value"+key;
            this.ctx.beginPath();
            this.ctx.lineWidth=2;
            this.ctx.strokeStyle=this.lineColor;
            if(lineSet && lineSet.length > 1){
                this.ctx.strokeStyle=lineSet[0];
                this.ctx.lineWidth=lineSet[1];
            }
            var xPadding = padding, yPadding = padding;
            if (this.paddingArr && this.paddingArr.length > 3){
                xPadding = padding + this.paddingArr[1]+this.paddingArr[3];
                yPadding = padding + this.paddingArr[0]+this.paddingArr[2];
            }


            var startX = this.getCoordX(xPadding,perwidth,0);
            var startY = this.getCoordY(yPadding,yPixel,data.values[key][keystr][0].y - baseY);
            this.ctx.beginPath();

            for( var i=0;i< data.values[key][keystr].length;i++ ){
                var x = this.getCoordX(xPadding,perwidth,i) + 5;
                var cPoint = data.values[key][keystr][i].y;
                var y = this.getCoordY(yPadding,yPixel,cPoint - baseY);
                this.ctx.lineTo(x,y);
            }
            this.ctx.stroke();
            this.ctx.closePath();
            /*下面绘制数据线上的点*/

            if (lineSet.length > 3 && lineSet[3]){
                this.ctx.beginPath();
                if(lineSet && lineSet.length > 2){
                    this.ctx.fillStyle=lineSet[2];
                }
                for( var i=0;i< data.values[key][keystr].length;i++ ){
                    var x = this.getCoordX(xPadding,perwidth,i) + 5;
                    var cPoint = data.values[key][keystr][i].y;
                    var y = this.getCoordY(yPadding,yPixel,cPoint-baseY);
                    this.ctx.moveTo(x,y);
                    this.ctx.arc(x,y,3,0,Math.PI*2,true);//绘制数据线上的点
                    this.ctx.fill();
                }
                this.ctx.closePath();
            }

        }else{//如果是多条数据线
            for( var i=0;i< data.values.length;i++ ){
                var lineSet = this.lineSets[i];
                if (lineSet && lineSet.length > 0){
                    LineChart.drawData(data,i,padding,perwidth,yPixel,false,baseY,lineSet);
                    LineChart.drawKey(lineSet[0],this.keynames[i],padding,i);
                }
                else{
                    var color = "rgb("+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+")";
                    var l = [color,1];
                    LineChart.drawData(data,i,padding,perwidth,yPixel,false,baseY,l);
                    LineChart.drawKey(color,this.keynames[i],padding,i);
                }

            }
        }
    },//绘制数据线和数据点
    getPixel:function(data,key,width,padding){
        var count = data.values[key]["value"+key].length;
        return (width-padding)/(count);
    },//宽度
    getPixelBK:function(data,key,width,padding){
        var count = data.values[key]["value"+key].length;
        return (width-20-padding)/(count+(count-1)*1.5);
    },//宽度
    getCoordXP:function(padding,perwidth,ptindex){//下标从1开始 不是从0开始
        return 2.5*perwidth*ptindex+padding+5-perwidth;
    },//横坐标X 随ptindex 获得
    getCoordX:function(padding,perwidth,ptindex){//下标从1开始 不是从0开始
        return perwidth*ptindex;
    },//横坐标X 随ptindex 获得
    getCoordY:function(padding,yPixel,value){
        var y = yPixel*value;
        return this.can.height-padding-y;
    },//纵坐标X 随ptindex 获得(注意 纵坐标的算法是倒着的因为原点在最上面)
    getYPixel:function(maxY,height,padding){
        var ycount = (parseInt(maxY/10)+1)*10+5;//y轴最大值
        return {pixel:(height-padding)/ycount,ycount:ycount};
    },//y轴的单位长度
    getCmbYPixel:function(maxY,height,padding){
        return {pixel:(height-padding)/maxY,ycount:maxY};
    },//combination，y轴的单位长度
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

    setKey:function(keynames){//keynames 是数组
        for(var i=0;i< keynames.length;i++){
            this.keynames.push(keynames[i]);//存入数组中
        }
    },

    drawKey:function(color,keyname,padding,lineindex){
        var x = padding+10;
        var y = this.can.height - padding+20+13*(lineindex+1);
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.font="20px";
        this.ctx.moveTo(x,y);
        this.ctx.lineTo(x+50,y);
        this.ctx.fillText(":"+keyname,x+80,y,30);
        this.ctx.stroke();
        this.ctx.closePath();
    }
};

CanvasRenderingContext2D.prototype.dashedLineTo = function (fromX, fromY, toX, toY, pattern) {
    // default interval distance -> 5px
    if (typeof pattern === "undefined") {
        pattern = 5;
    }
    // calculate the delta x and delta y
    var dx = (toX - fromX);
    var dy = (toY - fromY);
    var distance = Math.floor(Math.sqrt(dx*dx + dy*dy));
    var dashlineInteveral = (pattern <= 0) ? distance : (distance/pattern);
    var deltay = (dy/distance) * pattern;
    var deltax = (dx/distance) * pattern;

    // draw dash line
    this.beginPath();
    for(var dl=0; dl< dashlineInteveral; dl++) {
        if(dl%2) {
            this.lineTo(fromX + dl*deltax, fromY + dl*deltay);
        } else {
            this.moveTo(fromX + dl*deltax, fromY + dl*deltay);
        }
    }
    this.stroke();
};