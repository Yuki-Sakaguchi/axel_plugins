export function protectImg($) {
  $.fn.aemProtectImage = function(options?: ProtectImgOptions) {
      let $window = $(window);

      // 初期設定
      let _defaultOptions: ProtectImgOptions = {
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
      let img = new Image();
      img.src = options.blankImg;
      img.className = options.blankImgClassName;
      
      // ダミー画像を複製
      let rawImg = img.cloneNode();
      
      // 右クリック禁止モードの場合
      if (options.disableContextmenu) {
          $window.on('contextmenu', (): boolean => false);
      }

      // 実行
      this.each((i: number, e: any) => {
          let $this = $(e);

          // 右クリック禁止
          $this.on('contentmenu', () => false);

          // 自分がimgタグの場合
          if (e.tagName.toLocaleLowerCase() === 'img') {
              $this.on('load', (e) => {
                  setupImgTag(e);
              });
              // ロード済みの場合はloadイベントを発火
              if (e.complete) {
                  $this.trigger('load');
              }
          }

          // cssの調整
          let pos = $this.css('position');
          if (pos != 'absolute' && pos !== 'relative') {
              $this.css('position', 'relative');
              if ($this.css('display') === 'inline') {
                  $this.css('display', 'inline-block');
              }
          }

          // コピー
          let $clone = $(img).clone().css({
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%'
          });

          // 一緒に追加したい要素があればそれを追加
          if (options.betweenContent) {
              $this.append(options.betweenContent, $clone);
          } else {
              $this.append($clone);
          }
      });

      /**
       * ダミー画像をセット
       * @param target 
       */
      function setupImgTag(target) {
          let $this = $(target);
          let pos = $this.position();
          let imgW = $this.width();
          let imgH = $this.height();

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
  }
}

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