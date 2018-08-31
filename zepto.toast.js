;(function($, window, undefined) {
    
    var win = $(window);
    var T = {intervalCounter:0};
    var Toast = function(options) {
        
        this.settings = $.extend({}, Toast.defaults, options);
        
        this._init();
        
    };
    
    Toast.prototype = {
        
        options: {
            // msg:null
        },

        _init: function(){
            // var me = this,
            // opts = me._options;
            // this._show(opts.msg);
        },

        hideToast : function(){

            var alert = $("#toast");

            alert.velocity("fadeOut",{duration: 1000});
            setTimeout(function(){alert.hide();}, 1000);

            clearInterval(T.intervalCounter);

        },

        //显示动画
        show :function(message){
            var alert = $("#toast");
            if (alert || alert.length > 0){
                alert.remove();
            }
            var toastHTML = '<div id="toast">' + message + '</div>';
            document.body.insertAdjacentHTML('beforeEnd', toastHTML);
            var toastobj = $('#toast');
            var tToLeft = (commonLib.winw - toastobj.width()) / 2;
            var tToTop = (commonLib.winh - toastobj.height()) / 2;
            toastobj.css({'top':tToTop + 'px', 'left': tToLeft + 'px'});
            toastobj.velocity("fadeIn",{duration: 1000});
            T.intervalCounter = setInterval(this.hideToast, 3000);
        },


        //显示动画
        showControlTime :function(message, ts){
            var alert = $("#toast");
            if (alert || alert.length > 0){
                alert.remove();
            }
            // if (alert == null || alert.length <= 0){
            var toastHTML = '<div id="toast">' + message + '</div>';
            document.body.insertAdjacentHTML('beforeEnd', toastHTML);
            var toastobj = $('#toast');
            var tToLeft = (commonLib.winw - toastobj.width()) / 2;
            var tToTop = (commonLib.winh - toastobj.height()) / 2;
            toastobj.css({'top':tToTop + 'px', 'left': tToLeft + 'px'});
            toastobj.velocity("fadeIn",{duration: 1000});
            T.intervalCounter = setInterval(this.hideToast, ts);
        },

        //显示动画
        showWithoutDisplay :function(message){
            var alert = $("#toast");
            if (alert || alert.length > 0){
                alert.remove();
            }
            var toastHTML = '<div id="toast">' + message + '</div>';
            document.body.insertAdjacentHTML('beforeEnd', toastHTML);
            var toastobj = $('#toast');
            var tToLeft = (commonLib.winw - toastobj.width()) / 2;
            var tToTop = (commonLib.winh - toastobj.height()) / 2;
            toastobj.css({'top':tToTop + 'px', 'left': tToLeft + 'px'});
            toastobj.velocity("fadeIn",{duration: 1000});
            $(document.body).css("overflow","hidden");
        },
        showWithoutDisplayMutil :function(message1,message2){
            var alert = $("#toast");
            if (alert || alert.length > 0){
                alert.remove();
            }
            var toastHTML = '<div id="toast">';
            toastHTML += '<div class="toast-msg" style="margin-top: 22px;">' + message1 + '</div>';
            toastHTML += '<div class="toast-msg">' + message2 + '</div>';
            document.body.insertAdjacentHTML('beforeEnd', toastHTML);
            var toastobj = $('#toast');
            var tToLeft = (commonLib.winw - toastobj.width()) / 2;
            var tToTop = (commonLib.winh - toastobj.height()) / 2;
            toastobj.css({'top':tToTop + 'px', 'left': tToLeft + 'px'});
            toastobj.velocity("fadeIn",{duration: 1000});
            $(document.body).css("overflow","hidden");
        },
        hideToastByMe : function(){

            var alert = $("#toast");

            alert.velocity("fadeOut",{duration: 500});
            setTimeout(function(){alert.hide();}, 500);
            $(document.body).css("overflow","auto");
            $("html").css("overflow","auto");
        },

    };
    
    /**
     * 默认配置
     */
    Toast.defaults = {

    };
    
    var rToast = function(options) {
        return new Toast(options);
    };
    
    window.Toast = $.Toast = rToast;
    
})(window.jQuery || window.Zepto, window);
