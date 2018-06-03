"use strict";

import {accordion} from './accordion/jquery.accordion';
import {protectImg} from './protectImg/jquery.protectImg';
import {View} from './view/jquery.view';

/**
 *  アコーディオン
 */
accordion();


/**
 * 画像プロテクト
 */
protectImg(jQuery);
$(() => {
  $(".aem-post").find("img").wrap('<span class="js-protect">');
  $('.js-protect').aemProtectImage();
});