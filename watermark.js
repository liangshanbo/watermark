/*
 * @Author: longhai.wang
 * @Date: 2019-07-26 10:35:05
 * @LastEditors: longhai.wang
 * @LastEditTime: 2019-07-29 17:39:34
 * @Description: 设计一个能覆盖公司 Web 端的水印模块，且业务代码无需更改，说明实现细节；
 * @jira: 20190729-homework
 */
((global = {}) => {
  const { waterMarkerConfig = {} } = global;
  const log = (key) => {
    const params = {
      entry_key: `watermark.${key}`,
      entry_detail: {
        timestamp: Date.now(),
        location: window.location.href,
        userAgent: window.navigator.userAgent,
      },
    };
    window.navigator.sendBeacon('https://stat.html5shanbo.com/app/log', JSON.stringify(params));
  };

  const drawByCanvas = (text, color, fontSize) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const textWidth = Math.ceil(ctx.measureText(text).width);
    canvas.width = textWidth + (3 * fontSize);
    canvas.height = (textWidth * Math.sin((30 / 180) * Math.PI)) + (3 * fontSize);
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px Arial`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((-30 * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2);
    return `url(${canvas.toDataURL('image/png')})`;
  };

  const addWaterMarker = (text = 'watermark', color = 'rgba(128, 128, 128, 0.08)', fontSize = 16) => {
    const waterMarker = document.createElement('div');
    waterMarker.style.top = '0';
    waterMarker.style.left = '0';
    waterMarker.style.right = '0';
    waterMarker.style.bottom = '0';
    waterMarker.style.zIndex = '9999';
    waterMarker.style.position = 'fixed';
    waterMarker.style.pointerEvents = 'none';
    waterMarker.style.backgroundImage = drawByCanvas(text, color, fontSize);
    document.body.appendChild(waterMarker);
    waterMarker.addEventListener('DOMNodeRemoved', () => {
      log('remove');
      setTimeout(() => {
        log('re_insert');
        addWaterMarker(waterMarkerConfig.text, waterMarkerConfig.color, waterMarkerConfig.fontSize);
      }, 0);
    });
  };
  addWaterMarker(waterMarkerConfig.text, waterMarkerConfig.color, waterMarkerConfig.fontSize);
})(window || global);

// export default addWaterMarker;
