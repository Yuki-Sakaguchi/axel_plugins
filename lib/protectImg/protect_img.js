(function () {
    $.fn.extend({
        aemProtectImage: function (options) {
            var img, rawImg, settings, setupImgTag;
            settings = {
                disableContextmenu: false,
                blankImg: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw%3D%3D',
                zIndex: 1000
            };
            settings = $.extend(settings, options);
            img = new Image();
            img.src = settings.blankImg;
            rawImg = img.cloneNode();
            $(img).addClass('blank-img');
            if (settings.disableContextmenu === true) {
                $(window).on('contextmenu', function () {
                    return false;
                });
            }
            setupImgTag = function (ele) {
                var $this, imgH, imgW, pos;
                $this = $(ele);
                pos = $this.offset();
                imgW = $this.width();
                imgH = $this.height();
                return $(rawImg.cloneNode()).attr({
                    width: imgW,
                    height: imgH
                }).css({
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    zIndex: settings.zIndex,
                    width: imgW,
                    height: imgH
                }).appendTo('body');
            };
            return this.each(function () {
                var $clone, $this, pos;
                $this = $(this);
                $this.on('contextmenu', function () {
                    return false;
                });
                if (this.tagName.toLowerCase() === 'img') {
                    $(this).on('load', (function (_this) {
                        return function () {
                            return setupImgTag(_this);
                        };
                    })(this));
                    if (this.complete) {
                        // $(this).load();
                    }
                    return true;
                }
                pos = $this.css('position');
                if (pos !== 'absolute' && pos !== 'relative') {
                    $this.css('position', 'relative');
                    if ($this.css('display') === 'inline') {
                        $this.css('display', 'inline-block');
                    }
                }
                $clone = $(img).clone().css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                });
                if (settings.betweenContent) {
                    return $this.append(settings.betweenContent, $clone);
                }
                else {
                    return $this.append($clone);
                }
            });
        }
    });
}).call(this);
