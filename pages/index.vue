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

      <!-- Color name -->
      <div class="color-name">{{ colorName }}</div>

      <!-- Crosshair -->
      <div class="crosshair">+</div>
    </div>
  </div>
</template>

<script>
import ntc from 'ntcjs'

export default {
  data() {
    return {
      started: false,
      colorName: '',
      stream: null,
      facingMode: 'environment',
      overrides: {
        '#ffffff': 'White',
        '#000000': 'Black',
        '#ff0000': 'Red',
        '#00ff00': 'Green',
        '#0000ff': 'Blue',
        '#ffff00': 'Yellow',
        '#00ffff': 'Cyan',
        '#ff00ff': 'Magenta',
        '#c0c0c0': 'Silver',
        '#808080': 'Gray',
        '#800000': 'Maroon',
        '#808000': 'Olive',
        '#008000': 'Dark Green',
        '#800080': 'Purple',
        '#008080': 'Teal',
        '#000080': 'Navy',
        '#f0f8ff': 'Alice Blue',
        '#faebd7': 'Antique White',
        '#7fffd4': 'Aquamarine',
        '#f5f5dc': 'Beige',
        '#ffe4c4': 'Bisque',
        '#a52a2a': 'Brown',
        '#5f9ea0': 'Cadet Blue',
        '#7fff00': 'Chartreuse',
        '#d2691e': 'Chocolate',
        '#6495ed': 'Cornflower Blue',
        '#dc143c': 'Crimson',
        '#00ced1': 'Dark Turquoise',
        '#9400d3': 'Dark Violet',
        '#ff1493': 'Deep Pink',
        '#1e90ff': 'Dodger Blue',
        '#b22222': 'Firebrick',
        '#228b22': 'Forest Green',
        '#ffd700': 'Gold',
        '#daa520': 'Goldenrod',
        '#adff2f': 'Green Yellow',
        '#f08080': 'Light Coral',
        '#90ee90': 'Light Green',
        '#ffb6c1': 'Light Pink',
        '#20b2aa': 'Light Sea Green',
        '#87cefa': 'Light Sky Blue',
        '#778899': 'Light Slate Gray',
        '#b0c4de': 'Light Steel Blue',
        '#ff6347': 'Tomato',
        '#40e0d0': 'Turquoise',
        '#ee82ee': 'Violet',
        '#f5deb3': 'Wheat'
      }
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

      const loop = () => {
        ctx.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height)
        const x = Math.floor(canvas.width / 2)
        const y = Math.floor(canvas.height / 2)
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data

        const hex = `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`.toLowerCase()

        // Check overrides first
        if (this.overrides[hex]) {
          this.colorName = this.overrides[hex]
        } else {
          const [name, exact] = ntc.name(hex)
          if (exact || /^[a-z\s]+$/i.test(name)) {
            this.colorName = name
          } else {
            this.colorName = 'Unknown Color'
          }
        }

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
  font-size: 24px;
  font-weight: 600;
  padding: 10px 18px;
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
</style>
