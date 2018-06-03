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
