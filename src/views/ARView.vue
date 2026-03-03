<template>
  <div id="ar-container">
    <div class="ui-overlay header">
      <button class="btn" @click="goBack">← 返回</button>
      <button class="btn btn-toggle" @click="toggleHints">{{ hintsVisible ? '💡 提示' : '👁️ 显示' }}</button>
    </div>

    <div ref="aframeContainer" class="aframe-container"></div>

    <div class="marker-info" :class="{ hidden: !hintsVisible }">
      <p>🎯 扫描Hiro标记即可显示AR形象</p>
      <p><a href="https://jeromeetienne.github.io/AR.js/data/images/HIRO.jpg" target="_blank">获取Hiro标记</a></p>
    </div>

    <div class="status" :style="{ background: markerFound ? 'rgba(76, 175, 80, 0.8)' : 'rgba(0, 0, 0, 0.7)' }">
      {{ markerFound ? '✅ 检测到标记' : '🔍 扫描中...' }}
    </div>

    <div class="toast" :class="{ active: showToastFlag }">{{ toastMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const aframeContainer = ref<HTMLDivElement | null>(null)
const hintsVisible = ref(true)
const markerFound = ref(false)
const showToastFlag = ref(false)
const toastMessage = ref('')

const EXAMPLE_LEAF_IMG = 'https://picsum.photos/256/256'
let markerEl: any = null
let markerFoundHandler: (() => void) | null = null
let markerLostHandler: (() => void) | null = null

const goBack = () => {
  router.push('/')
}

const toggleHints = () => {
  hintsVisible.value = !hintsVisible.value
}

const initAFrame = async () => {
  if (!aframeContainer.value) return
  
  try {
    if (!(window as any).AFRAME) {
      await loadScript('https://cdn.jsdelivr.net/npm/aframe@1.4.2/dist/aframe.min.js')
    }
    
    if (!(window as any).arjs) {
      await loadScript('https://cdn.jsdelivr.net/npm/@ar-js-org/ar.js@3.4.5/aframe/build/aframe-ar.js')
    }
    
    await nextTick()
    
    registerComponents()
    
    renderAFrameContent()
    
  } catch (error) {
    console.error('Failed to initialize A-Frame:', error)
  }
}

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

const registerComponents = () => {
  if (typeof window !== 'undefined' && (window as any).AFRAME) {
    const AFRAME = (window as any).AFRAME
    
    if (!AFRAME.components.billboard) {
      AFRAME.registerComponent('billboard', {
        tick: function() {
          const sceneEl = this.el.sceneEl
          if (!sceneEl.camera) return
          
          const camera = sceneEl.camera.el
          const THREE = (window as any).THREE
          const cameraPos = camera.object3D.getWorldPosition(new THREE.Vector3())
          const thisPos = this.el.object3D.getWorldPosition(new THREE.Vector3())
          
          this.el.object3D.lookAt(cameraPos.x, thisPos.y, cameraPos.z)
        }
      })
    }
    
    if (!AFRAME.components.float) {
      AFRAME.registerComponent('float', {
        schema: {
          height: {type: 'number', default: 0.2},
          speed: {type: 'number', default: 1}
        },
        init: function() {
          this.initialY = this.el.object3D.position.y
          this.offset = Math.random() * Math.PI * 2
        },
        tick: function(time: number) {
          const float = Math.sin(time * 0.001 * this.data.speed + this.offset) * this.data.height
          this.el.object3D.position.y = this.initialY + float
        }
      })
    }
    
    if (!AFRAME.components['rotate-slow']) {
      AFRAME.registerComponent('rotate-slow', {
        schema: {
          speed: {type: 'number', default: 360}
        },
        tick: function({timeDelta}: { time: number, timeDelta: number }) {
          this.el.object3D.rotation.y += (this.data.speed / 1000) * timeDelta * 0.017453292519943295
        }
      })
    }
  }
}

const renderAFrameContent = () => {
  if (!aframeContainer.value) return
  
  let cartoonImgSrc = EXAMPLE_LEAF_IMG
  try {
    const savedCartoon = localStorage.getItem('cartoonUrl')
    if (savedCartoon) {
      cartoonImgSrc = savedCartoon
    }
  } catch (e) {
    console.log('Image load error:', e)
  }
  
  const content = `
    <a-scene
      arjs="sourceType: webcam; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
      shadow="type: pcfsoft;"
      renderer="antialias: true; logarithmicDepthBuffer: true;"
    >
      <a-assets>
        <img id="cartoon-img" src="${cartoonImgSrc}" crossorigin="anonymous" />
      </a-assets>

      <a-marker preset="hiro" id="marker-hiro">
        <a-entity id="scene-group">
          <a-entity id="pet-platform" position="0 0.6 0" billboard>
            <a-entity id="pet-container" float="height: 0.05; speed: 1.5;">
              <a-image
                id="cartoon-image"
                src="#cartoon-img"
                position="0 0 0"
                width="0.6"
                height="0.6"
                material="transparent: true; alphaTest: 0.5;"
              ></a-image>
            </a-entity>
          </a-entity>

          <a-torus 
            position="0 0.6 0"
            radius="0.5"
            radius-tubular="0.02"
            segments-radial="32"
            color="#FFD700"
            material="opacity: 0.7; transparent: true;"
            rotation="-90 0 0"
            rotate-slow="speed: 30;"
          ></a-torus>

          <a-sphere 
            position="0 0.2 0"
            radius="0.3"
            segments-width="16"
            segments-height="12"
            color="#4FC3F7"
            shadow="cast: true; receive: true;"
            rotate-slow="speed: 10;"
          ></a-sphere>

          <a-entity id="cloud1" position="0.3 0.8 0.2" float="height: 0.05; speed: 1.2;">
            <a-sphere position="0 0 0" radius="0.06" color="#FFFFFF" material="opacity: 0.9; transparent: true;"></a-sphere>
            <a-sphere position="0.04 -0.02 0" radius="0.05" color="#F5F5F5" material="opacity: 0.85; transparent: true;"></a-sphere>
            <a-sphere position="-0.04 -0.03 0" radius="0.045" color="#FFFFFF" material="opacity: 0.85; transparent: true;"></a-sphere>
          </a-entity>

          <a-entity id="cloud2" position="-0.35 0.75 0.25" float="height: 0.06; speed: 1.5;">
            <a-sphere position="0 0 0" radius="0.05" color="#FFFFFF" material="opacity: 0.9; transparent: true;"></a-sphere>
            <a-sphere position="0.035 -0.015 0" radius="0.04" color="#F5F5F5" material="opacity: 0.85; transparent: true;"></a-sphere>
          </a-entity>

          <a-entity id="star1" position="0.4 0.9 0.3" float="height: 0.08; speed: 2;" rotate-slow="speed: 120;">
            <a-tetrahedron radius="0.03" color="#FFD700" material="metalness: 0.8; roughness: 0.2;"></a-tetrahedron>
          </a-entity>

          <a-entity id="star2" position="-0.4 0.85 0.2" float="height: 0.07; speed: 1.8;" rotate-slow="speed: -100;">
            <a-tetrahedron radius="0.025" color="#FFA500" material="metalness: 0.7; roughness: 0.3;"></a-tetrahedron>
          </a-entity>

          <a-light type="ambient" color="#ffffff" intensity="0.6"></a-light>
          <a-light 
            type="point" 
            color="#FFE082" 
            intensity="1.2" 
            position="0 1.5 0.5"
            distance="3"
            decay="2"
            shadow="cast: true; bias: -0.001;"
          ></a-light>
        </a-entity>
      </a-marker>

      <a-entity camera></a-entity>
    </a-scene>
  `
  
  aframeContainer.value.innerHTML = content
  
  nextTick(() => {
    markerEl = document.getElementById('marker-hiro')
    if (markerEl) {
      markerFoundHandler = () => {
        if (!markerFound.value) {
          markerFound.value = true
        }
      }
      markerLostHandler = () => {
        markerFound.value = false
      }
      markerEl.addEventListener('markerFound', markerFoundHandler)
      markerEl.addEventListener('markerLost', markerLostHandler)
    }
  })
}

const cleanupAFrame = () => {
  if (markerEl && markerFoundHandler && markerLostHandler) {
    markerEl.removeEventListener('markerFound', markerFoundHandler)
    markerEl.removeEventListener('markerLost', markerLostHandler)
    markerFoundHandler = null
    markerLostHandler = null
  }
  markerEl = null
  
  const aScene = document.querySelector('a-scene')
  if (aScene && aScene.parentNode) {
    aScene.parentNode.removeChild(aScene)
  }
  
  if (aframeContainer.value) {
    aframeContainer.value.innerHTML = ''
  }
}

onMounted(() => {
  initAFrame()
})

onUnmounted(() => {
  cleanupAFrame()
})
</script>

<style scoped>
#ar-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.aframe-container {
  width: 100%;
  height: 100%;
}

.ui-overlay {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
}
.ui-overlay > * {
  pointer-events: auto;
}
.header {
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;
  flex-shrink: 0;
}
.btn-toggle {
  padding: 10px 15px;
  font-size: 12px;
}
.status {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 14px;
  text-align: center;
  z-index: 1000;
}
.marker-info {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 16px;
  border-radius: 12px;
  text-align: center;
  max-width: 85%;
  z-index: 1000;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.marker-info.hidden {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
  pointer-events: none;
}
.marker-info p {
  margin: 4px 0;
  font-size: 12px;
  color: #333;
}
.marker-info a {
  color: #667eea;
  font-weight: bold;
  text-decoration: underline;
}
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 30px;
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
</style>
