// index.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 파싱 허용

// 테스트용 라우터
app.get('/', (req, res) => {
  res.send('✅ 서버 작동 중입니다');
});

// 5000번 포트에서 서버 실행
app.listen(5000, () => {
  console.log('🚀 서버 실행 중: http://localhost:5000');
});

// 서버 시작 시 uploads 폴더 없으면 생성
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


// Multer 설정: 파일 저장 경로 지정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 저장 폴더
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename); // 업로드 시 파일명
  }
});


const upload = multer({ storage });


// POST /api/pixelate: 이미지 업로드 + 픽셀화 처리
app.post('/api/pixelate', upload.single('image'), async (req, res) => {
  try {
    const inputPath = req.file.path; // 업로드된 원본
    const outputPath = `uploads/pixelated-${req.file.filename}`;

    // Sharp로 픽셀화 처리 (리사이즈 → 원래 크기로 리사이즈)
    await sharp(inputPath)
      .resize(20) // 작게 줄이고
      .resize(256, 256, { kernel: sharp.kernel.nearest }) // 다시 키움 → 픽셀화 느낌
      .toFile(outputPath);

    // 결과 이미지 전송
    res.sendFile(path.resolve(outputPath));
  } catch (err) {
    console.error(err);
    res.status(500).send('이미지 처리 중 오류 발생');
  }
});