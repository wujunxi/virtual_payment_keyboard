/**
 * @author wujx
 * @date 2017-02-16
 * @version 1.0.0
 */
(function(factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define(["zepto"], factory);
    } else {
        // 全局模式
        factory(Zepto);
    }
}(function ($) {
    $.keyboard = (function () { // require keyboard.css
        var $box,
            $pay,
            opt,
            isInit = false,
            payFun = $.noop,
            returnFun = $.noop,
            changeFun = $.noop,
            inputText = "";
        var wrapObj = {
            /**
             * 初始化
             * @param _opt
             * @returns {{init: wrapObj.init, show: wrapObj.show, hide: wrapObj.hide, val: wrapObj.val, onPay: wrapObj.onPay, onReturn: wrapObj.onReturn, onChange: wrapObj.onChange}}
             */
            init: function (_opt) {
                if (isInit) return wrapObj;
                opt = $.extend({
                    maxLength: 10 // 输入长度
                }, _opt);
                var htmlStr = "";
                htmlStr += '<table class="keyboard">';
                htmlStr += '<tr class="row">';
                htmlStr += '<td class="key" data-key="1">1</td>';
                htmlStr += '<td class="key" data-key="2">2</td>';
                htmlStr += '<td class="key" data-key="3">3</td>';
                htmlStr += '<td class="key backspace" data-key="bac"></td>';
                htmlStr += '</tr>';
                htmlStr += '<tr class="row">';
                htmlStr += '<td class="key" data-key="4">4</td>';
                htmlStr += '<td class="key" data-key="5">5</td>';
                htmlStr += '<td class="key" data-key="6">6</td>';
                htmlStr += '<td class="key pay off" rowspan="3" data-key="pay"><br/>支 付</td>';
                htmlStr += '</tr>';
                htmlStr += '<tr class="row">';
                htmlStr += '<td class="key" data-key="7">7</td>';
                htmlStr += '<td class="key" data-key="8">8</td>';
                htmlStr += '<td class="key" data-key="9">9</td>';
                htmlStr += '</tr>';
                htmlStr += '<tr class="row">';
                htmlStr += '<td class="key return" data-key="ret"></td>';
                htmlStr += '<td class="key" data-key="0">0</td>';
                htmlStr += '<td class="key" data-key=".">.</td>';
                htmlStr += '</tr>';
                htmlStr += '</table>';
                // 挂载在body下
                $box = $(htmlStr).appendTo("body");
                $pay = $(".pay", $box);
                // 监听触摸事件
                $box.on("tap", ".key", function () {
                    var $this = $(this),
                        key = $this.attr("data-key");
                    if ($this.hasClass("off")) {
                        return;
                    }
                    if (key == "pay") { // 支付按钮
                        payFun();
                    } else if (key == "ret") { // 收起键盘
                        wrapObj.hide();
                        returnFun();
                    } else if (key == "bac") { // 回退
                        if (inputText.length > 0) {
                            inputText = inputText.substr(0, inputText.length - 1);
                            changeFun(inputText);
                            refresh(inputText);
                        }
                    } else if (inputText.length < opt.maxLength) { // 数字和小数点
                        var temp = inputText + key;
                        // 输入预校验
                        if (!preCheck(temp)) {
                            return;
                        }
                        inputText += key;
                        refresh(inputText);
                        changeFun(inputText);
                    }
                });
                isInit = true;
                return wrapObj;
            },
            /**
             * 显示
             * @returns {{init: wrapObj.init, show: wrapObj.show, hide: wrapObj.hide, val: wrapObj.val, onPay: wrapObj.onPay, onReturn: wrapObj.onReturn, onChange: wrapObj.onChange}}
             */
            show: function () {
                if (!isInit) this.init();
                if (!$box.hasClass("on")) {
                    $box.addClass("on");
                }
                return wrapObj;
            },
            /**
             * 隐藏
             * @returns {{init: wrapObj.init, show: wrapObj.show, hide: wrapObj.hide, val: wrapObj.val, onPay: wrapObj.onPay, onReturn: wrapObj.onReturn, onChange: wrapObj.onChange}}
             */
            hide: function () {
                if (!isInit) return;
                $box.removeClass("on");
                return wrapObj;
            },
            /**
             * 获取值
             * @param v
             * @returns {*}
             */
            val: function (v) {
                if (arguments.length > 0) {
                    inputText = v + "";
                    return wrapObj;
                } else {
                    return inputText;
                }
            },
            /**
             * 定义支付按钮事件
             * @param fun
             * @returns {{init: wrapObj.init, show: wrapObj.show, hide: wrapObj.hide, val: wrapObj.val, onPay: wrapObj.onPay, onReturn: wrapObj.onReturn, onChange: wrapObj.onChange}}
             */
            onPay: function (fun) {
                payFun = fun;
                return wrapObj;
            },
            /**
             * 定义返回按钮事件
             * @param fun
             * @returns {{init: wrapObj.init, show: wrapObj.show, hide: wrapObj.hide, val: wrapObj.val, onPay: wrapObj.onPay, onReturn: wrapObj.onReturn, onChange: wrapObj.onChange}}
             */
            onReturn: function (fun) {
                returnFun = fun;
                return wrapObj;
            },
            /**
             * 定义输入变动事件
             * @param fun
             * @returns {{init: wrapObj.init, show: wrapObj.show, hide: wrapObj.hide, val: wrapObj.val, onPay: wrapObj.onPay, onReturn: wrapObj.onReturn, onChange: wrapObj.onChange}}
             */
            onChange: function (fun) {
                changeFun = fun;
                return wrapObj;
            }
        };
        return wrapObj;
        /**
         * 键盘状态更新
         * @param t
         */
        function refresh(t) {
            // 判断是否让支付按钮可用，校验格式为数字和小数点组成，允许两位小数
            if (/^(\d|([1-9]\d+))(.\d{1,2})?$/.test(t)) {
                $pay.removeClass("off");
            } else {
                $pay.addClass("off");
            }
        }
        /**
         * 输入预处理
         * @param t
         * @returns {boolean}
         */
        function preCheck(t) {
            var i, len, hasFlag, n;
            if (t.length > 0) {
                // 小数点不能作为开头
                if (t[0] == ".") {
                    return false;
                }
                hasFlag = false;
                n = 0;
                for (i = 0, len = t.length; i < len; i++) {
                    // 输入的是小数点
                    if (t[i] == ".") {
                        // 不能有多个小数点
                        if (hasFlag) {
                            return false;
                        } else {
                            hasFlag = true;
                        }
                    } else {
                        // 限制两位小数
                        if (hasFlag) {
                            if (n > 1) {
                                return false;
                            } else {
                                n++;
                            }
                        }
                    }
                }
            }
            return true;
        }
    })();
}));