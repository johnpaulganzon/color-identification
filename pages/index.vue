<template>
  <div class="camera-container">
    <!-- Start screen -->
    <div v-if="!started" class="start-screen">
      <v-btn color="primary" @click="start" large rounded elevation="3">
        Start Color Detection
      </v-btn>
    </div>

    <!-- Camera view -->
    <div v-else>
      <video ref="video" autoplay muted playsinline></video>
      <canvas ref="canvas" style="display: none;"></canvas>

      <!-- Flip camera -->
      <v-btn icon class="flip-btn" color="primary" @click="flipCamera" elevation="2">
        <v-icon>mdi-camera-switch</v-icon>
      </v-btn>

      <!-- Exit camera -->
      <v-btn icon class="exit-btn" color="error" @click="stopDetection" elevation="2">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <!-- Color name -->
      <div class="color-name">{{ colorName }}</div>

      <!-- Crosshair -->
      <div class="crosshair">+</div>
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
      facingMode: 'environment'
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

        for (const [name, [cr, cg, cb]] of Object.entries(namedColors)) {
          const dist = Math.sqrt(
            (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2
          )
          if (dist < minDist) {
            minDist = dist
            closestName = name
          }
        }

        const hex = `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
        this.colorName = `${closestName} (${hex})`

        requestAnimationFrame(loop)
      }

      loop()
    }
  }
}
</script>

<style scoped>
.camera-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: black;
  overflow: hidden;
}

.start-screen {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #121212;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.color-name {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 20px;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  z-index: 15;
  text-align: center;
  white-space: nowrap;
}

.crosshair {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: red;
  font-size: 32px;
  font-weight: bold;
  pointer-events: none;
  z-index: 20;
  text-shadow: 0 0 5px black;
}

.flip-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 30;
}

.exit-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 30;
}
</style>
