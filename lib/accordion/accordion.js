/**
 * accordion
 *    アコーディオン
 */
$(function () {
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
});
