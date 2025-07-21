import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

function ImageUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 미리보기용 base64 이미지
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 서버에 이미지 전송
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/pixelate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // ← 이미지를 blob으로 받기
      });

      const imageBlob = new Blob([response.data]);
      const imageUrl = URL.createObjectURL(imageBlob);

      console.log("response from server:", response);
      console.log("imageUrl:", imageUrl);

      setProcessedImage(imageUrl);
    } catch (err) {
      console.error('이미지 처리 실패:', err);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div style={{ textAlign: 'center' }}>
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

      {preview && (
        <div>
          <h3>업로드한 원본 이미지</h3>
          <img src={preview} alt="original preview" style={{ maxWidth: '300px' }} />
        </div>
      )}

      {processedImage && (
        <div style={{ marginTop: '30px' }}>
          <h3>픽셀화된 결과 이미지</h3>
          <img src={processedImage} alt="pixelated result" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
