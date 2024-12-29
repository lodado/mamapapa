"use client";

import { cn } from "@/shared";
import { Image, ImageProps, ScreenReaderOnly } from "@/shared/ui";
import { User } from "lucide-react";

interface WrappedImageProps extends Omit<ImageProps, "src"> {
  src?: string;
}

/**
 * `WrappedImage` is a component that wraps around the `Image` component.
 * It displays an image if the `src` is provided; otherwise, it renders a fallback profile component.
 *
 * Props:
 * - `src` (string, optional): The source URL of the image. If not provided, the fallback profile component is rendered.
 * - `alt` (string): The alternative text for the image, required if `src` is provided.
 * - Other optional props include `width`, `height`, and additional props passed to the Image component.
 *
 * Example usage:
 * ```jsx
 * <WrappedImage
 *   src="https://example.com/path/to/image.jpg"
 *   alt="Profile picture"
 *   width={100}
 *   height={100}
 * />
 * ```
 */
const UserProfile = ({ src, alt, width, height, className, ...rest }: WrappedImageProps) => {
  return src ? (
    <Image src={src} alt={alt} width={width} height={height} className={cn("rounded-full", className)} {...rest} />
  ) : (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className="border border-solid border-color-icon-disabled bg-background rounded-full flex items-center justify-center"
    >
      <User className="w-[60%] h-[60%] text-color-text-disabled" />
      <ScreenReaderOnly>{alt ?? "User Profile picture"}</ScreenReaderOnly>
    </div>
  );
};

export default UserProfile;
