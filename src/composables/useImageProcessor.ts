import { ref } from 'vue'

/**
 * 图片处理Composable
 * 提供图片处理相关的功能：背景移除、卡通效果、矢量化
 */
export function useImageProcessor() {
  // 加载状态
  const loading = ref(false)
  // 加载状态文本
  const loadingText = ref('处理中...')

  /**
   * 移除图片背景
   * 使用亮度阈值法，将明亮背景设置为透明
   * @param imageUrl - 输入图片的URL（base64或网络地址）
   * @returns Promise<string> - 处理后的图片URL（base64格式）
   */
  const removeBackground = (imageUrl: string): Promise<string> => {
    loading.value = true
    loadingText.value = '正在移除背景...'

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const canvas = document.createElement('canvas')
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('无法获取canvas context'))
            return
          }
          
          ctx.drawImage(img, 0, 0)
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            
            const isLight = (r + g + b) / 3 > 200
            
            if (isLight) {
              data[i + 3] = 0
            }
          }
          
          ctx.putImageData(imageData, 0, 0)
          const result = canvas.toDataURL('image/png')
          
          loading.value = false
          resolve(result)
        }
        
        img.onerror = () => {
          loading.value = false
          reject(new Error('图片加载失败'))
        }
        
        img.src = imageUrl
      }, 1500)
    })
  }

  /**
   * 应用卡通风格效果
   * 使用颜色量化，减少颜色数量，产生卡通效果
   * @param imageUrl - 输入图片的URL
   * @returns Promise<string> - 处理后的图片URL（base64格式）
   */
  const applyCartoonEffect = (imageUrl: string): Promise<string> => {
    loading.value = true
    loadingText.value = '正在生成卡通效果...'

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const canvas = document.createElement('canvas')
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('无法获取canvas context'))
            return
          }
          
          ctx.drawImage(img, 0, 0)
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.round(data[i] / 40) * 40
            data[i + 1] = Math.round(data[i + 1] / 40) * 40
            data[i + 2] = Math.round(data[i + 2] / 40) * 40
          }
          
          ctx.putImageData(imageData, 0, 0)
          const result = canvas.toDataURL('image/png')
          
          loading.value = false
          resolve(result)
        }
        
        img.onerror = () => {
          loading.value = false
          reject(new Error('图片加载失败'))
        }
        
        img.src = imageUrl
      }, 1000)
    })
  }

  /**
   * 转换为SVG格式
   * 将图片嵌入到SVG中，实现简单的矢量化
   * @param imageUrl - 输入图片的URL
   * @returns Promise<string> - SVG格式的图片URL（base64格式）
   */
  const convertToSVG = (imageUrl: string): Promise<string> => {
    loading.value = true
    loadingText.value = '正在矢量化...'

    return new Promise((resolve, reject) => {
      setTimeout(() => {
              document.createElement('canvas');
              const img = new Image()
              img.crossOrigin = 'anonymous'

              img.onload = () => {
                  const width = Math.min(img.width, 400)
                  const height = Math.min(img.height, 400)

                  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <image href="${imageUrl}" width="${width}" height="${height}" />
          </svg>`

                  const result = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))

                  loading.value = false
                  resolve(result)
              }

              img.onerror = () => {
                  loading.value = false
                  reject(new Error('图片加载失败'))
              }

              img.src = imageUrl
          }
          , 1000)
    })
  }

  return {
    loading,
    loadingText,
    removeBackground,
    applyCartoonEffect,
    convertToSVG
  }
}
