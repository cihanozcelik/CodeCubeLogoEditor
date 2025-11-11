// Canvas ve context'i al
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Kontrol elemanlarını al
const angleSlider = document.getElementById('angleSlider');
const angleValue = document.getElementById('angleValue');
const widthSlider = document.getElementById('widthSlider');
const widthValue = document.getElementById('widthValue');
const chevronLengthSlider = document.getElementById('chevronLengthSlider');
const chevronLengthValue = document.getElementById('chevronLengthValue');
const slashDiffSlider = document.getElementById('slashDiffSlider');
const slashDiffValue = document.getElementById('slashDiffValue');
const spacingSlider = document.getElementById('spacingSlider');
const spacingValue = document.getElementById('spacingValue');
const colorPicker = document.getElementById('colorPicker');
const colorValue = document.getElementById('colorValue');

// Parametreler
let params = {
    angle: parseInt(angleSlider.value),           // Parallelogram açısı (derece)
    width: parseInt(widthSlider.value),           // Parallelogram genişliği
    chevronLength: parseInt(chevronLengthSlider.value),  // Chevron parçalarının uzunluğu
    slashDiff: parseInt(slashDiffSlider.value),   // Slash'in chevron'dan ne kadar uzun olacağı
    spacing: parseInt(spacingSlider.value),        // Chevron ile slash arası boşluk
    color: colorPicker.value
};

// Canvas'ın merkezini hesapla
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

/**
 * Parallelogram çiz
 * @param {number} x - Başlangıç x koordinatı
 * @param {number} y - Başlangıç y koordinatı
 * @param {number} length - Uzunluk
 * @param {number} width - Genişlik
 * @param {number} angle - Açı (derece)
 */
function drawParallelogram(x, y, length, width, angle) {
    const angleRad = (angle * Math.PI) / 180;
    const offset = width / Math.tan(angleRad);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y);
    ctx.lineTo(x + length + offset, y + width);
    ctx.lineTo(x + offset, y + width);
    ctx.closePath();
    ctx.fillStyle = params.color;
    ctx.fill();
}

/**
 * Sol chevron çiz (< şekli)
 */
function drawLeftChevron() {
    const angleRad = (params.angle * Math.PI) / 180;
    const offset = params.width / Math.tan(angleRad);
    
    // Chevron'un toplam yüksekliği
    const totalHeight = params.chevronLength * 2 + params.width;
    
    // Başlangıç pozisyonu (merkeze göre)
    const startX = centerX - params.chevronLength - offset - params.spacing - params.slashDiff / 2;
    const startY = centerY - totalHeight / 2;
    
    // Üst parallelogram
    drawParallelogram(startX, startY, params.chevronLength, params.width, params.angle);
    
    // Alt parallelogram
    drawParallelogram(startX, startY + params.chevronLength + params.width, params.chevronLength, params.width, params.angle);
}

/**
 * Orta slash çiz (/ şekli)
 */
function drawSlash() {
    // Slash'in dikey uzunluğu - genişlikten bağımsız
    const slashHeight = params.chevronLength * 2 + params.slashDiff;
    const angleRad = (params.angle * Math.PI) / 180;
    
    // Açıya göre yatay kaydırma - slash'in ne kadar yatık olacağı
    const horizontalOffset = slashHeight / Math.tan(angleRad);
    
    // Merkez noktadan başla - genişlik merkezlemeyi etkilememeli
    const startX = centerX - (horizontalOffset + params.width) / 2;
    const startY = centerY - slashHeight / 2;
    
    // Parallelogram - üst ve alt kenarlar yatay, açıyla sağa yatık
    ctx.beginPath();
    ctx.moveTo(startX + horizontalOffset, startY);                 // Sol üst köşe
    ctx.lineTo(startX + horizontalOffset + params.width, startY);  // Sağ üst köşe (yatay)
    ctx.lineTo(startX + params.width, startY + slashHeight);       // Sağ alt köşe
    ctx.lineTo(startX, startY + slashHeight);                      // Sol alt köşe (yatay)
    ctx.closePath();
    ctx.fillStyle = params.color;
    ctx.fill();
}

/**
 * Sağ chevron çiz (> şekli)
 */
function drawRightChevron() {
    const angleRad = (params.angle * Math.PI) / 180;
    const offset = params.width / Math.tan(angleRad);
    
    // Chevron'un toplam yüksekliği
    const totalHeight = params.chevronLength * 2 + params.width;
    
    // Başlangıç pozisyonu (merkeze göre, sağ tarafta ve ters açıda)
    const startX = centerX + params.spacing + params.slashDiff / 2;
    const startY = centerY - totalHeight / 2;
    
    // Sağ chevron için açıyı tersine çevir (180 - angle)
    const rightAngle = 180 - params.angle;
    const rightAngleRad = (rightAngle * Math.PI) / 180;
    const rightOffset = params.width / Math.tan(rightAngleRad);
    
    // Üst parallelogram (sağa bakan)
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + params.chevronLength, startY);
    ctx.lineTo(startX + params.chevronLength + rightOffset, startY + params.width);
    ctx.lineTo(startX + rightOffset, startY + params.width);
    ctx.closePath();
    ctx.fillStyle = params.color;
    ctx.fill();
    
    // Alt parallelogram (sağa bakan)
    ctx.beginPath();
    ctx.moveTo(startX, startY + params.chevronLength + params.width);
    ctx.lineTo(startX + params.chevronLength, startY + params.chevronLength + params.width);
    ctx.lineTo(startX + params.chevronLength + rightOffset, startY + params.chevronLength + params.width * 2);
    ctx.lineTo(startX + rightOffset, startY + params.chevronLength + params.width * 2);
    ctx.closePath();
    ctx.fillStyle = params.color;
    ctx.fill();
}

/**
 * Logoyu çiz
 */
function drawLogo() {
    // Canvas'ı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sadece slash'i çiz
    drawSlash();
}

/**
 * Slider event listener'ları
 */
angleSlider.addEventListener('input', (e) => {
    params.angle = parseInt(e.target.value);
    angleValue.textContent = params.angle;
    drawLogo();
});

widthSlider.addEventListener('input', (e) => {
    params.width = parseInt(e.target.value);
    widthValue.textContent = params.width;
    drawLogo();
});

chevronLengthSlider.addEventListener('input', (e) => {
    params.chevronLength = parseInt(e.target.value);
    chevronLengthValue.textContent = params.chevronLength;
    drawLogo();
});

slashDiffSlider.addEventListener('input', (e) => {
    params.slashDiff = parseInt(e.target.value);
    slashDiffValue.textContent = params.slashDiff;
    drawLogo();
});

spacingSlider.addEventListener('input', (e) => {
    params.spacing = parseInt(e.target.value);
    spacingValue.textContent = params.spacing;
    drawLogo();
});

colorPicker.addEventListener('input', (e) => {
    params.color = e.target.value;
    colorValue.textContent = params.color;
    drawLogo();
});

// İlk çizimi yap
drawLogo();

