// Canvas ve context'i al
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Canvas boyutları
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;
const ZOOM_FACTOR = 0.5;

// HiDPI/Retina desteği için canvas'ı yüksek çözünürlükte render et
const dpr = window.devicePixelRatio || 1;

// Canvas internal çözünürlüğünü artır
canvas.width = CANVAS_WIDTH * dpr;
canvas.height = CANVAS_HEIGHT * dpr;

// Context'i scale et - HiDPI için
ctx.scale(dpr, dpr);

// Zoom out için merkeze taşı, scale yap, geri taşı
const centerX = CANVAS_WIDTH / 2;
const centerY = CANVAS_HEIGHT / 2;
ctx.translate(centerX, centerY);
ctx.scale(ZOOM_FACTOR, ZOOM_FACTOR);
ctx.translate(-centerX, -centerY);

// Anti-aliasing ayarları - daha keskin render için
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

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
const numberDistanceBiasSlider = document.getElementById('numberDistanceBiasSlider');
const numberDistanceBiasValue = document.getElementById('numberDistanceBiasValue');
const numberScaleBiasSlider = document.getElementById('numberScaleBiasSlider');
const numberScaleBiasValue = document.getElementById('numberScaleBiasValue');
const iconScaleBiasSlider = document.getElementById('iconScaleBiasSlider');
const iconScaleBiasValue = document.getElementById('iconScaleBiasValue');
const textDistanceSlider = document.getElementById('textDistanceSlider');
const textDistanceValue = document.getElementById('textDistanceValue');
const textScaleBiasSlider = document.getElementById('textScaleBiasSlider');
const textScaleBiasValue = document.getElementById('textScaleBiasValue');
const colorPicker = document.getElementById('colorPicker');
const colorValue = document.getElementById('colorValue');
const textColorPicker = document.getElementById('textColorPicker');
const textColorValue = document.getElementById('textColorValue');

/**
 * URL'den parametreleri oku
 */
function getParamsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Default değerler
    const defaults = {
        angle: 60,
        width: 47,
        chevronLength: 122,
        slashDiff: 60,
        spacing: 34,
        numberDistanceBias: 0,
        numberScaleBias: 0,
        iconScaleBias: 4,
        textDistance: 28,
        textScaleBias: -48,
        color: '#e45545',
        textColor: '#000000'
    };
    
    return {
        angle: urlParams.has('angle') ? parseInt(urlParams.get('angle')) : defaults.angle,
        width: urlParams.has('width') ? parseInt(urlParams.get('width')) : defaults.width,
        chevronLength: urlParams.has('chevronLength') ? parseInt(urlParams.get('chevronLength')) : defaults.chevronLength,
        slashDiff: urlParams.has('slashDiff') ? parseInt(urlParams.get('slashDiff')) : defaults.slashDiff,
        spacing: urlParams.has('spacing') ? parseInt(urlParams.get('spacing')) : defaults.spacing,
        numberDistanceBias: urlParams.has('numberDistanceBias') ? parseInt(urlParams.get('numberDistanceBias')) : defaults.numberDistanceBias,
        numberScaleBias: urlParams.has('numberScaleBias') ? parseInt(urlParams.get('numberScaleBias')) : defaults.numberScaleBias,
        iconScaleBias: urlParams.has('iconScaleBias') ? parseInt(urlParams.get('iconScaleBias')) : defaults.iconScaleBias,
        textDistance: urlParams.has('textDistance') ? parseInt(urlParams.get('textDistance')) : defaults.textDistance,
        textScaleBias: urlParams.has('textScaleBias') ? parseInt(urlParams.get('textScaleBias')) : defaults.textScaleBias,
        color: urlParams.get('color') || defaults.color,
        textColor: urlParams.get('textColor') || defaults.textColor
    };
}

/**
 * Parametreleri URL'e kaydet
 */
function updateURL() {
    const url = new URL(window.location);
    url.searchParams.set('angle', params.angle);
    url.searchParams.set('width', params.width);
    url.searchParams.set('chevronLength', params.chevronLength);
    url.searchParams.set('slashDiff', params.slashDiff);
    url.searchParams.set('spacing', params.spacing);
    url.searchParams.set('numberDistanceBias', params.numberDistanceBias);
    url.searchParams.set('numberScaleBias', params.numberScaleBias);
    url.searchParams.set('iconScaleBias', params.iconScaleBias);
    url.searchParams.set('textDistance', params.textDistance);
    url.searchParams.set('textScaleBias', params.textScaleBias);
    url.searchParams.set('color', params.color);
    url.searchParams.set('textColor', params.textColor);
    window.history.replaceState({}, '', url);
}

// Parametreler - URL'den yükle veya default değerler
let params = getParamsFromURL();

// Renklerin # ile başladığından emin ol ve lowercase yap
if (params.color && !params.color.startsWith('#')) {
    params.color = '#' + params.color;
}
params.color = params.color.toLowerCase();

if (params.textColor && !params.textColor.startsWith('#')) {
    params.textColor = '#' + params.textColor;
}
params.textColor = params.textColor.toLowerCase();

// Slider'ları URL'deki değerlere göre ayarla
angleSlider.value = params.angle;
angleValue.textContent = params.angle;
widthSlider.value = params.width;
widthValue.textContent = params.width;
chevronLengthSlider.value = params.chevronLength;
chevronLengthValue.textContent = params.chevronLength;
slashDiffSlider.value = params.slashDiff;
slashDiffValue.textContent = params.slashDiff;
spacingSlider.value = params.spacing;
spacingValue.textContent = params.spacing;
numberDistanceBiasSlider.value = params.numberDistanceBias;
numberDistanceBiasValue.textContent = params.numberDistanceBias;
numberScaleBiasSlider.value = params.numberScaleBias;
numberScaleBiasValue.textContent = params.numberScaleBias;
iconScaleBiasSlider.value = params.iconScaleBias;
iconScaleBiasValue.textContent = params.iconScaleBias;
textDistanceSlider.value = params.textDistance;
textDistanceValue.textContent = params.textDistance;
textScaleBiasSlider.value = params.textScaleBias;
textScaleBiasValue.textContent = params.textScaleBias;

// Color picker'ları güncelle
colorValue.textContent = params.color;
textColorValue.textContent = params.textColor;

// Tarayıcı render'ını bekle, sonra değerleri set et
requestAnimationFrame(() => {
    colorPicker.value = params.color;
    colorPicker.setAttribute('value', params.color);
    colorPicker.dispatchEvent(new Event('input', { bubbles: true }));
    colorPicker.dispatchEvent(new Event('change', { bubbles: true }));
    
    textColorPicker.value = params.textColor;
    textColorPicker.setAttribute('value', params.textColor);
    textColorPicker.dispatchEvent(new Event('input', { bubbles: true }));
    textColorPicker.dispatchEvent(new Event('change', { bubbles: true }));
});

// centerX ve centerY yukarıda tanımlandı (CANVAS_WIDTH/2, CANVAS_HEIGHT/2)

// Hugging Face API configuration
const HF_API_KEY = 'hf_XHHKVRNQKwYmVDZYkvUlLm11AtexmAilXs';
// Daha küçük model dene - CORS friendly olabilir
const HF_MODEL = 'microsoft/DialoGPT-medium';

// Logo3.svg'yi yükle
const logo3Image = new Image();
logo3Image.onload = () => {
    drawLogo(); // Resim yüklenince tekrar çiz
};
logo3Image.src = 'Logo3.svg';

// Logo3.svg içeriğini text olarak yükle (SVG export için)
let logo3SvgContent = '';
let logo3IsLoading = true;

// Async olarak yükle
(async () => {
    try {
        const response = await fetch('Logo3.svg');
        logo3SvgContent = await response.text();
        logo3IsLoading = false;
        console.log('Logo3.svg yüklendi');
    } catch (err) {
        console.error('Logo3.svg yüklenemedi:', err);
        logo3IsLoading = false;
    }
})();

// CodeCubeText.svg'yi Image olarak yükle (canvas için)
const codeCubeTextImage = new Image();
codeCubeTextImage.onload = () => {
    drawLogo(); // Resim yüklenince tekrar çiz
};
codeCubeTextImage.src = 'CodeCubeText.svg';

// CodeCubeText.svg içeriğini text olarak yükle (SVG export için)
let codeCubeTextSvgContent = '';
let codeCubeTextIsLoading = true;

// Async olarak yükle
(async () => {
    try {
        const response = await fetch('CodeCubeText.svg');
        codeCubeTextSvgContent = await response.text();
        codeCubeTextIsLoading = false;
        console.log('CodeCubeText.svg yüklendi');
    } catch (err) {
        console.error('CodeCubeText.svg yüklenemedi:', err);
        codeCubeTextIsLoading = false;
    }
})();

/**
 * Yarım chevron noktalarını hesapla
 * @param {number} xStartPosition - Başlangıç x pozisyonu
 * @param {number} width - Genişlik
 * @param {number} length - Uzunluk
 * @param {number} angle - Ana açı (derece)
 * @param {number} upperLineAngle - Üst çizgi açısı (derece)
 * @returns {Object} {p0, p1, p2, p3} noktaları
 */
function calculateHalfChevron(xStartPosition, width, length, angle, upperLineAngle) {
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
    const dirP1x = Math.sin(upperLineAngleRad);
    const dirP1y = Math.cos(upperLineAngleRad);
    
    const dirP3x = pTemp.x - p3.x;
    const dirP3y = pTemp.y - p3.y;
    
    // Kesişim hesabı
    const det = dirP1x * dirP3y - dirP1y * dirP3x;
    const t = ((p3.x - p1.x) * dirP3y - (p3.y - p1.y) * dirP3x) / det;
    
    const p2 = {
        x: p1.x + t * dirP1x,
        y: p1.y + t * dirP1y
    };
    
    return { p0, p1, p2, p3 };
}

/**
 * Yarım chevron çiz
 * @param {number} xStartPosition - Başlangıç x pozisyonu
 * @param {number} width - Genişlik
 * @param {number} length - Uzunluk
 * @param {number} angle - Ana açı (derece)
 * @param {number} upperLineAngle - Üst çizgi açısı (derece)
 * @param {string} color - Renk
 * @returns {Object} {p0, p1, p2, p3} noktaları
 */
function drawHalfChevron(xStartPosition, width, length, angle, upperLineAngle, color) {
    // Noktaları hesapla
    const { p0, p1, p2, p3 } = calculateHalfChevron(xStartPosition, width, length, angle, upperLineAngle);
    
    // Polygon çiz
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    
    // Noktaları geri döndür
    return { p0, p1, p2, p3 };
}


function calculateMinChevronDistance(){
    const { p0, p1, p2, p3 } = calculateHalfChevron(centerX, params.width, params.chevronLength, 90 - params.angle, 90);
    
    // p2'den 90 - params.angle açıyla aşağı doğru giden çizgi
    const angleRad = ((90 - params.angle) * Math.PI) / 180;
    
    // Yön vektörü (aşağı doğru)
    const dirX = Math.sin(angleRad);
    const dirY = Math.cos(angleRad);
    
    // p2 + t * (dirX, dirY) = (x, centerY)
    // p2.y + t * dirY = centerY
    // t = (centerY - p2.y) / dirY
    
    const t = (centerY - p2.y) / dirY;
    
    const intersectionX = p2.x + t * dirX;
    
    return (intersectionX - params.width/2) - centerX;
}
/**
 * Sol chevron çiz (< şekli)
 */
function drawLeftChevron() {
    // Test için drawHalfChevron'u çağır
    const minChevronDistance = calculateMinChevronDistance();
    const xStart = centerX - minChevronDistance - params.spacing;
    const leftChevron1 = drawHalfChevron(xStart, params.width, params.chevronLength, 90 - params.angle, 90- params.angle, params.color);
    const leftChevron2 = drawHalfChevron(xStart, params.width, params.chevronLength, 90 +params.angle, -(90- params.angle), params.color);
    
    return { leftChevron1, leftChevron2 };
}

/**
 * Orta slash çiz (/ şekli)
 */
function drawSlash() {
    const xStart = centerX;
    const slash1 = drawHalfChevron(xStart, params.width, params.chevronLength+ params.slashDiff, 90 - params.angle, 90, params.color);
    const slash2 = drawHalfChevron(xStart, params.width, params.chevronLength+ params.slashDiff, 180 + (90 - params.angle), 90, params.color);
    
    return { slash1, slash2 };
}

/**
 * Sağ chevron çiz (> şekli)
 */
function drawRightChevron() {
    // Test için drawHalfChevron'u çağır
    const minChevronDistance = calculateMinChevronDistance();
    const xStart = centerX + minChevronDistance + params.spacing;
    const rightChevron1 = drawHalfChevron(xStart, -params.width, params.chevronLength, -(90 - params.angle), -(90 - params.angle), params.color);
    const rightChevron2 = drawHalfChevron(xStart, -params.width, params.chevronLength, -(90 + params.angle), (90 - params.angle), params.color);
    
    return { rightChevron1, rightChevron2 };
}

/**
 * İki doğrunun kesişim noktasını bul
 */
function findLineIntersection(p1, p2, p3, p4) {
    // p1-p2 doğrusu ve p3-p4 doğrusunun kesişimi
    const x1 = p1.x, y1 = p1.y;
    const x2 = p2.x, y2 = p2.y;
    const x3 = p3.x, y3 = p3.y;
    const x4 = p4.x, y4 = p4.y;
    
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    
    if (Math.abs(denom) < 0.0001) {
        return null; // Paralel çizgiler
    }
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    
    return {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1)
    };
}

/**
 * Logoyu çiz
 */
function drawLogo() {
    // Canvas'ı tamamen temizle
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset all transforms
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Önce noktaları hesapla - geçici çizim yap
    const tempLeftChevrons = drawLeftChevron();
    const tempRightChevrons = drawRightChevron();
    const tempSlashes = drawSlash();
    
    // Logo'nun en üst ve en alt noktalarını bul
    let logoTopY = centerY;
    let logoBottomY = centerY;
    
    if (tempSlashes) {
        const allYPoints = [
            tempSlashes.slash1.p0.y,
            tempSlashes.slash1.p1.y,
            tempSlashes.slash1.p2.y,
            tempSlashes.slash1.p3.y,
            tempSlashes.slash2.p0.y,
            tempSlashes.slash2.p1.y,
            tempSlashes.slash2.p2.y,
            tempSlashes.slash2.p3.y
        ];
        logoTopY = Math.min(...allYPoints);
        logoBottomY = Math.max(...allYPoints);
        
        // Icon scale bias'ı uygula - logo noktalarını merkeze göre scale et
        const iconScaleFactor = 1 + (params.iconScaleBias / 100);
        logoTopY = centerY + (logoTopY - centerY) * iconScaleFactor;
        logoBottomY = centerY + (logoBottomY - centerY) * iconScaleFactor;
    }
    
    // Text yüksekliğini hesapla
    let textBottomY = logoBottomY;
    if (codeCubeTextImage.complete) {
        const textScaleFactor = 1 + (params.textScaleBias / 100);
        const baseTextWidth = 1200; // 3x boyut - bias 0'da bu genişlikte
        const textWidth = baseTextWidth * textScaleFactor;
        const textHeight = (codeCubeTextImage.height / codeCubeTextImage.width) * textWidth;
        // Text Y pozisyonu: icon'un alt noktası + textDistance
        const textY = logoBottomY + params.textDistance;
        textBottomY = textY + textHeight;
    }
    
    // Toplam yükseklik ve ortalama offset
    const totalHeight = textBottomY - logoTopY;
    const currentMidpoint = (logoTopY + textBottomY) / 2;
    const desiredMidpoint = centerY;
    const verticalOffset = desiredMidpoint - currentMidpoint;
    
    // Geçici çizimi temizle
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Offset ile tekrar çiz
    ctx.save();
    ctx.translate(0, verticalOffset);
    
    // Icon scale bias uygula - icon'ları grup olarak scale et
    const iconScaleFactor = 1 + (params.iconScaleBias / 100);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(iconScaleFactor, iconScaleFactor);
    ctx.translate(-centerX, -centerY);
    
    // Sol chevron ve slash'i çiz
    const leftChevrons = drawLeftChevron();
    const rightChevrons = drawRightChevron();
    const slashes = drawSlash();
    
    // Logo yüksekliğini hesapla (text hariç) - slash'in en üst ve en alt noktaları
    let logoHeightWithoutText = 0;
    if (slashes) {
        const allYPoints = [
            slashes.slash1.p0.y,
            slashes.slash1.p1.y,
            slashes.slash1.p2.y,
            slashes.slash1.p3.y,
            slashes.slash2.p0.y,
            slashes.slash2.p1.y,
            slashes.slash2.p2.y,
            slashes.slash2.p3.y
        ];
        const minY = Math.min(...allYPoints);
        const maxY = Math.max(...allYPoints);
        logoHeightWithoutText = maxY - minY;
        
        console.log('Logo height (without text):', logoHeightWithoutText, 'px');
    }
    
    // numberP0: slash'in ilk yarısının p1-p2 ile sağ chevron'un ilk yarısının p1-p2 kesişimi
    const numberP0 = findLineIntersection(
        slashes.slash1.p1,
        slashes.slash1.p2,
        rightChevrons.rightChevron1.p1,
        rightChevrons.rightChevron1.p2
    );
    
    // Logo3.svg'yi çiz
    if (numberP0) {
        const squareHeight = rightChevrons.rightChevron1.p1.y - numberP0.y;
        
        if (logo3Image.complete) {
            // Scale bias uygula (yüzde olarak)
            const scaleFactor = 1 + (params.numberScaleBias / 100);
            const logoHeight = squareHeight * scaleFactor;
            const logoWidth = (logo3Image.width / logo3Image.height) * logoHeight;
            
            // Distance bias uygula (x pozisyonuna)
            const logoX = numberP0.x + params.numberDistanceBias;
            
            // Logoyu renkle boya - önce geçici canvas'a çiz
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = logo3Image.width;
            tempCanvas.height = logo3Image.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            // Orijinal logoyu çiz
            tempCtx.drawImage(logo3Image, 0, 0);
            
            // Global composite operation ile renklendirme
            tempCtx.globalCompositeOperation = 'source-in';
            tempCtx.fillStyle = params.color;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // Ana canvas'a boyalı logoyu çiz
            ctx.drawImage(tempCanvas, logoX, numberP0.y, logoWidth, logoHeight);
        }
    }
    
    // Icon scale'i restore et
    ctx.restore();
    
    // CodeCubeText.svg'yi çiz - logonun altına ortalanmış
    if (rightChevrons && codeCubeTextImage.complete && slashes) {
        // Icon'un alt noktasını bul - slash'in en alt noktası
        const allYPoints = [
            slashes.slash1.p0.y,
            slashes.slash1.p1.y,
            slashes.slash1.p2.y,
            slashes.slash1.p3.y,
            slashes.slash2.p0.y,
            slashes.slash2.p1.y,
            slashes.slash2.p2.y,
            slashes.slash2.p3.y
        ];
        let iconBottomY = Math.max(...allYPoints);
        
        // Icon scale bias'ı uygula - bu noktayı merkeze göre scale et
        const iconScaleFactor = 1 + (params.iconScaleBias / 100);
        iconBottomY = centerY + (iconBottomY - centerY) * iconScaleFactor;
        
        // Text'in başlangıç Y pozisyonu: icon'un alt noktası + textDistance
        const textY = iconBottomY + params.textDistance;
        
        // Scale bias uygula
        const textScaleFactor = 1 + (params.textScaleBias / 100);
        
        // Text boyutunu hesapla - 3x boyut, bias 0'da bu genişlikte
        const baseTextWidth = 1200; // 3x boyut - bias 0'da bu genişlikte
        const textWidth = baseTextWidth * textScaleFactor;
        const textHeight = (codeCubeTextImage.height / codeCubeTextImage.width) * textWidth;
        
        // X pozisyonunu ortala
        const textX = centerX - (textWidth / 2);
        
        // Text'i renkle boya - yüksek çözünürlüklü geçici canvas kullan
        const scale = 4; // 4x yüksek çözünürlük
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = codeCubeTextImage.width * scale;
        tempCanvas.height = codeCubeTextImage.height * scale;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Orijinal text'i yüksek çözünürlükte çiz
        tempCtx.drawImage(codeCubeTextImage, 0, 0, tempCanvas.width, tempCanvas.height);
        
        // Global composite operation ile renklendirme
        tempCtx.globalCompositeOperation = 'source-in';
        tempCtx.fillStyle = params.textColor;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Ana canvas'a boyalı text'i çiz (scale down edilecek)
        ctx.drawImage(tempCanvas, textX, textY, textWidth, textHeight);
        
        // Text'in en alt noktasını hesapla
        const textBottomY = textY + textHeight;
        console.log('CodeCubeText bottom Y:', textBottomY, 'px');
        
        // Toplam logo yüksekliği (text dahil)
        if (logoHeightWithoutText > 0) {
            const allYPoints = [
                slashes.slash1.p0.y,
                slashes.slash1.p1.y,
                slashes.slash1.p2.y,
                slashes.slash1.p3.y,
                slashes.slash2.p0.y,
                slashes.slash2.p1.y,
                slashes.slash2.p2.y,
                slashes.slash2.p3.y
            ];
            const logoTopY = Math.min(...allYPoints);
            const totalLogoHeight = textBottomY - logoTopY;
            console.log('Total logo height (with text):', totalLogoHeight, 'px');
        }
    }
    
    // Canvas state'ini geri yükle
    ctx.restore();
}

/**
 * Slider event listener'ları
 */
angleSlider.addEventListener('input', (e) => {
    params.angle = parseInt(e.target.value);
    angleValue.textContent = params.angle;
    updateURL();
    drawLogo();
});

widthSlider.addEventListener('input', (e) => {
    params.width = parseInt(e.target.value);
    widthValue.textContent = params.width;
    updateURL();
    drawLogo();
});

chevronLengthSlider.addEventListener('input', (e) => {
    params.chevronLength = parseInt(e.target.value);
    chevronLengthValue.textContent = params.chevronLength;
    updateURL();
    drawLogo();
});

slashDiffSlider.addEventListener('input', (e) => {
    params.slashDiff = parseInt(e.target.value);
    slashDiffValue.textContent = params.slashDiff;
    updateURL();
    drawLogo();
});

spacingSlider.addEventListener('input', (e) => {
    params.spacing = parseInt(e.target.value);
    spacingValue.textContent = params.spacing;
    updateURL();
    drawLogo();
});

numberDistanceBiasSlider.addEventListener('input', (e) => {
    params.numberDistanceBias = parseInt(e.target.value);
    numberDistanceBiasValue.textContent = params.numberDistanceBias;
    updateURL();
    drawLogo();
});

numberScaleBiasSlider.addEventListener('input', (e) => {
    params.numberScaleBias = parseInt(e.target.value);
    numberScaleBiasValue.textContent = params.numberScaleBias;
    updateURL();
    drawLogo();
});

iconScaleBiasSlider.addEventListener('input', (e) => {
    params.iconScaleBias = parseInt(e.target.value);
    iconScaleBiasValue.textContent = params.iconScaleBias;
    updateURL();
    drawLogo();
});

textDistanceSlider.addEventListener('input', (e) => {
    params.textDistance = parseInt(e.target.value);
    textDistanceValue.textContent = params.textDistance;
    updateURL();
    drawLogo();
});

textScaleBiasSlider.addEventListener('input', (e) => {
    params.textScaleBias = parseInt(e.target.value);
    textScaleBiasValue.textContent = params.textScaleBias;
    updateURL();
    drawLogo();
});

colorPicker.addEventListener('input', (e) => {
    params.color = e.target.value;
    colorValue.textContent = params.color;
    updateURL();
    drawLogo();
});

textColorPicker.addEventListener('input', (e) => {
    params.textColor = e.target.value;
    textColorValue.textContent = params.textColor;
    updateURL();
    drawLogo();
});

// İlk çizimi yap
drawLogo();

/**
 * SVG olarak download et
 */
document.getElementById('downloadSvg').addEventListener('click', async () => {
    // Logo3.svg yüklenmemişse bekle
    if (logo3IsLoading || codeCubeTextIsLoading) {
        alert('Logolar yükleniyor, lütfen birkaç saniye bekleyin...');
        return;
    }
    
    if (!logo3SvgContent || !codeCubeTextSvgContent) {
        alert('Logolar yüklenemedi. Sayfayı yenilemeyi deneyin.');
        return;
    }
    
    // SVG string oluştur - ZOOM_FACTOR'suz görüneceği için daha büyük boyut kullan
    const svgWidth = CANVAS_WIDTH / ZOOM_FACTOR;
    const svgHeight = CANVAS_HEIGHT / ZOOM_FACTOR;
    const svgCenterX = svgWidth / 2;
    const svgCenterY = svgHeight / 2;
    
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
`;

    // Icon scale bias için grup başlat
    const iconScaleFactor = 1 + (params.iconScaleBias / 100);
    svgContent += `  <g transform="translate(${svgCenterX}, ${svgCenterY}) scale(${iconScaleFactor}) translate(-${svgCenterX}, -${svgCenterY})">\n`;

    // Her polygon için SVG path oluştur
    // drawHalfChevron fonksiyonunu SVG'ye çevir
    function generateSVGPolygon(xStartPosition, width, length, angle, upperLineAngle, color) {
        const angleRad = (angle * Math.PI) / 180;
        const upperLineAngleRad = (upperLineAngle * Math.PI) / 180;
        
        const p0 = {
            x: xStartPosition - (width / 2),
            y: svgCenterY
        };
        
        const p1 = {
            x: p0.x + length * Math.sin(angleRad),
            y: p0.y - length * Math.cos(angleRad)
        };
        
        const p3 = {
            x: xStartPosition + (width / 2),
            y: svgCenterY
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
    
    // SVG için calculateHalfChevron benzeri fonksiyon tanımla (svgCenter kullanarak)
    function calculateSVGHalfChevron(xStartPosition, width, length, angle, upperLineAngle) {
        const angleRad = (angle * Math.PI) / 180;
        const upperLineAngleRad = (upperLineAngle * Math.PI) / 180;
        
        const p0 = {
            x: xStartPosition - (width / 2),
            y: svgCenterY
        };
        
        const p1 = {
            x: p0.x + length * Math.sin(angleRad),
            y: p0.y - length * Math.cos(angleRad)
        };
        
        const p3 = {
            x: xStartPosition + (width / 2),
            y: svgCenterY
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
        
        return { p0, p1, p2, p3 };
    }
    
    // Minimum chevron distance hesapla - SVG koordinatları ile
    const { p0: tempP0, p1: tempP1, p2: tempP2, p3: tempP3 } = calculateSVGHalfChevron(svgCenterX, params.width, params.chevronLength, 90 - params.angle, 90);
    const angleRad = ((90 - params.angle) * Math.PI) / 180;
    const dirX = Math.sin(angleRad);
    const dirY = Math.cos(angleRad);
    const t = (svgCenterY - tempP2.y) / dirY;
    const intersectionX = tempP2.x + t * dirX;
    
    // Sol chevron
    const minChevronDistance = (intersectionX - params.width/2) - svgCenterX;
    const xStartLeft = svgCenterX - minChevronDistance - params.spacing;
    svgContent += generateSVGPolygon(xStartLeft, params.width, params.chevronLength, 90 - params.angle, 90 - params.angle, params.color);
    svgContent += generateSVGPolygon(xStartLeft, params.width, params.chevronLength, 90 + params.angle, -(90 - params.angle), params.color);
    
    // Sağ chevron
    const xStartRight = svgCenterX + minChevronDistance + params.spacing;
    svgContent += generateSVGPolygon(xStartRight, -params.width, params.chevronLength, -(90 - params.angle), -(90 - params.angle), params.color);
    svgContent += generateSVGPolygon(xStartRight, -params.width, params.chevronLength, -(90 + params.angle), (90 - params.angle), params.color);
    
    // Slash
    const xStartCenter = svgCenterX;
    svgContent += generateSVGPolygon(xStartCenter, params.width, params.chevronLength + params.slashDiff, 90 - params.angle, 90, params.color);
    svgContent += generateSVGPolygon(xStartCenter, params.width, params.chevronLength + params.slashDiff, 180 + (90 - params.angle), 90, params.color);
    
    // Logo3.svg'yi ekle - numberP0 hesapla
    const slash1Points = generateSVGPolygon(xStartCenter, params.width, params.chevronLength + params.slashDiff, 90 - params.angle, 90, params.color);
    const rightChevron1Points = generateSVGPolygon(xStartRight, -params.width, params.chevronLength, -(90 - params.angle), -(90 - params.angle), params.color);
    
    // numberP0 ve logo pozisyonunu hesapla (basitleştirilmiş)
    if (logo3SvgContent) {
        // Kesişim noktasını yaklaşık hesapla - SVG koordinatları ile
        const { p0, p1, p2, p3 } = calculateSVGHalfChevron(xStartCenter, params.width, params.chevronLength + params.slashDiff, 90 - params.angle, 90);
        const { p0: rp0, p1: rp1, p2: rp2 } = calculateSVGHalfChevron(xStartRight, -params.width, params.chevronLength, -(90 - params.angle), -(90 - params.angle));
        
        const numberP0 = findLineIntersection(p1, p2, rp1, rp2);
        
        if (numberP0) {
            const squareHeight = rp1.y - numberP0.y;
            const scaleFactor = 1 + (params.numberScaleBias / 100);
            const logoHeight = squareHeight * scaleFactor;
            const logoWidth = (logo3Image.width / logo3Image.height) * logoHeight;
            const logoX = numberP0.x + params.numberDistanceBias;
            
            // Logo3.svg içeriğini parse et ve embed et
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(logo3SvgContent, 'image/svg+xml');
            const logo3Svg = svgDoc.documentElement;
            
            // Orijinal viewBox veya width/height al
            const viewBox = logo3Svg.getAttribute('viewBox');
            let originalWidth, originalHeight;
            
            if (viewBox) {
                const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
                originalWidth = vbWidth;
                originalHeight = vbHeight;
            } else {
                originalWidth = parseFloat(logo3Svg.getAttribute('width')) || 100;
                originalHeight = parseFloat(logo3Svg.getAttribute('height')) || 100;
            }
            
            // Scale faktörünü hesapla
            const scaleX = logoWidth / originalWidth;
            const scaleY = logoHeight / originalHeight;
            
            // Logo3.svg'nin tüm iç içeriğini al - XMLSerializer ile düzgün serialize et
            const serializer = new XMLSerializer();
            let logo3InnerSvg = '';
            
            // Tüm child elementleri serialize et
            Array.from(logo3Svg.children).forEach(child => {
                let childSvg = serializer.serializeToString(child);
                
                // Renkleri değiştir
                childSvg = childSvg.replace(/fill="(?!none)[^"]*"/g, `fill="${params.color}"`);
                childSvg = childSvg.replace(/fill='(?!none)[^']*'/g, `fill='${params.color}'`);
                childSvg = childSvg.replace(/stroke="(?!none)[^"]*"/g, `stroke="${params.color}"`);
                childSvg = childSvg.replace(/stroke='(?!none)[^']*'/g, `stroke='${params.color}'`);
                childSvg = childSvg.replace(/fill:\s*(?!none)[^;"]*/g, `fill: ${params.color}`);
                childSvg = childSvg.replace(/stroke:\s*(?!none)[^;"]*/g, `stroke: ${params.color}`);
                
                logo3InnerSvg += childSvg + '\n';
            });
            
            // Logo3'ü transform ile ekle
            svgContent += `    <g transform="translate(${logoX}, ${numberP0.y}) scale(${scaleX}, ${scaleY})">\n`;
            svgContent += logo3InnerSvg + '\n';
            svgContent += `    </g>\n`;
        }
    }
    
    // Icon grubunu kapat
    svgContent += `  </g>\n`;
    
    // CodeCubeText.svg'yi ekle - logonun altına ortalanmış
    if (codeCubeTextSvgContent) {
        // Slash'in alt noktasını hesapla (icon scale ile) - SVG koordinatları ile
        const { p0, p1, p2, p3 } = calculateSVGHalfChevron(xStartCenter, params.width, params.chevronLength + params.slashDiff, 180 + (90 - params.angle), 90);
        const slashBottomY = Math.max(p0.y, p1.y, p2.y, p3.y);
        
        // Icon scale bias uygula
        const iconScaleFactor = 1 + (params.iconScaleBias / 100);
        const scaledSlashBottomY = svgCenterY + (slashBottomY - svgCenterY) * iconScaleFactor;
        
        // Text'in pozisyonunu hesapla: icon alt noktası + textDistance
        const textY = scaledSlashBottomY + params.textDistance;
        const textScaleFactor = 1 + (params.textScaleBias / 100);
        const baseTextWidth = 1200; // 3x boyut - bias 0'da bu genişlikte
        const textWidth = baseTextWidth * textScaleFactor;
        const textX = svgCenterX - (textWidth / 2);
        
        // CodeCubeText.svg içeriğini parse et ve embed et
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(codeCubeTextSvgContent, 'image/svg+xml');
        const textSvg = svgDoc.documentElement;
        
        // Orijinal viewBox veya width/height al
        const viewBox = textSvg.getAttribute('viewBox');
        let originalWidth, originalHeight;
        
        if (viewBox) {
            const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
            originalWidth = vbWidth;
            originalHeight = vbHeight;
        } else {
            originalWidth = parseFloat(textSvg.getAttribute('width')) || 100;
            originalHeight = parseFloat(textSvg.getAttribute('height')) || 100;
        }
        
        // Scale faktörünü hesapla
        const textHeight = (originalHeight / originalWidth) * textWidth;
        const scaleX = textWidth / originalWidth;
        const scaleY = textHeight / originalHeight;
        
        // CodeCubeText.svg'nin tüm iç içeriğini al - XMLSerializer ile düzgün serialize et
        const textSerializer = new XMLSerializer();
        let textInnerSvg = '';
        
        // Tüm child elementleri serialize et
        Array.from(textSvg.children).forEach(child => {
            let childSvg = textSerializer.serializeToString(child);
            
            // Renkleri değiştir - textColor kullan
            childSvg = childSvg.replace(/fill="(?!none)[^"]*"/g, `fill="${params.textColor}"`);
            childSvg = childSvg.replace(/fill='(?!none)[^']*'/g, `fill='${params.textColor}'`);
            childSvg = childSvg.replace(/stroke="(?!none)[^"]*"/g, `stroke="${params.textColor}"`);
            childSvg = childSvg.replace(/stroke='(?!none)[^']*'/g, `stroke='${params.textColor}'`);
            childSvg = childSvg.replace(/fill:\s*(?!none)[^;"]*/g, `fill: ${params.textColor}`);
            childSvg = childSvg.replace(/stroke:\s*(?!none)[^;"]*/g, `stroke: ${params.textColor}`);
            
            textInnerSvg += childSvg + '\n';
        });
        
        // Text'i transform ile ekle
        svgContent += `  <g transform="translate(${textX}, ${textY}) scale(${scaleX}, ${scaleY})">\n`;
        svgContent += textInnerSvg + '\n';
        svgContent += `  </g>\n`;
    }
    
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

/**
 * URL'i kopyala
 */
document.getElementById('copyUrl').addEventListener('click', async () => {
    const url = window.location.href;
    
    try {
        await navigator.clipboard.writeText(url);
        const btn = document.getElementById('copyUrl');
        const originalText = btn.textContent;
        btn.textContent = '✓ Kopyalandı!';
        btn.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    } catch (err) {
        alert('URL kopyalanamadı: ' + err);
    }
});

// ============================================
// AI CHAT FUNCTIONALITY
// ============================================

/**
 * Cloudflare Worker üzerinden AI API'ye istek gönder
 */
async function callAIAPI(prompt) {
    const WORKER_URL = 'https://gentle-rain-f393.cihanozcelik.workers.dev';
    
    try {
        // Mevcut parametreleri topla
        const currentParams = {
            angle: params.angle,
            width: params.width,
            chevronLength: params.chevronLength,
            slashDiff: params.slashDiff,
            spacing: params.spacing,
            numberDistanceBias: params.numberDistanceBias,
            numberScaleBias: params.numberScaleBias,
            iconScaleBias: params.iconScaleBias,
            textDistance: params.textDistance,
            textScaleBias: params.textScaleBias,
            color: params.color,
            textColor: params.textColor
        };
        
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                message: prompt,
                currentParams: currentParams
            })
        });
        
        if (!response.ok) {
            throw new Error(`Worker Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Response formatını kontrol et
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Groq response'u parse et (OpenAI format)
        if (data.choices && data.choices[0]?.message?.content) {
            const content = data.choices[0].message.content;
            
            // JSON parse et
            try {
                const aiResponse = JSON.parse(content);
                return aiResponse;
            } catch (e) {
                // JSON parse edilemezse düz metin olarak döndür
                return { message: content, changes: {} };
            }
        }
        
        return { message: 'Cevap alınamadı.', changes: {} };
    } catch (error) {
        console.error('AI API Error:', error);
        throw new Error(`AI hatası: ${error.message}`);
    }
}

/**
 * AI'dan gelen değişiklikleri uygula
 */
function applyAIChanges(changes) {
    let changed = false;
    
    for (const [key, value] of Object.entries(changes)) {
        if (params.hasOwnProperty(key) && params[key] !== value) {
            params[key] = value;
            changed = true;
            
            // İlgili slider'ı ve değer göstergesini güncelle
            const slider = document.getElementById(`${key}Slider`);
            const valueSpan = document.getElementById(`${key}Value`);
            
            if (slider) {
                slider.value = value;
            }
            
            if (valueSpan) {
                // Color için hex değer, diğerleri için sayı
                if (key === 'color' || key === 'textColor') {
                    valueSpan.textContent = value;
                    // Color picker'ı güncelle
                    const picker = document.getElementById(`${key}Picker`);
                    if (picker) {
                        picker.value = value;
                    }
                } else {
                    valueSpan.textContent = value;
                }
            }
        }
    }
    
    if (changed) {
        updateURL();
        drawLogo();
    }
    
    return changed;
}

/**
 * Chat mesajı ekle
 */
function addChatMessage(message, isUser = false) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'ai'}`;
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/**
 * Loading mesajı göster
 */
function showLoadingMessage() {
    const messagesDiv = document.getElementById('chatMessages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message loading';
    loadingDiv.id = 'loadingMessage';
    loadingDiv.textContent = '🤔 Düşünüyorum...';
    messagesDiv.appendChild(loadingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/**
 * Loading mesajını kaldır
 */
function removeLoadingMessage() {
    const loadingDiv = document.getElementById('loadingMessage');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

/**
 * Mesaj gönder
 */
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Kullanıcı mesajını ekle
    addChatMessage(message, true);
    input.value = '';
    
    // Butonu disable et
    sendBtn.disabled = true;
    showLoadingMessage();
    
    try {
        // AI'ye sor (mevcut parametrelerle birlikte)
        const aiResponse = await callAIAPI(message);
        removeLoadingMessage();
        
        // AI'ın mesajını göster
        addChatMessage(aiResponse.message, false);
        
        // Değişiklikler varsa uygula
        if (aiResponse.changes && Object.keys(aiResponse.changes).length > 0) {
            console.log('AI değişiklikleri uygulanıyor:', aiResponse.changes);
            const applied = applyAIChanges(aiResponse.changes);
            if (applied) {
                console.log('✅ Değişiklikler uygulandı!');
            }
        }
    } catch (error) {
        removeLoadingMessage();
        addChatMessage('❌ Hata: ' + error.message, false);
        console.error('AI Error:', error);
    } finally {
        sendBtn.disabled = false;
    }
}

// Global scope'a ekle (HTML'den çağrılabilsin)
window.sendMessage = sendMessage;

