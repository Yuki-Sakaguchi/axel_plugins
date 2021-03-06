(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
/**
 * accordion
 *    アコーディオン
 */
Object.defineProperty(exports, "__esModule", { value: true });
function accordion() {
    // 定数
    var accordionTitleClass = 'js-accordion-title';
    var accordionBodyClass = 'js-accordion-body';
    var className = 'js-open';
    // titleに処理追加
    $("." + accordionTitleClass).each(function (i, e) {
        var $this = $(e);
        var $body = $this.next("." + accordionBodyClass);
        // js-openクラスが付いている要素は初めから開いておく
        if ($this.hasClass(className)) {
            $body.show();
        }
        // クリックで開閉する
        $this.on('click', function () {
            $this.toggleClass(className);
            $body.slideToggle();
        });
    });
}
exports.accordion = accordion;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jquery_accordion_1 = require("./accordion/jquery.accordion");
var jquery_protectImg_1 = require("./protectImg/jquery.protectImg");
/**
 *  アコーディオン
 */
jquery_accordion_1.accordion();
/**
 * 画像プロテクト
 */
jquery_protectImg_1.protectImg(jQuery);
$(function () {
    $(".aem-post").find("img").wrap('<span class="js-protect">');
    $('.js-protect').aemProtectImage();
});

},{"./accordion/jquery.accordion":1,"./protectImg/jquery.protectImg":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function protectImg($) {
    $.fn.aemProtectImage = function (options) {
        var $window = $(window);
        // 初期設定
        var _defaultOptions = {
            disableContextmenu: false,
            blankImg: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
            blankImgClassName: 'blank-img',
            zIndex: 1000,
            betweenContent: null,
        };
        // 設定を更新
        if (options) {
            options = $.extend(options, _defaultOptions);
        }
        // ダミー画像作成
        var img = new Image();
        img.src = options.blankImg;
        img.className = options.blankImgClassName;
        // ダミー画像を複製
        var rawImg = img.cloneNode();
        // 右クリック禁止モードの場合
        if (options.disableContextmenu) {
            $window.on('contextmenu', function () { return false; });
        }
        // 実行
        this.each(function (i, e) {
            var $this = $(e);
            // 右クリック禁止
            $this.on('contentmenu', function () { return false; });
            // 自分がimgタグの場合
            if (e.tagName.toLocaleLowerCase() === 'img') {
                $this.on('load', function (e) {
                    setupImgTag(e);
                });
                // ロード済みの場合はloadイベントを発火
                if (e.complete) {
                    $this.trigger('load');
                }
            }
            // cssの調整
            var pos = $this.css('position');
            if (pos != 'absolute' && pos !== 'relative') {
                $this.css('position', 'relative');
                if ($this.css('display') === 'inline') {
                    $this.css('display', 'inline-block');
                }
            }
            // コピー
            var $clone = $(img).clone().css({
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%'
            });
            // 一緒に追加したい要素があればそれを追加
            if (options.betweenContent) {
                $this.append(options.betweenContent, $clone);
            }
            else {
                $this.append($clone);
            }
        });
        /**
         * ダミー画像をセット
         * @param target
         */
        function setupImgTag(target) {
            var $this = $(target);
            var pos = $this.position();
            var imgW = $this.width();
            var imgH = $this.height();
            $(rawImg.cloneNode()).attr({
                width: imgW,
                height: imgH
            }).css({
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                zIndex: options.zIndex,
                width: imgW,
                height: imgH
            }).appendTo('body');
        }
    };
}
exports.protectImg = protectImg;
/*

動かし方

$(function() {
  $('.js-protect').aemProtectImage({
      blankImg: '/img/blank.gif'
  });

  $(".aem-post").find("img").wrap('<span class="js-protect">');
  $('.js-protect').aemProtectImage({
      blankImg: '/img/blank.gif'
  });
});

*/ 

},{}]},{},[2]);
