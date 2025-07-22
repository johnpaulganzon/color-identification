<template>
  <div class="camera-container">
    <!-- Step 1: Show START button -->
    <div v-if="!started" class="start-screen">
      <v-btn color="primary" @click="start" large>
        Start Color Detection
      </v-btn>
    </div>

    <!-- Step 2: Show camera + detection UI -->
    <div v-else>
      <video ref="video" autoplay muted playsinline></video>
      <canvas ref="canvas" style="display: none;"></canvas>

      <!-- Color Name -->
      <div class="color-name">{{ colorName }}</div>

      <!-- Crosshair -->
      <div class="crosshair">+</div>

      <!-- Flip Camera Button -->
      <v-btn
        color="primary"
        class="flip-btn"
        @click="flipCamera"
        elevation="2"
        small
      >
        Flip
      </v-btn>
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
        this.colorName = name;
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
  overflow: hidden;
}
.start-screen {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}
.color-name {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 20px;
  background: rgba(0, 0, 0, 0.5);
  padding: 6px 12px;
  border-radius: 6px;
}
.flip-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
