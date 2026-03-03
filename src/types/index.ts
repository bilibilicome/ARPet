/**
 * 应用状态类型定义
 */
export interface AppState {
  /** 当前步骤（1-5） */
  currentStep: number
  /** 原始图片URL（base64） */
  originalImageUrl: string | null
  /** 背景移除后的图片URL（base64） */
  bgRemovedImageUrl: string | null
  /** 卡通风格化后的图片URL（base64） */
  cartoonImageUrl: string | null
  /** SVG矢量化后的图片URL（base64） */
  svgImageUrl: string | null
}
