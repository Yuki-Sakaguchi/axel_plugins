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

/**
 * view
 *    スクロールに応じて処理をさせる
 */
var View = /** @class */ (function () {
    // コンストラクタ
    function View(selector, options) {
        var _this = this;
        // オプション
        this._options = {
            offset: '0',
            test: null,
            scrollEnd: false,
            addClassName: 'active',
            callback: null
        };
        // ターゲット取得
        if (typeof selector === 'string') {
            this._elTarget = document.querySelectorAll(selector);
        }
        else if (typeof selector === 'object') {
            this._elTarget = selector;
        }
        else {
            throw new Error('対象が取得できませんでした。');
        }
        // オプションのセット
        if (options) {
            if (typeof options === 'object') {
                Object.keys(options).forEach(function (key) {
                    _this._options[key] = options[key];
                });
            }
            else if (typeof options === 'string') {
                this._options['addClassName'] = options;
            }
            else if (typeof options === 'function') {
                this._options['callback'] = options;
            }
            else {
                console.warn(this.constructor.name + " [warn]: \u7B2C\uFF12\u5F15\u6570\u304C\u7121\u8996\u3055\u308C\u307E\u3057\u305F\u3002\u7B2C\uFF12\u5F15\u6570\u306B\u306F\u30AF\u30E9\u30B9\u540D\u3001\u30B3\u30FC\u30EB\u30D0\u30C3\u30AF\u95A2\u6570\u3001\u307E\u305F\u306F\u305D\u308C\u3089\u3092\u542B\u3080\u30AA\u30D7\u30B7\u30E7\u30F3\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
            }
        }
        // ロード完了後、処理実行
        window.addEventListener('load', function () {
            _this.execute();
        });
    }
    /**
     * メイン処理
     */
    View.prototype.execute = function () {
        // テスト用のラインを生成
        if (this._options.test) {
            this.createTest();
        }
        // 対象にイベントを追加
        for (var i = 0, len = this._elTarget.length; i < len; i++) {
            var target = {
                element: this._elTarget[i],
                isSuccess: false,
                eventPosition: 0
            };
            this.setEvent(target);
        }
    };
    /**
     * テスト用のラインを作成
     */
    View.prototype.createTest = function () {
        // ラインエレメントを作成
        var el = document.createElement('div');
        el.textContent = 'Event line';
        el.style.position = 'fixed';
        el.style.width = '100%';
        el.style.borderBottom = '1px solid ' + this._options.test;
        el.style.fontSize = '10px';
        el.style.letterSpacing = '3px';
        el.style.lineHeight = '1';
        el.style.paddingLeft = '3px';
        el.style.color = this._options.test;
        el.style.left = '0';
        el.style.zIndex = '99999999';
        if (this._options.offset.indexOf('%') != -1) {
            // パーセント指定された場合
            el.style.top = (100 - parseInt(this._options.offset.replace('%', ''))) + '%';
        }
        else if (this._options.offset.indexOf('px') != -1) {
            // pxで指定された場合
            el.style.bottom = this._options.offset;
        }
        else {
            // 数字だけで指定された場合
            el.style.bottom = this._options.offset + 'px';
        }
        document.body.appendChild(el);
    };
    /**
     * イベントを追加
     */
    View.prototype.setEvent = function (target) {
        // イベント発火の高さを取得
        this.setEventPoition(target);
        // 発火
        this.fire(target);
        // リサイズ
        this.resizeHandle(target);
        // スクロール
        this.scrollHandle(target);
    };
    /**
     * イベント発火位置を取得
     */
    View.prototype.setEventPoition = function (target) {
        if (this._options.offset.indexOf('%') != -1) {
            var par = parseInt(this._options.offset.replace('%', ''));
            var offset = window.innerHeight * (par / 100);
            target.eventPosition = target.element.getBoundingClientRect().top - window.innerHeight + offset + window.pageYOffset;
        }
        else if (this._options.offset.indexOf('px') != -1) {
            target.eventPosition = target.element.getBoundingClientRect().top - window.innerHeight + window.pageYOffset + parseInt(this._options.offset.replace('px', ''));
        }
        else {
            target.eventPosition = target.element.getBoundingClientRect().top - window.innerHeight + window.pageYOffset + parseInt(this._options.offset);
        }
    };
    /**
     * イベント発火
     */
    View.prototype.fire = function (target) {
        // 表示されたらcallbackを動かす
        if (target.eventPosition < window.pageYOffset) {
            this.addClass(target.element);
            if (typeof this._options.callback === 'function') {
                this._options.callback(target.element);
            }
            target.isSuccess = true;
        }
        // 最後まで行った場合、まだイベントが起きていなかったらうごかす
        if (this._options.scrollEnd) {
            if (document.body.clientHeight - window.innerHeight < window.pageYOffset) {
                if (!target.isSuccess) {
                    this.addClass(target.element);
                    if (typeof this._options.callback === 'function') {
                        this._options.callback(target.element);
                    }
                    target.isSuccess = true;
                }
            }
        }
    };
    /**
     * リサイズイベント
     */
    View.prototype.resizeHandle = function (target) {
        var _this = this;
        var timer;
        window.addEventListener('resize', function () {
            if (timer)
                clearTimeout(timer);
            timer = setTimeout(function () {
                _this.setEventPoition(target);
            }, 100);
        });
    };
    /**
     * スクロールイベント
     */
    View.prototype.scrollHandle = function (target) {
        var _this = this;
        window.addEventListener('scroll', function () {
            if (target.isSuccess) {
                return false;
            }
            _this.fire(target);
        });
    };
    /**
     * 対象にクラスを追加
     */
    View.prototype.addClass = function (elTarget) {
        if (!this._options.addClassName) {
            // 付けるクラスがない場合は終了
            return false;
        }
        if (elTarget.className) {
            elTarget.className += ' ' + this._options.addClassName;
        }
        else {
            elTarget.className += this._options.addClassName;
        }
    };
    return View;
}());
