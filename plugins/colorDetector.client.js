export default ({}, inject) => {
  class ColorDetector {
    constructor(videoEl, canvasEl, callback) {
      this.video = videoEl;
      this.canvas = canvasEl;
      this.ctx = canvasEl.getContext('2d');
      this.callback = callback;
      this.raf = null;
    }

    async start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.video.srcObject = stream;

        this.video.addEventListener('loadedmetadata', () => {
          this.canvas.width = this.video.videoWidth;
          this.canvas.height = this.video.videoHeight;
          this.detectLoop();
        });
      } catch (error) {
        console.error('Camera access denied:', error);
        this.callback(null, error);
      }
    }

    detectLoop() {
      const loop = () => {
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        const x = Math.floor(this.canvas.width / 2);
        const y = Math.floor(this.canvas.height / 2);
        const [r, g, b] = this.ctx.getImageData(x, y, 1, 1).data;
        const rgb = `rgb(${r}, ${g}, ${b})`;
        const hex = `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`;
        this.callback({ rgb, hex });
        this.raf = requestAnimationFrame(loop);
      };
      loop();
    }

    stop() {
      if (this.raf) cancelAnimationFrame(this.raf);
      if (this.video.srcObject) {
        this.video.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  }

  inject('colorDetector', ColorDetector);
}
