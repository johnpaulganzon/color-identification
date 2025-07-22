<template>
  <div class="camera-view">
    <video ref="video" autoplay muted playsinline></video>
    <canvas ref="canvas" style="display: none;"></canvas>

    <div class="crosshair">+</div>

    <div class="color-info">
      <div :style="{ backgroundColor: color.hex }" class="color-box"></div>
      <p>{{ color.rgb }}<br>{{ color.hex }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      color: { rgb: '#000000', hex: '#000000' },
      detector: null
    }
  },
  mounted() {
    const video = this.$refs.video;
    const canvas = this.$refs.canvas;
    this.detector = new this.$colorDetector(video, canvas, (color, err) => {
      if (color) this.color = color;
      if (err) alert('Camera permission is required!');
    });
    this.detector.start();
  },
  beforeDestroy() {
    if (this.detector) this.detector.stop();
  }
}
</script>

<style scoped>
.camera-view {
  position: relative;
  width: 100%;
  max-width: 640px;
  margin: auto;
}
video {
  width: 100%;
}
.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: red;
  font-size: 28px;
  font-weight: bold;
  pointer-events: none;
}
.color-info {
  text-align: center;
  margin-top: 10px;
}
.color-box {
  width: 50px;
  height: 50px;
  margin: auto;
  border: 1px solid #000;
}
</style>
