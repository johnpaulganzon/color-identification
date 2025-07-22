<template>
  <div class="camera-container">
    <!-- Start screen -->
    <div v-if="!started" class="start-screen">
      <div class="start-content">
        <h2 class="title">Hue Detection</h2>
        <p class="subtitle">Identify colors in real time using your camera</p>
        <v-btn color="primary" @click="start" large rounded elevation="3">
          Start Color Detection
        </v-btn>
      </div>
    </div>

    <!-- Camera view -->
    <div v-else class="camera-wrapper">
      <div class="video-wrapper">
        <video ref="video" autoplay muted playsinline></video>
        <canvas ref="canvas" style="display: none;"></canvas>

        <!-- Color name -->
        <div class="color-name">{{ colorName }}</div>

        <!-- Crosshair -->
        <div class="crosshair" :style="{ color: crossColor }">+</div>
      </div>

      <!-- Controls (exit and flip) -->
      <div class="controls">
        <v-btn icon color="error" @click="stopDetection" elevation="2">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn icon color="primary" @click="flipCamera" elevation="2">
          <v-icon>mdi-camera-switch</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      started: false,
      colorName: '',
      stream: null,
      facingMode: 'environment',
      crossColor: 'red'
    }
  },
  beforeDestroy() {
    this.stopCamera()
  },
  methods: {
    async start() {
      this.started = true
      await this.startCamera()
    },
    stopDetection() {
      this.stopCamera()
      this.started = false
      this.colorName = ''
    },
    async startCamera() {
      const constraints = {
        video: { facingMode: this.facingMode }
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        this.stream = stream
        this.$refs.video.srcObject = stream

        this.$refs.video.addEventListener('loadedmetadata', () => {
          const canvas = this.$refs.canvas
          canvas.width = this.$refs.video.videoWidth
          canvas.height = this.$refs.video.videoHeight
          this.detectLoop()
        })
      } catch (err) {
        alert('Camera access denied.')
        console.error(err)
      }
    },
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
        this.stream = null
      }
    },
    flipCamera() {
      this.stopCamera()
      this.facingMode = this.facingMode === 'user' ? 'environment' : 'user'
      this.startCamera()
    },
    detectLoop() {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')

      const namedColors = {
        "Black": [0, 0, 0],
        "White": [255, 255, 255],
        "Red": [255, 0, 0],
        "Green": [0, 128, 0],
        "Blue": [0, 0, 255],
        "Yellow": [255, 255, 0],
        "Cyan": [0, 255, 255],
        "Magenta": [255, 0, 255],
        "Gray": [128, 128, 128],
        "Orange": [255, 165, 0],
        "Pink": [255, 192, 203],
        "Purple": [128, 0, 128],
        "Brown": [165, 42, 42],
        "Teal": [0, 128, 128],
        "Navy": [0, 0, 128],
        "Olive": [128, 128, 0],
        "Maroon": [128, 0, 0],
        "Gold": [255, 215, 0],
        "SkyBlue": [135, 206, 235],
        "Tomato": [255, 99, 71],
        "Coral": [255, 127, 80]
      }

      const loop = () => {
        ctx.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height)
        const x = Math.floor(canvas.width / 2)
        const y = Math.floor(canvas.height / 2)
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data

        let closestName = 'Unknown'
        let minDist = Infinity
        let closestRGB = [r, g, b]

        for (const [name, [cr, cg, cb]] of Object.entries(namedColors)) {
          const dist = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2)
          if (dist < minDist) {
            minDist = dist
            closestName = name
            closestRGB = [cr, cg, cb]
          }
        }

        const hex = `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
        this.colorName = `${closestName} (${hex})`
        this.crossColor = `rgb(${closestRGB.join(',')})`

        requestAnimationFrame(loop)
      }

      loop()
    }
  }
}
</script>

<style scoped>
.camera-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: black;
}

.start-screen {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #121212;
  padding: 20px;
}

.start-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  color: white;
  font-size: 28px;
  font-weight: bold;
}

.subtitle {
  color: #ccc;
  font-size: 16px;
  margin-bottom: 8px;
}

.camera-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 12px;
  border: 2px solid #444;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.color-name {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  z-index: 2;
  text-align: center;
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  font-weight: bold;
  pointer-events: none;
  z-index: 2;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
}

.controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
}
</style>
