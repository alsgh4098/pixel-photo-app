// src/components/ImageUploader.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

function ImageUploader() {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 파일 미리보기 URL 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string); // base64 string
    };
    reader.readAsDataURL(file);

    console.log("업로드된 파일:", file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div style={{ textAlign: 'center' }}>
      {/* 드래그앤드롭 영역 */}
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #aaa',
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <input {...getInputProps()} />
        {isDragActive
          ? <p>이미지를 여기에 드롭하세요</p>
          : <p>클릭하거나 드래그하여 이미지를 업로드하세요</p>}
      </div>

      {/* 이미지 미리보기 */}
      {preview && (
        <div>
          <h3>미리보기</h3>
          <img
            src={preview}
            alt="preview"
            style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
