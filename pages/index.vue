<template>
  <div class="camera-container">
    <!-- Step 1: Start button screen -->
    <div v-if="!started" class="start-screen">
      <v-btn color="primary" @click="start" large rounded elevation="3">
        Start Color Detection
      </v-btn>
    </div>

    <!-- Step 2: Camera view and detection -->
    <div v-else>
      <video ref="video" autoplay muted playsinline></video>
      <canvas ref="canvas" style="display: none;"></canvas>

      <!-- Flip Camera Button (Top-Right) -->
      <v-btn
        icon
        class="flip-btn"
        color="primary"
        @click="flipCamera"
        elevation="2"
      >
        <v-icon>mdi-camera-switch</v-icon>
      </v-btn>

      <!-- Color Name (Center Top) -->
      <div class="color-name">
        {{ colorName }}
      </div>

      <!-- Centered Crosshair -->
      <div class="crosshair">+</div>
    </div>
  </div>
</template>

<script>
import ntc from 'ntcjs' // npm install ntcjs

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
    this.stopCamera();
  },
  methods: {
    async start() {
      this.started = true;
      await this.startCamera();
    },
    async startCamera() {
      const constraints = {
        video: { facingMode: this.facingMode }
      };
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.stream = stream;
        this.$refs.video.srcObject = stream;

        this.$refs.video.addEventListener('loadedmetadata', () => {
          const canvas = this.$refs.canvas;
          canvas.width = this.$refs.video.videoWidth;
          canvas.height = this.$refs.video.videoHeight;
          this.detectLoop();
        });
      } catch (err) {
        alert('Camera access denied.');
        console.error(err);
      }
    },
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
    },
    flipCamera() {
      this.stopCamera();
      this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
      this.startCamera();
    },
    detectLoop() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');

      const loop = () => {
        ctx.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
        const x = Math.floor(canvas.width / 2);
        const y = Math.floor(canvas.height / 2);
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;

        const hex = `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`;
        const [name] = ntc.name(hex);

        // Only update if the name is not just a hex label
        if (!name.toLowerCase().includes('hex')) {
          this.colorName = name;
        } else {
          this.colorName = 'Unknown Color';
        }

        requestAnimationFrame(loop);
      };
      loop();
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
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 24px;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: red;
  font-size: 32px;
  font-weight: bold;
  pointer-events: none;
  text-shadow: 0 0 5px black;
}

.flip-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}
</style>
