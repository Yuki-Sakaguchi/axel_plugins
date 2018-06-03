/**
 * jquery.protectImgの型定義ファイル
 */
// オプション
interface ViewOptions {
  offset: string,
  test: string,
  scrollEnd: boolean,
  addClassName: string,
  callback: (HTMLElement?) => any,
}

// 対象
interface ViewTarget {
  element: HTMLElement,
  isSuccess: boolean,
  eventPosition: number
}
