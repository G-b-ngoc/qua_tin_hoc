// ==========================================
// CẤU HÌNH DỄ DÀNG THAY ĐỔI
// ==========================================
const GIFT_CONFIG = {
    // Câu hỏi mở quà
    // question: "16 + 03 + 209 + 180 + 109 + 209 + 789 + 289 + 5 = ?",
    question: "3000 - 1191 + 8 × 7 - 56 + 144 ÷ 12 - 12 + 25 × 4 - 100 + 360 ÷ 6 - 60 = ?",
    // Mật khẩu đúng (Tự động chuyển thành chữ thường khi so sánh)
    correctPassword: "1809",
    // Link file đính kèm (Có thể thay bằng link Google Drive, Ảnh, Video, File PDF...)
    attachmentUrl: "https://drive.google.com/file/d/1JeCkmap05lh3rvntPODpZi-k6E7vJ2xf/view?usp=sharing", 
    // Lời chúc hiển thị sau khi mở quà
    // message: "Chúc mừng bạn đã mở thành công hộp quà bí mật! Nhấn vào nút bên dưới để nhận món quà được chuẩn bị dành riêng cho bạn."
};

// ==========================================
// KHO TÀI NGUYÊN & XỬ LÝ SỰ KIỆN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const quizCard = document.getElementById('quizCard');
    const questionTitle = document.getElementById('questionTitle');
    const answerInput = document.getElementById('answerInput');
    const submitBtn = document.getElementById('submitBtn');
    const errorMessage = document.getElementById('errorMessage');

    const giftContainer = document.getElementById('giftContainer');
    const giftBox = document.getElementById('giftBox');

    const secretCard = document.getElementById('secretCard');
    const giftMessage = document.getElementById('giftMessage');
    const downloadBtn = document.getElementById('downloadBtn');

    // Thiết lập nội dung ban đầu từ cấu hình
    questionTitle.textContent = GIFT_CONFIG.question;
    giftMessage.textContent = GIFT_CONFIG.message;
    downloadBtn.href = GIFT_CONFIG.attachmentUrl;

    // Khởi tạo hiệu ứng hạt lấp lánh ở phông nền
    initCanvasParticles();

    // Sự kiện kiểm tra mật khẩu
    submitBtn.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    function checkAnswer() {
        const userAnwer = answerInput.value.trim().toLowerCase();
        const correctAnswer = GIFT_CONFIG.correctPassword.trim().toLowerCase();

        if (userAnwer === correctAnswer) {
            // Mật khẩu đúng -> Chuyển sang bước Hộp Quà
            errorMessage.style.display = 'none';
            quizCard.classList.add('hidden');
            giftContainer.classList.remove('hidden');
        } else {
            // Mật khẩu sai -> Hiển thị lỗi & Rung lắc
            errorMessage.style.display = 'block';
            quizCard.style.animation = 'none';
            quizCard.offsetHeight; // Trigger reflow
            quizCard.style.animation = 'shake 0.4s ease-in-out';
        }
    }

    // Sự kiện Click Mở Hộp Quà
    let isOpened = false;
    giftContainer.addEventListener('click', () => {
        if (isOpened) return;
        isOpened = true;

        // Bật hiệu ứng mở nắp hộp
        giftBox.classList.add('open');

        // Bắn pháo hoa hiệu ứng
        launchConfetti();

        // Chờ hiệu ứng mở hộp xong rồi hiện Thiệp/Món quà
        setTimeout(() => {
            giftContainer.classList.add('hidden');
            secretCard.classList.remove('hidden');
        }, 1000);
    });
});

// ==========================================
// HIỆU ỨNG PHÁO HOA (CONFETTI)
// ==========================================
function launchConfetti() {
    if (typeof confetti === 'function') {
        // Đợt 1: Bắn pháo hoa trung tâm
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#f3e5ab', '#b31238', '#ffffff']
        });

        // Đợt 2: Bắn hai bên
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#d4af37', '#f3e5ab', '#b31238']
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#d4af37', '#f3e5ab', '#b31238']
            });
        }, 250);
    }
}

// ==========================================
// HIỆU ỨNG BACKGROUND PARTICLES (ÁNH KIM)
// ==========================================
function initCanvasParticles() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            color: Math.random() > 0.3 ? 'rgba(212, 175, 55, ' : 'rgba(255, 232, 235, ',
            alpha: Math.random() * 0.6 + 0.2,
            speedY: -Math.random() * 0.5 - 0.2,
            speedX: Math.random() * 0.4 - 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;

            if (p.y < 0) p.y = height;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}
