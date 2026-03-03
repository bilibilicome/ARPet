<template>
  <div class="container">
    <div class="header">
      <h1>🐾 AR宠物卡通</h1>
      <p>上传照片，一键生成专属AR卡通形象</p>
    </div>

    <div class="progress-bar">
      <div class="progress-item" v-for="i in 5" :key="i">
        <div class="progress-circle" 
          :class="{ active: currentStep === i, completed: currentStep > i }">
          {{ currentStep > i ? '✓' : i }}
        </div>
        <div class="progress-label" :class="{ active: currentStep === i }">
          {{ getStepLabel(i) }}
        </div>
      </div>
    </div>

    <div class="step-card" :class="{ active: currentStep === 1 }">
      <div class="step-title">
        <span class="emoji">📷</span>
        第一步：上传宠物照片
      </div>
      
      <div class="upload-area" @click="handleUploadClick" 
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop">
        <div v-if="!originalImageUrl" id="photoUploadPlaceholder">
          <div class="upload-icon">📸</div>
          <div class="upload-text">点击上传或拖拽照片</div>
          <div class="upload-hint">支持 JPG、PNG 格式</div>
        </div>
        <img v-else class="preview-image" :src="originalImageUrl" alt="预览">
      </div>
      <input type="file" ref="photoInput" accept="image/*" @change="handleFileSelect">
      
      <div class="button-row" v-if="originalImageUrl">
        <button class="btn btn-secondary" @click="resetPhoto">🔄 重置</button>
      </div>

      <div class="button-row bottom">
        <button class="btn btn-primary" :disabled="!originalImageUrl" @click="goToStep(2)">下一步 →</button>
      </div>
    </div>

    <div class="step-card" :class="{ active: currentStep === 2 }">
      <div class="step-title">
        <span class="emoji">✂️</span>
        第二步：移除背景
      </div>
      
      <div style="text-align: center; margin-bottom: 16px;">
        <img v-if="bgRemovedImageUrl" class="preview-image" :src="bgRemovedImageUrl" style="max-height: 250px;" alt="背景已移除">
        <div v-else style="padding: 40px; color: #999;">正在处理中...</div>
      </div>

      <div class="step-guide">
        <div class="step-guide-title">💡 说明：</div>
        <ul class="step-list">
          <li class="step-item">
            <span class="step-number">1</span>
            <div>AI 会自动识别照片中的主体并移除背景</div>
          </li>
          <li class="step-item">
            <span class="step-number">2</span>
            <div>处理需要几秒钟时间，请耐心等待</div>
          </li>
        </ul>
      </div>

      <div class="button-row bottom">
        <button class="btn btn-secondary" @click="goToStep(1)">← 上一步</button>
        <button class="btn btn-primary" :disabled="!bgRemovedImageUrl" @click="goToStep(3)">下一步 →</button>
      </div>
    </div>

    <div class="step-card" :class="{ active: currentStep === 3 }">
      <div class="step-title">
        <span class="emoji">🎨</span>
        第三步：卡通风格化
      </div>
      
      <div style="text-align: center; margin-bottom: 16px;">
        <img v-if="cartoonImageUrl" class="preview-image" :src="cartoonImageUrl" style="max-height: 250px;" alt="卡通风格">
        <div v-else style="padding: 40px; color: #999;">正在处理中...</div>
      </div>

      <div class="step-guide">
        <div class="step-guide-title">✨ 卡通效果：</div>
        <ul class="step-list">
          <li class="step-item">
            <span class="step-number">1</span>
            <div>应用卡通滤镜，让照片更有漫画感</div>
          </li>
          <li class="step-item">
            <span class="step-number">2</span>
            <div>简化颜色，增加边缘效果</div>
          </li>
        </ul>
      </div>

      <div class="button-row bottom">
        <button class="btn btn-secondary" @click="goToStep(2)">← 上一步</button>
        <button class="btn btn-primary" :disabled="!cartoonImageUrl" @click="goToStep(4)">下一步 →</button>
      </div>
    </div>

    <div class="step-card" :class="{ active: currentStep === 4 }">
      <div class="step-title">
        <span class="emoji">📐</span>
        第四步：矢量化
      </div>
      
      <div style="text-align: center; margin-bottom: 16px;" ref="svgPreview">
      </div>

      <div class="step-guide">
        <div class="step-guide-title">🔍 矢量图优势：</div>
        <ul class="step-list">
          <li class="step-item">
            <span class="step-number">1</span>
            <div>无论放大多少倍都不会模糊</div>
          </li>
          <li class="step-item">
            <span class="step-number">2</span>
            <div>文件更小，加载更快</div>
          </li>
        </ul>
      </div>

      <div class="button-row bottom">
        <button class="btn btn-secondary" @click="goToStep(3)">← 上一步</button>
        <button class="btn btn-primary" :disabled="!svgImageUrl" @click="goToStep(5)">下一步 →</button>
      </div>
    </div>

    <div class="step-card" :class="{ active: currentStep === 5 }">
      <div class="step-title">
        <span class="emoji">🎮</span>
        第五步：开始AR体验
      </div>
      
      <div class="step-guide">
        <div class="step-guide-title">✅ 准备好后，点击下方按钮：</div>
        <ul class="step-list">
          <li class="step-item">
            <span class="step-number">1</span>
            <div>确保你已经在另一台设备上显示Hiro标记</div>
          </li>
          <li class="step-item">
            <span class="step-number">2</span>
            <div>用摄像头对准标记，你的卡通形象就会出现！</div>
          </li>
        </ul>
      </div>
      
      <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
        <div style="font-weight: bold; color: #856404; margin-bottom: 8px;">⚠️ 重要提示（手机用户）：</div>
        <div style="font-size: 13px; color: #856404; line-height: 1.6;">
          手机浏览器需要 HTTPS 环境才能访问摄像头。本地服务器（http://）在手机上无法使用。<br><br>
          <strong>解决方案：</strong><br>
          1. 在电脑上直接体验（localhost 可用）<br>
          2. 或将项目部署到支持 HTTPS 的服务器
        </div>
      </div>
      
      <button class="btn btn-ar" @click="startAR">
        🎮 开始AR体验
      </button>

      <div class="button-row bottom">
        <button class="btn btn-secondary" @click="goToStep(4)">← 上一步</button>
        <button class="btn btn-secondary" @click="resetAll">🔄 重新开始</button>
      </div>
    </div>

    <div class="loading" :class="{ active: loading }">
      <div class="loading-content">
        <div class="spinner"></div>
        <div class="loading-text">{{ loadingText }}</div>
      </div>
    </div>

    <div class="toast" :class="{ active: showToastFlag }">{{ toastMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useImageProcessor } from '../composables/useImageProcessor'

const router = useRouter()
const { loading, loadingText, removeBackground, applyCartoonEffect, convertToSVG } = useImageProcessor()

const currentStep = ref(1)
const originalImageUrl = ref<string | null>(null)
const bgRemovedImageUrl = ref<string | null>(null)
const cartoonImageUrl = ref<string | null>(null)
const svgImageUrl = ref<string | null>(null)

const photoInput = ref<HTMLInputElement | null>(null)
const svgPreview = ref<HTMLDivElement | null>(null)

const showToastFlag = ref(false)
const toastMessage = ref('')

const stepLabels = ['上传照片', '移除背景', '卡通化', '矢量化', '开始AR']

const getStepLabel = (i: number) => stepLabels[i - 1]

const showToast = (message: string) => {
  toastMessage.value = message
  showToastFlag.value = true
  setTimeout(() => {
    showToastFlag.value = false
  }, 2000)
}

const handleUploadClick = () => {
  photoInput.value?.click()
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    originalImageUrl.value = e.target?.result as string
    localStorage.setItem('originalImageUrl', originalImageUrl.value)
    showToast('✅ 照片上传成功！点击下一步继续')
  }
  reader.readAsDataURL(file)
}

const handleDragOver = (e: DragEvent) => {
  (e.target as HTMLElement).style.background = '#e0e0ff'
}

const handleDragLeave = (e: DragEvent) => {
  (e.target as HTMLElement).style.background = ''
}

const handleDrop = (e: DragEvent) => {
  (e.target as HTMLElement).style.background = ''
  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    const dt = new DataTransfer()
    dt.items.add(file)
    if (photoInput.value) {
      photoInput.value.files = dt.files
      photoInput.value.dispatchEvent(new Event('change'))
    }
  }
}

const resetPhoto = () => {
  originalImageUrl.value = null
  localStorage.removeItem('originalImageUrl')
  if (photoInput.value) {
    photoInput.value.value = ''
  }
  showToast('已重置')
}

const goToStep = async (step: number) => {
  if (step === currentStep.value) return
  
  currentStep.value = step
  
  if (step === 2 && originalImageUrl.value && !bgRemovedImageUrl.value) {
    try {
      bgRemovedImageUrl.value = await removeBackground(originalImageUrl.value)
      localStorage.setItem('bgRemovedUrl', bgRemovedImageUrl.value)
      showToast('✅ 背景移除成功！')
    } catch (error) {
      showToast('❌ 处理失败，请重试')
    }
  } else if (step === 3 && bgRemovedImageUrl.value && !cartoonImageUrl.value) {
    try {
      cartoonImageUrl.value = await applyCartoonEffect(bgRemovedImageUrl.value)
      localStorage.setItem('cartoonUrl', cartoonImageUrl.value)
      showToast('🎉 卡通效果生成成功！')
    } catch (error) {
      showToast('❌ 处理失败，请重试')
    }
  } else if (step === 4 && cartoonImageUrl.value && !svgImageUrl.value) {
    try {
      const svgData = await convertToSVG(cartoonImageUrl.value)
      svgImageUrl.value = svgData
      localStorage.setItem('svgUrl', svgImageUrl.value)
      
      await nextTick()
      if (svgPreview.value && cartoonImageUrl.value) {
        const width = 400
        const height = 400
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="max-height: 250px;">
          <image href="${cartoonImageUrl.value}" width="${width}" height="${height}" />
        </svg>`
        svgPreview.value.innerHTML = svg
      }
      
      showToast('📐 矢量化完成！')
    } catch (error) {
      showToast('❌ 处理失败，请重试')
    }
  }
}

const startAR = () => {
  router.push('/ar')
}

const resetAll = () => {
  originalImageUrl.value = null
  bgRemovedImageUrl.value = null
  cartoonImageUrl.value = null
  svgImageUrl.value = null
  localStorage.removeItem('originalImageUrl')
  localStorage.removeItem('bgRemovedUrl')
  localStorage.removeItem('cartoonUrl')
  localStorage.removeItem('svgUrl')
  
  if (photoInput.value) {
    photoInput.value.value = ''
  }
  if (svgPreview.value) {
    svgPreview.value.innerHTML = ''
  }
  
  currentStep.value = 1
  showToast('已重置')
}

onMounted(() => {
  const savedOriginalUrl = localStorage.getItem('originalImageUrl')
  const savedBgRemovedUrl = localStorage.getItem('bgRemovedUrl')
  const savedCartoonUrl = localStorage.getItem('cartoonUrl')
  const savedSvgUrl = localStorage.getItem('svgUrl')
  
  if (savedOriginalUrl) {
    originalImageUrl.value = savedOriginalUrl
  }
  if (savedBgRemovedUrl) {
    bgRemovedImageUrl.value = savedBgRemovedUrl
  }
  if (savedCartoonUrl) {
    cartoonImageUrl.value = savedCartoonUrl
  }
  if (savedSvgUrl) {
    svgImageUrl.value = savedSvgUrl
    nextTick(() => {
      if (svgPreview.value && cartoonImageUrl.value) {
        const width = 400
        const height = 400
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="max-height: 250px;">
          <image href="${cartoonImageUrl.value}" width="${width}" height="${height}" />
        </svg>`
        svgPreview.value.innerHTML = svg
      }
    })
  }
})
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  margin-bottom: 16px;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header h1 {
  color: white;
  font-size: 22px;
  font-weight: bold;
  margin: 0 0 6px 0;
  width: 100%;
  text-align: center;
}

.header p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  margin: 0;
}

.progress-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  flex-shrink: 0;
  gap: 12px;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-direction: column;
}

.progress-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.progress-circle.active {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: scale(1.1);
}

.progress-circle.completed {
  background: #28a745;
  color: white;
}

.progress-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  text-align: center;
  white-space: nowrap;
}

.progress-label.active {
  color: white;
  font-weight: bold;
}

.step-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  flex: 1;
  display: none;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.step-card.active {
  display: flex;
}

.step-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.step-title .emoji {
  font-size: 24px;
}

.upload-area {
  border: 2px dashed #667eea;
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.upload-area:hover {
  background: #f5f5ff;
  border-color: #764ba2;
}

.upload-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

.upload-text {
  color: #667eea;
  font-weight: bold;
  font-size: 14px;
}

.upload-hint {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}

.preview-image {
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  border-radius: 8px;
}

.button-row {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.button-row.bottom {
  margin-top: auto;
  padding-top: 16px;
}

.btn {
  flex: 1;
  padding: 13px 16px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background: #e8e8e8;
}

.btn-ar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  font-size: 17px;
  padding: 16px;
}

.btn-ar:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(240, 147, 251, 0.3);
}

.step-guide {
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.step-guide-title {
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
  font-size: 13px;
}

.step-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #555;
  line-height: 1.5;
}

.step-item:last-child {
  margin-bottom: 0;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-size: 11px;
  font-weight: bold;
  flex-shrink: 0;
}

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 14px;
  z-index: 2000;
  display: none;
}

.toast.active {
  display: block;
  animation: fadeInOut 2s ease;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  20%, 80% { opacity: 1; }
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading.active {
  display: flex;
}

.loading-content {
  background: white;
  padding: 28px;
  border-radius: 16px;
  text-align: center;
}

.spinner {
  width: 44px;
  height: 44px;
  border: 4px solid #f0f0f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #333;
  font-weight: bold;
  font-size: 14px;
}
</style>
