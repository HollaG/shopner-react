import { useRef, useState } from "react";
import missingImg from "../../missing.png";
const ImageWithFallback: React.FC<{
    alt: string;
    src: string;
    fallback?: string;
    className?: string;
}> = ({ src, fallback, alt, className }) => {
    /* An earlier version of this file used state in order to manage the displayed image.
    However, this caused a bug where the image would not be updated the user added a new site, resulting in mismatched image to url.
    Hence, this REF implementation was used. */

    const imgRef = useRef<HTMLImageElement>(null);
    const missingImageHandler = () => {
        if (fallback && imgRef && imgRef.current) {
            if (imgRef.current.src === src) {
                imgRef.current.src = fallback;
            } else if (imgRef.current.src === fallback) {
                imgRef.current.src = missingImg;
            }
        }
    };

    return (
        <img
            ref={imgRef}
            className={className}
            src={src}
            alt={alt}
            onError={() => {
                missingImageHandler();
            }}
        />
    );
};

export default ImageWithFallback;
