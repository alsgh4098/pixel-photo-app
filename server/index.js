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


// POST /api/filter: 이미지 업로드 + 필름카메라 효과 처리
app.post('/api/filter', upload.single('image'), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputPath = `uploads/filtered-${req.file.filename}`;

    // 필름카메라 느낌으로 이미지 색감 보정
    await sharp(inputPath)
      .resize(800) // 크기 통일 (선택사항)
      .modulate({
        brightness: 1.05, // 살짝 밝게
        saturation: 1.3,  // 더 선명하게
        hue: 15           // 따뜻한 색감
      })
      .tint('#ffddb3') // 따뜻한 옐로우 필터
      .toFile(outputPath);

    res.sendFile(path.resolve(outputPath));
  } catch (err) {
    console.error(err);
    res.status(500).send('이미지 필터 적용 중 오류 발생');
  }
});
