// Canvas ve context'i al
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Kontrol elemanlarını al
const radiusSlider = document.getElementById('radiusSlider');
const radiusValue = document.getElementById('radiusValue');
const colorPicker = document.getElementById('colorPicker');
const colorValue = document.getElementById('colorValue');

// Başlangıç değerleri
let radius = parseInt(radiusSlider.value);
let fillColor = colorPicker.value;

// Canvas'ın merkezini hesapla
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

/**
 * Canvas'ı temizle ve daireyi çiz
 */
function drawCircle() {
    // Canvas'ı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Daireyi çiz
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor;
    ctx.fill();
    
    // İsteğe bağlı: Daire kenarına çizgi ekle
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke();
}

/**
 * Yarıçap slider değiştiğinde
 */
radiusSlider.addEventListener('input', (e) => {
    radius = parseInt(e.target.value);
    radiusValue.textContent = radius;
    drawCircle();
});

/**
 * Renk picker değiştiğinde
 */
colorPicker.addEventListener('input', (e) => {
    fillColor = e.target.value;
    colorValue.textContent = fillColor;
    drawCircle();
});

// İlk çizimi yap
drawCircle();

