export const drawImageOnCanvas = (
  imageUrl: string,
  image: { x: number; y: number; width: number; height: number },
  canvas: HTMLCanvasElement
) => {
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 1;
    const { x, y, width, height } = image;

    // 캔버스 크기 설정
    canvas.width = width * scale;
    canvas.height = height * scale;

    // 얼굴 크롭 및 확대 그리기
    ctx.drawImage(
      img,
      x,
      y,
      width,
      height, // 원본 이미지에서 얼굴 영역 크롭
      0,
      0,
      width * scale,
      height * scale // 캔버스에 확대하여 그리기
    );
  };
};
