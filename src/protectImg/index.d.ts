/**
 * jquery.protectImgの型定義ファイル
 */

// jQuery拡張
interface JQuery {
    aemProtectImage(options?: ProtectImgOptions);
}

// オプション
interface ProtectImgOptions {
    disableContextmenu?: boolean,
    blankImg?: string,
    blankImgClassName?: string,
    zIndex?: number,
    betweenContent?: JQuery | null
}