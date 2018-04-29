/**
 * view
 *    スクロールに応じて処理をさせる
 */
class View {
  // 対象のelement
  private _elTarget: any;

  // オプション
  private _options: Options = {
    offset: '0',
    test: null,
    scrollEnd: false,
    addClassName: 'active',
    callback: null
  };

  // コンストラクタ
  constructor(selector: string | HTMLElement, options?: Object | string | (() => any)) {
    // ターゲット取得
    if (typeof selector === 'string') {
      this._elTarget = document.querySelectorAll(selector);
    } else if (typeof selector === 'object') {
      this._elTarget = selector;
    } else {
      throw new Error('対象が取得できませんでした。');
    }

    // オプションのセット
    if (options) {
      if (typeof options === 'object') {
        Object.keys(options).forEach((key) => {
          this._options[key] = options[key];
        });
      } else if (typeof options === 'string') {
        this._options['addClassName'] = options;
      } else if (typeof options === 'function') {
        this._options['callback'] = options;
      } else {
        console.warn(`${this.constructor.name} [warn]: 第２引数が無視されました。第２引数にはクラス名、コールバック関数、またはそれらを含むオプションを設定してください。`)
      }
    }

    // ロード完了後、処理実行
    window.addEventListener('load', () => {
      this.execute();
    });
  }

  /**
   * メイン処理
   */
  private execute() {
    // テスト用のラインを生成
    if (this._options.test) {
      this.createTest();
    }

    // 対象にイベントを追加
    for (let i = 0, len = this._elTarget.length; i < len; i++) {
      let target: Target = {
        element: this._elTarget[i],
        isSuccess: false,
        eventPosition: 0
      }
      this.setEvent(target);
    }
  }

  /**
   * テスト用のラインを作成
   */
  private createTest() {
    // ラインエレメントを作成
    let el = document.createElement('div');
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
    } else if (this._options.offset.indexOf('px') != -1) {
      // pxで指定された場合
      el.style.bottom = this._options.offset;
    } else {
      // 数字だけで指定された場合
      el.style.bottom = this._options.offset + 'px';
    }

    document.body.appendChild(el);
  }

  /**
   * イベントを追加
   */
  private setEvent(target: Target) {
    // イベント発火の高さを取得
    this.setEventPoition(target);

    // 発火
    this.fire(target);

    // リサイズ
    this.resizeHandle(target);

    // スクロール
    this.scrollHandle(target);
  }

  /**
   * イベント発火位置を取得
   */
  private setEventPoition(target: Target) {
    if (this._options.offset.indexOf('%') != -1) {
      var par = parseInt(this._options.offset.replace('%', ''));
      var offset = window.innerHeight * (par / 100);
      target.eventPosition = target.element.getBoundingClientRect().top - window.innerHeight + offset + window.pageYOffset;

    } else if (this._options.offset.indexOf('px') != -1) {
      target.eventPosition = target.element.getBoundingClientRect().top - window.innerHeight + window.pageYOffset + parseInt(this._options.offset.replace('px', ''));

    } else {
      target.eventPosition = target.element.getBoundingClientRect().top - window.innerHeight + window.pageYOffset + parseInt(this._options.offset);
    }
  }

  /**
   * イベント発火
   */
  private fire(target: Target) {
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
  }

  /**
   * リサイズイベント
   */
  private resizeHandle(target: Target) {
    var timer;
    window.addEventListener('resize', () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        this.setEventPoition(target);
      }, 100);
    });
  }

  /**
   * スクロールイベント
   */
  private scrollHandle(target: Target) {
    window.addEventListener('scroll', () => {
      if (target.isSuccess) {
        return false;
      }
      this.fire(target);
    });
  }

  /**
   * 対象にクラスを追加
   */
  private addClass(elTarget: HTMLElement) {
    if (!this._options.addClassName) {
      // 付けるクラスがない場合は終了
      return false;
    }

    if (elTarget.className) {
      elTarget.className += ' ' + this._options.addClassName;
    } else {
      elTarget.className += this._options.addClassName;
    }
  }
}

// オプション
interface Options {
  offset: string,
  test: string,
  scrollEnd: boolean,
  addClassName: string,
  callback: (HTMLElement?) => any,
}

// 対象
interface Target {
  element: HTMLElement,
  isSuccess: boolean,
  eventPosition: number
}
