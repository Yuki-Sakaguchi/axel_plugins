/**
 * accordion
 *    アコーディオン
 */

export function accordion() {
    // 定数
    const accordionTitleClass = 'js-accordion-title';
    const accordionBodyClass = 'js-accordion-body';
    const className = 'js-open';

  	// titleに処理追加
    $(`.${accordionTitleClass}`).each((i: number, e: HTMLElement) => {
        let $this = $(e);
        let $body = $this.next(`.${accordionBodyClass}`);

        // js-openクラスが付いている要素は初めから開いておく
        if ($this.hasClass(className)) {
            $body.show();
        }

        // クリックで開閉する
        $this.on('click', () => {
            $this.toggleClass(className);
            $body.slideToggle();
        });
    });
}

