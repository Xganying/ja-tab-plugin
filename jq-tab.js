(function($){

    var Tab = function(tab){
        
        var _this_ = this;
        
        // 保存单个tab组件
        this.tab = tab;
        
        // 默认配置参数
        this.config = {
            "trifferType": "click",  // 触发事件类型
            "effect": "default",     // 切换效果，default:默认，直接切换，fade:淡入淡出 
            "invoke": 1,             // 默认刚开始时候，显示哪一块内容 
            "auto":false            // 是否自动切换，false:无自动切换，数字则表示自动切换间隔时间 
        }
       
        // 如果配置参数存在，则扩展掉默认的配置参数
        if(this.getConfig()){
            $.extend(this.config, this.getConfig());
        }

        // 保存tab标签列表和对应的内容列表
        this.tabItems = this.tab.find('ul.tab-nav li');
        this.contentItems = this.tab.find('div.content-wrap div.content-item');

        // 保存配置参数
        var config = this.config;

        // 切换事件绑定
        if(config.trifferType === "click"){
            this.tabItems.bind(config.trifferType, function(){
                // 内容的切换以及相应的切换效果
                _this_.invoke($(this)); 
            });
        }else if(config.trifferType === "mouseover" || config.trifferType != "click" ){
            //  _this_.invoke($(this)); 
            this.tabItems.mouseover(function(){
                var self = $(this);
                this.timer = window.setTimeout(function(){
                    _this_.invoke(self);
                },300);
            }).mouseout(function(){
                window.clearTimeout(this.timer);
            });
        }

        // 自动切换
        if(config.auto){
            // 定义一个全局的定时器
            this.timer = null;
            // 计算器
            this.loop = 0;
            this.autoPlay();
            // 鼠标移动到按钮上时，移除自动切换效果
            this.tab.hover(function(){
                window.clearInterval(_this_.timer);
            }, function(){
                _this_.autoPlay();
            })
        }

        // 设置默认显示第几个Tab
        if(config.invoke > 1){
            this.invoke(this.tabItems.eq(config.invoke - 1));
        }

    };

    Tab.prototype = {

        // 获取配置参数
        getConfig: function(){
           
            // 获取tab elem 节点上的data-config
            var config = this.tab.attr('data-config');
            
            // 确保有配置参数
            if(config && config != ""){
                return $.parseJSON(config); // 转换成一个对象
            }else{
                return null;
            }
        },

        // 自动切换函数
        autoPlay:function(){
            var _this_ = this,
                tabItems = this.tabItems,      // 临时保存tab列表
                tabLength = tabItems.length,   // tab的个数
                config = this.config;

            this.timer = window.setInterval(function(){
                _this_.loop++;
                if(_this_.loop >= tabLength){
                    _this_.loop  = 0;
                }
                tabItems.eq(_this_.loop).trigger(config.trifferType);
            },config.auto);
        },

        // 事件驱动函数（切换时调用的函数，内容的切换以及相应的切换效果）
        invoke:function(currentTab){
            var _this_ = this;
            var index = currentTab.index();

            // 执行Tab的选中状态，当前选中的就加上actived类（标记为白底）
            currentTab.addClass("actived").siblings().removeClass("actived");
            
            // 切换对应的Tab内容，切换效果根据配置参数的effect是default还是fade
            var effect = this.config.effect;
            var conItems = this.contentItems;
            if(effect === "default" || effect != "fade"){
                conItems.eq(index).addClass("current").siblings().removeClass("current");
            }else if(effect === "fade"){
                conItems.eq(index).fadeIn().siblings().fadeOut();                
            }

            // 如果配置了自动切换，要把当前的计数器的值loop设置成当当前的tab的值
            if(this.config.auto){
                this.loop = index;
            }
        }
       
    }

    // 初始化函数
    Tab.init = function(tabs){
        var _this_ = this;
        tabs.each(function(){
            new _this_($(this));
        })
    }

    // 注册成jQuery方法
    $.fn.extend({
        tab:function(){
            this.each(function(){
                new Tab($(this));
            });
        return this;
        }
    })

    window.Tab = Tab;

})(jQuery);