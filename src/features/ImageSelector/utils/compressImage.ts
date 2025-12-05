import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

/**
 * 이미지를 압축하여 파일 크기를 줄입니다.
 * 이미 작은 파일은 압축을 건너뜁니다.
 */
export async function compressImage(file: File, options?: CompressionOptions): Promise<File> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const maxSizeBytes = (mergedOptions.maxSizeMB ?? 1) * 1024 * 1024;

  // 이미 작은 파일은 압축 스킵
  if (file.size <= maxSizeBytes) {
    return file;
  }

  try {
    const compressedFile = await imageCompression(file, mergedOptions);

    return compressedFile;
  } catch (error) {
    // 압축 실패 시 원본 반환
    return file;
  }
}
