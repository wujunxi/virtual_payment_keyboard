/**
     * 虚拟支付键盘
     */
    exports.keyboard = (function () { // require keyboard.css
        var $box,
            $pay,
            opt,
            isInit = false,
            payFun = $.noop,
            returnFun = $.noop,
            changeFun = $.noop,
            inputText = "";
        var wrapObj = {
            init: function (_opt) {
                if (isInit) return wrapObj;
                opt = $.extend({
                    maxLength: 10
                }, _opt);
                var htmlStr = "";
                htmlStr += '<div class="keyboard">';
                htmlStr += '<div class="column">';
                htmlStr += '<span class="key" data-key="1">1</span>';
                htmlStr += '<span class="key" data-key="4">4</span>';
                htmlStr += '<span class="key" data-key="7">7</span>';
                htmlStr += '<span class="key return" data-key="ret"></span>';
                htmlStr += '</div>';
                htmlStr += '<div class="column">';
                htmlStr += '<span class="key" data-key="2">2</span>';
                htmlStr += '<span class="key" data-key="5">5</span>';
                htmlStr += '<span class="key" data-key="8">8</span>';
                htmlStr += '<span class="key" data-key="0">0</span>';
                htmlStr += '</div>';
                htmlStr += '<div class="column">';
                htmlStr += '<span class="key" data-key="3">3</span>';
                htmlStr += '<span class="key" data-key="6">6</span>';
                htmlStr += '<span class="key" data-key="9">9</span>';
                htmlStr += '<span class="key" data-key=".">.</span>';
                htmlStr += '</div>';
                htmlStr += '<div class="column">';
                htmlStr += '<span class="key backspace" data-key="bac"></span>';
                htmlStr += '<span class="key rows-3 pay off" data-key="pay">支 付</span>';
                htmlStr += '</div>';
                htmlStr += '</div>';
                $box = $(htmlStr).appendTo("body");
                $pay = $(".pay", $box);
                $box.on("click", ".key", function () {
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
                    } else if (inputText.length < opt.maxLength) {
                        inputText += key;
                        refresh(inputText);
                        changeFun(inputText);
                    }
                });
                isInit = true;
                return wrapObj;
            },
            show: function () {
                if (!isInit) this.init();
                if (!$box.hasClass("on")) {
                    $box.addClass("on");
                }
                return wrapObj;
            },
            hide: function () {
                if (!isInit) return;
                $box.removeClass("on");
                return wrapObj;
            },
            val: function (v) {
                if (arguments.length > 0) {
                    inputText = v + "";
                    return wrapObj;
                } else {
                    return inputText;
                }
            },
            onPay: function (fun) {
                payFun = fun;
                return wrapObj;
            },
            onReturn: function (fun) {
                returnFun = fun;
                return wrapObj;
            },
            onChange: function (fun) {
                changeFun = fun;
                return wrapObj;
            }
        };
        return wrapObj;
        function refresh(t) {
            // 判断是否让支付按钮可用
            if (/^(\d|([1-9]\d+))(.\d{1,2})?$/.test(t)) {
                $pay.removeClass("off");
            } else {
                $pay.addClass("off");
            }
        }
    })();