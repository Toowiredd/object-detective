import * as tf from '@tensorflow/tfjs';
import { YOLOv5 } from 'yolov5';
import { updateCounts } from './storage';

// Polyfill for setTimeout if not defined
if (typeof setTimeout === 'undefined') {
  global.setTimeout = (fn, ms) => {
    const start = Date.now();
    const check = () => {
      if (Date.now() - start >= ms) {
        fn();
      } else {
        global.requestAnimationFrame(check);
      }
    };
    global.requestAnimationFrame(check);
  };
}

const detectAndTrackObjects = async (video, canvas, setCounts) => {
  const yolo = new YOLOv5();

  await yolo.load();
  const ctx = canvas.getContext('2d');

  const processFrame = async () => {
    const predictions = await yolo.detect(video);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.bbox;
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.fillText(`ID: ${prediction.class}`, x, y > 10 ? y - 5 : 10);
    });

    updateCounts(predictions, setCounts);
    requestAnimationFrame(processFrame);
  };

  processFrame();
};

export { detectAndTrackObjects };