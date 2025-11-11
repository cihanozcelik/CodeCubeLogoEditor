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
 * Yarım chevron çiz
 * @param {number} xStartPosition - Başlangıç x pozisyonu
 * @param {number} width - Genişlik
 * @param {number} length - Uzunluk
 * @param {number} angle - Ana açı (derece)
 * @param {number} upperLineAngle - Üst çizgi açısı (derece)
 * @param {string} color - Renk
 */
function drawHalfChevron(xStartPosition, width, length, angle, upperLineAngle, color) {
    // Açıları radyana çevir
    const angleRad = (angle * Math.PI) / 180;
    const upperLineAngleRad = (upperLineAngle * Math.PI) / 180;
    
    // 1- p0: y=0, x=xStartPosition - (width/2)
    const p0 = {
        x: xStartPosition - (width / 2),
        y: centerY
    };
    
    // 2- p1: p0'dan angle açıda yukarı doğru length uzaklıkta
    const p1 = {
        x: p0.x + length * Math.sin(angleRad),
        y: p0.y - length * Math.cos(angleRad)
    };
    
    // 3- p3: y=0, x=xStartPosition + (width/2)
    const p3 = {
        x: xStartPosition + (width / 2),
        y: centerY
    };
    
    // 4- pTemp: p3'ten angle açıda yukarı doğru length uzaklıkta
    const pTemp = {
        x: p3.x + length * Math.sin(angleRad),
        y: p3.y - length * Math.cos(angleRad)
    };
    
    // 5- p2: p1'den aşağı doğru upperLineAngle açıda giden doğru ile p3-pTemp çizgisinin kesişimi
    // p1'den giden doğru: p1 + t * (sin(upperLineAngle), cos(upperLineAngle))
    // p3-pTemp doğrusu: p3 + s * (pTemp - p3)
    
    const dirP1x = Math.sin(upperLineAngleRad);
    const dirP1y = Math.cos(upperLineAngleRad);
    
    const dirP3x = pTemp.x - p3.x;
    const dirP3y = pTemp.y - p3.y;
    
    // Kesişim hesabı: p1 + t*dir1 = p3 + s*dir3
    // p1.x + t*dirP1x = p3.x + s*dirP3x
    // p1.y + t*dirP1y = p3.y + s*dirP3y
    
    const det = dirP1x * dirP3y - dirP1y * dirP3x;
    const t = ((p3.x - p1.x) * dirP3y - (p3.y - p1.y) * dirP3x) / det;
    
    const p2 = {
        x: p1.x + t * dirP1x,
        y: p1.y + t * dirP1y
    };
    
    // 6- p0, p1, p2, p3 noktalarını birleştir
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

/**
 * Sol chevron çiz (< şekli)
 */
function drawLeftChevron() {
    // Test için drawHalfChevron'u çağır
    const xStart = centerX - params.spacing;
    drawHalfChevron(xStart, params.width, params.chevronLength, 90 - params.angle, 90- params.angle, params.color);
    drawHalfChevron(centerX - params.spacing, params.width, params.chevronLength, 90 +params.angle, -(90- params.angle), params.color);
}

/**
 * Orta slash çiz (/ şekli)
 */
function drawSlash() {
    const xStart = centerX;
    drawHalfChevron(xStart, params.width, params.chevronLength+ params.slashDiff, 90 - params.angle, 90, params.color);
    drawHalfChevron(xStart, params.width, params.chevronLength+ params.slashDiff, 180 + (90 - params.angle), 90, params.color);
    
}

/**
 * Sağ chevron çiz (> şekli)
 */
function drawRightChevron() {
    // Test için drawHalfChevron'u çağır
    const xStart = centerX + params.spacing;
    drawHalfChevron(xStart, -params.width, params.chevronLength, -(90 - params.angle), -(90 - params.angle), params.color);
    drawHalfChevron(xStart, -params.width, params.chevronLength, -(90 + params.angle), (90 - params.angle), params.color);
}

/**
 * Logoyu çiz
 */
function drawLogo() {
    // Canvas'ı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sol chevron ve slash'i çiz
    drawLeftChevron();
    drawRightChevron();
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

/**
 * SVG olarak download et
 */
document.getElementById('downloadSvg').addEventListener('click', () => {
    // SVG string oluştur
    const svgWidth = 600;
    const svgHeight = 600;
    
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
`;

    // Her polygon için SVG path oluştur
    // drawHalfChevron fonksiyonunu SVG'ye çevir
    function generateSVGPolygon(xStartPosition, width, length, angle, upperLineAngle, color) {
        const angleRad = (angle * Math.PI) / 180;
        const upperLineAngleRad = (upperLineAngle * Math.PI) / 180;
        
        const p0 = {
            x: xStartPosition - (width / 2),
            y: centerY
        };
        
        const p1 = {
            x: p0.x + length * Math.sin(angleRad),
            y: p0.y - length * Math.cos(angleRad)
        };
        
        const p3 = {
            x: xStartPosition + (width / 2),
            y: centerY
        };
        
        const pTemp = {
            x: p3.x + length * Math.sin(angleRad),
            y: p3.y - length * Math.cos(angleRad)
        };
        
        const dirP1x = Math.sin(upperLineAngleRad);
        const dirP1y = Math.cos(upperLineAngleRad);
        const dirP3x = pTemp.x - p3.x;
        const dirP3y = pTemp.y - p3.y;
        
        const det = dirP1x * dirP3y - dirP1y * dirP3x;
        const t = ((p3.x - p1.x) * dirP3y - (p3.y - p1.y) * dirP3x) / det;
        
        const p2 = {
            x: p1.x + t * dirP1x,
            y: p1.y + t * dirP1y
        };
        
        return `  <polygon points="${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="${color}" />\n`;
    }
    
    // Sol chevron
    const xStartLeft = centerX - params.spacing;
    svgContent += generateSVGPolygon(xStartLeft, params.width, params.chevronLength, 90 - params.angle, 90 - params.angle, params.color);
    svgContent += generateSVGPolygon(centerX - params.spacing, params.width, params.chevronLength, 90 + params.angle, -(90 - params.angle), params.color);
    
    // Sağ chevron
    const xStartRight = centerX + params.spacing;
    svgContent += generateSVGPolygon(xStartRight, -params.width, params.chevronLength, -(90 - params.angle), -(90 - params.angle), params.color);
    svgContent += generateSVGPolygon(xStartRight, -params.width, params.chevronLength, -(90 + params.angle), (90 - params.angle), params.color);
    
    // Slash
    const xStartCenter = centerX;
    svgContent += generateSVGPolygon(xStartCenter, params.width, params.chevronLength + params.slashDiff, 90 - params.angle, 90, params.color);
    svgContent += generateSVGPolygon(xStartCenter, params.width, params.chevronLength + params.slashDiff, 180 + (90 - params.angle), 90, params.color);
    
    svgContent += `</svg>`;
    
    // Download
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'codecube-logo.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
});

