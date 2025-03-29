// Varsayılan kriterler
const defaultCriteria = [
    "1. Okuma\namacını\nbelirler",
    "2. Metni\nözetler",
    "3. Metnin\niletisini\nbelirler",
    "4. Kurgu ve\ngerçek unsurları\nayırt eder",
    "5. Görüşlerini\nöğretmen ve\narkadaşlarıyla\nkarşılaştırır",
    "6. Metni\nönceki metinlerle\nkarşılaştırır",
    "7. Çatışmalara\nalternatif\nçözümler üretir",
    "8. Çıkarım ve\nkanıtlar\noluşturur",
    "9. Metinle ilgili\ntartışma\nargümanları üretir",
    "10. Öğretici\nbir örnek metin\noluşturur"
];

let criteria = [...defaultCriteria]; // Aktif kriterleri sakla

// Global fonksiyonları önce tanımla
window.addStudent = function() {
    if (!currentClass) {
        alert('Lütfen önce bir sınıf seçin veya oluşturun');
        return;
    }

    const numberInput = document.getElementById('studentNumber');
    const nameInput = document.getElementById('studentName');
    const book1Input = document.getElementById('book1Points');
    const book2Input = document.getElementById('book2Points');

    const number = numberInput.value.trim();
    const name = nameInput.value.trim();
    const book1Total = parseInt(book1Input.value);
    const book2Total = parseInt(book2Input.value);

    // Form validasyonu
    if (!number) {
        alert('Lütfen öğrenci numarasını giriniz');
        return;
    }

    if (!name) {
        alert('Lütfen öğrenci adını giriniz');
        return;
    }

    // Aynı numarada öğrenci kontrolü
    if (students.some(student => student.number === number)) {
        alert('Bu numarada bir öğrenci zaten mevcut');
        return;
    }

    // Öğrenciyi ekle
    students.push({
        number,
        name,
        book1Scores: distributeCriteriaPoints(book1Total),
        book2Scores: distributeCriteriaPoints(book2Total)
    });

    // Sınıf listesini güncelle
    classes[currentClass] = [...students];

    // Tabloları güncelle ve kaydet
    updateTables();
    saveToLocalStorage();

    // Formları temizle
    numberInput.value = '';
    nameInput.value = '';
    book1Input.value = '';
    book2Input.value = '';
};

window.editStudent = function(index) {
    const student = students[index];
    const popup = document.getElementById('editPopup');
    
    // Form alanlarını doldur
    document.getElementById('editStudentIndex').value = index;
    document.getElementById('editStudentNumber').value = student.number;
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editBook1Points').value = student.book1Scores.reduce((a, b) => a + b, 0);
    document.getElementById('editBook2Points').value = student.book2Scores.reduce((a, b) => a + b, 0);
    
    popup.style.display = 'flex';
};

window.closePopup = function() {
    document.getElementById('editPopup').style.display = 'none';
};

window.editCriteria = function() {
    const popup = document.getElementById('criteriaPopup');
    const inputsContainer = document.getElementById('criteriaInputs');
    inputsContainer.innerHTML = '';

    // Her kriter için bir textarea oluştur
    criteria.forEach((criterion, index) => {
        const group = document.createElement('div');
        group.className = 'criteria-input-group';
        
        const label = document.createElement('label');
        label.textContent = `Kriter ${index + 1}:`;
        
        const textarea = document.createElement('textarea');
        textarea.value = criterion.replace(/\n/g, ' ');
        textarea.id = `criterion${index}`;
        textarea.placeholder = `${index + 1}. kriter metnini girin`;
        
        group.appendChild(label);
        group.appendChild(textarea);
        inputsContainer.appendChild(group);
    });

    // Display: flex ekleyerek popup'ı göster
    popup.style.display = 'flex';
};

window.saveCriteria = function() {
    // Tüm kriterleri textarealardan al
    criteria = Array.from({ length: 10 }, (_, i) => {
        const textarea = document.getElementById(`criterion${i}`);
        // Metni satırlara böl (her 2-3 kelimede bir)
        const words = textarea.value.trim().split(' ');
        let lines = [];
        let currentLine = [];
        let currentLength = 0;

        words.forEach(word => {
            if (currentLength + word.length > 15) { // Satır uzunluk limiti
                lines.push(currentLine.join(' '));
                currentLine = [word];
                currentLength = word.length;
            } else {
                currentLine.push(word);
                currentLength += word.length + 1;
            }
        });
        if (currentLine.length > 0) {
            lines.push(currentLine.join(' '));
        }
        return lines.join('\n');
    });

    // Kriterleri güncelle ve kaydet
    updateCriteriaDisplay();
    saveToLocalStorage();
    closeCriteriaPopup();
};

window.closeCriteriaPopup = function() {
    const popup = document.getElementById('criteriaPopup');
    popup.style.display = 'none';
};

window.saveEdit = function() {
    const index = parseInt(document.getElementById('editStudentIndex').value);
    const number = document.getElementById('editStudentNumber').value.trim();
    const name = document.getElementById('editStudentName').value.trim();
    const book1Total = parseInt(document.getElementById('editBook1Points').value);
    const book2Total = parseInt(document.getElementById('editBook2Points').value);

    // Validasyon
    if (!number) {
        alert('Lütfen öğrenci numarasını giriniz');
        return;
    }

    if (!name) {
        alert('Lütfen öğrenci adını giriniz');
        return;
    }

    // Aynı numarada başka öğrenci var mı kontrol et
    const numberExists = students.some((student, i) => i !== index && student.number === number);
    if (numberExists) {
        alert('Bu numarada bir öğrenci zaten mevcut');
        return;
    }

    // Öğrenci bilgilerini güncelle
    students[index] = {
        number,
        name,
        book1Scores: distributeCriteriaPoints(book1Total),
        book2Scores: distributeCriteriaPoints(book2Total)
    };

    // Tabloları güncelle ve kaydet
    updateTables();
    saveToLocalStorage();
    closePopup();
};

window.deleteStudent = function(index) {
    if (confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
        students.splice(index, 1);
        // Sınıf listesini güncelle
        classes[currentClass] = [...students];
        
        updateTables();
        saveToLocalStorage();
    }
};

window.clearTables = function() {
    if (!currentClass) {
        alert('Lütfen önce bir sınıf seçin');
        return;
    }

    if (confirm('Bu sınıftaki tüm öğrenci bilgileri silinecek. Emin misiniz?')) {
        students = [];
        classes[currentClass] = [];
        updateTables();
        saveToLocalStorage();
    }
};

window.printTables = function() {
    window.print();
};

// Excel kütüphanesini ekle (HTML'de de script olarak eklenmeli)
// <script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>

window.handleExcelFile = function(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // İlk sayfayı al
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // JSON'a çevir
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // Başlık satırını atla ve verileri işle
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row.length >= 4) { // En az 4 sütun olmalı: numara, ad, 1.kitap, 2.kitap
                const number = row[0].toString();
                const name = row[1].toString();
                const book1Total = parseInt(row[2]) || 0;
                const book2Total = parseInt(row[3]) || 0;

                // Aynı numarada öğrenci kontrolü
                if (!students.some(student => student.number === number)) {
                    students.push({
                        number,
                        name,
                        book1Scores: distributeCriteriaPoints(book1Total),
                        book2Scores: distributeCriteriaPoints(book2Total)
                    });
                }
            }
        }

        // Tabloları güncelle ve kaydet
        updateTables();
        saveToLocalStorage();
        
        // Input'u temizle
        input.value = '';
        
        alert('Excel verisi başarıyla aktarıldı!');
    };
    
    reader.readAsArrayBuffer(file);
};

// Excel popup fonksiyonları
function openExcelPopup() {
    const popup = document.getElementById('excelPopup');
    popup.style.display = 'flex';
}

function closeExcelPopup() {
    const popup = document.getElementById('excelPopup');
    popup.style.display = 'none';
    document.getElementById('excelText').value = '';
}

function parseExcelData() {
    if (!currentClass) {
        alert('Lütfen önce bir sınıf seçin veya oluşturun');
        return;
    }

    const textArea = document.getElementById('excelText');
    const rawText = textArea.value.trim();
    
    if (!rawText) {
        alert("Lütfen Excel verisi yapıştırın!");
        return;
    }

    const lines = rawText.split('\n');
    let addedCount = 0;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        let parts = line.split('\t');
        if (parts.length === 1) {
            parts = line.split(/\s+/);
        }

        if (parts.length >= 2) {
            const number = parts[0].toString().trim();
            const name = parts.slice(1).join(' ').trim();
            const book1Points = 50;
            const book2Points = 50;

            if (number && name && !isNaN(number)) {
                if (!students.some(student => student.number === number)) {
                    students.push({
                        number: number,
                        name: name,
                        book1Scores: distributeCriteriaPoints(book1Points),
                        book2Scores: distributeCriteriaPoints(book2Points)
                    });
                    addedCount++;
                }
            }
        }
    }

    if (addedCount > 0) {
        // Sınıf listesini güncelle
        classes[currentClass] = [...students];
        
        updateTables();
        saveToLocalStorage();
        alert(`${addedCount} öğrenci başarıyla eklendi.`);
        closeExcelPopup();
    } else {
        alert("Hiç öğrenci eklenemedi. Lütfen veri formatını kontrol edin.");
    }
}

// Öğrenci verilerini sınıflara göre tutacak şekilde classes objesini değiştir
let classes = {}; // { sınıfAdı: [öğrenciler], ... }
let currentClass = null;
let students = []; // Geçici olarak aktif sınıfın öğrencilerini tutacak

// Sınıf ekleme
function addClass() {
    const input = document.getElementById('newClassName');
    const className = input.value.trim();
    
    if (!className) {
        alert('Lütfen sınıf adı girin');
        return;
    }
    
    if (classes[className]) {
        alert('Bu sınıf zaten mevcut');
        return;
    }
    
    classes[className] = [];
    input.value = '';
    updateClassTabs();
    switchClass(className);
    saveToLocalStorage();
}

// Sınıf sekmelerini güncelle
function updateClassTabs() {
    const tabsContainer = document.getElementById('classTabs');
    tabsContainer.innerHTML = '';
    
    Object.keys(classes).forEach(className => {
        const tab = document.createElement('div');
        tab.className = 'class-tab';
        
        const nameBtn = document.createElement('button');
        nameBtn.className = `class-name ${currentClass === className ? 'active' : ''}`;
        nameBtn.textContent = className;
        nameBtn.onclick = () => switchClass(className);
        
        const editBtn = document.createElement('button');
        editBtn.className = 'class-edit-btn';
        editBtn.innerHTML = '✎';
        editBtn.onclick = () => editClass(className);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'class-delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = () => deleteClass(className);
        
        tab.appendChild(nameBtn);
        tab.appendChild(editBtn);
        tab.appendChild(deleteBtn);
        tabsContainer.appendChild(tab);
    });
}

// Sınıf değiştir
function switchClass(className) {
    if (currentClass) {
        // Mevcut sınıfın öğrencilerini kaydet
        classes[currentClass] = [...students];
    }
    
    currentClass = className;
    // Seçilen sınıfın öğrencilerini yükle
    students = classes[className] || [];
    
    updateClassTabs();
    updateTables();
    saveToLocalStorage();
}

// Sınıf düzenleme popup fonksiyonları
function openEditClassPopup(className) {
    const popup = document.getElementById('editClassPopup');
    document.getElementById('oldClassName').value = className;
    document.getElementById('editClassName').value = className;
    popup.style.display = 'flex';
}

function closeEditClassPopup() {
    document.getElementById('editClassPopup').style.display = 'none';
}

function saveClassEdit() {
    const oldName = document.getElementById('oldClassName').value;
    const newName = document.getElementById('editClassName').value.trim();
    
    if (!newName) {
        alert('Lütfen sınıf adı girin');
        return;
    }
    
    if (newName !== oldName && classes[newName]) {
        alert('Bu sınıf adı zaten kullanılıyor');
        return;
    }
    
    classes[newName] = classes[oldName];
    delete classes[oldName];
    
    if (currentClass === oldName) {
        currentClass = newName;
    }
    
    updateClassTabs();
    saveToLocalStorage();
    closeEditClassPopup();
}

// Sınıf düzenleme fonksiyonunu güncelle
function editClass(className) {
    openEditClassPopup(className);
}

// Sınıf sil
function deleteClass(className) {
    if (confirm(`${className} sınıfını silmek istediğinizden emin misiniz?`)) {
        delete classes[className];
        if (currentClass === className) {
            currentClass = Object.keys(classes)[0] || null;
        }
        updateClassTabs();
        updateTable();
        saveToLocalStorage();
    }
}

// Sayfa yüklendiğinde localStorage'dan verileri yükle
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateTitles();
    updateCriteriaDisplay();
});

// Input değişikliklerini dinle
document.getElementById('mainTitle').addEventListener('input', updateTitles);
document.getElementById('subTitle').addEventListener('input', updateTitles);
document.getElementById('book1Title').addEventListener('input', updateTitles);
document.getElementById('book2Title').addEventListener('input', updateTitles);

// Başlıkları güncelleme fonksiyonu
function updateTitles() {
    const mainTitle = document.getElementById('mainTitle').value;
    const subTitle = document.getElementById('subTitle').value;
    const book1Title = document.getElementById('book1Title').value;
    const book2Title = document.getElementById('book2Title').value;
    
    // Tüm ana başlıkları güncelle
    document.querySelectorAll('.main-title').forEach(title => {
        title.textContent = mainTitle;
    });

    // Tüm alt başlıkları güncelle
    document.querySelectorAll('.criteria-header').forEach(header => {
        header.textContent = subTitle;
    });

    // Kitap başlıklarını güncelle
    document.querySelector('.book1-title').textContent = book1Title;
    document.querySelector('.book2-title').textContent = book2Title;
}

// Kriterleri tablolarda göster
function updateCriteriaDisplay() {
    ['criteriaRow1', 'criteriaRow2'].forEach(rowId => {
        const row = document.getElementById(rowId);
        row.innerHTML = ''; // Mevcut kriterleri temizle
        
        criteria.forEach(criterion => {
            const th = document.createElement('th');
            th.innerHTML = criterion;
            row.appendChild(th);
        });
    });
}

// Puanları kriterlere dağıtma fonksiyonu
function distributeCriteriaPoints(totalPoints) {
    const criteriaCount = 10;
    // Her kritere başlangıçta 5 puan ver
    const scores = Array(criteriaCount).fill(5);
    let remainingPoints = totalPoints - (5 * criteriaCount);

    if (remainingPoints < 0) {
        // Eğer toplam puan 50'den azsa, her kritere en az 5 vermek mümkün değil.
        // Bu durumda eldekileri 5'er 5'er verip bitiriyoruz (geri kalan 0 olur).
        const adjustedScores = Array(criteriaCount).fill(0);
        let pointsToDistribute = totalPoints;
        for (let i = 0; i < criteriaCount && pointsToDistribute >= 5; i++) {
            adjustedScores[i] = 5;
            pointsToDistribute -= 5;
        }
        return adjustedScores;
    }

    // Kalan puanları 5'er 5'er, 10 puanı geçmeyecek şekilde dağıt
    while (remainingPoints >= 5) {
        // Hala 10'dan az puanı olan kriterleri bul
        const availableIndices = scores
            .map((score, index) => ({ index, score }))
            .filter(c => c.score < 10)
            .map(c => c.index);

        if (availableIndices.length === 0) break;

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        scores[randomIndex] += 5; // 5 puan ekle
        remainingPoints -= 5;
    }

    return scores;
}

// Tabloları güncelleme
function updateTables() {
    updateTable('book1TableBody', 'book1Scores');
    updateTable('book2TableBody', 'book2Scores');
}

// Tek bir tabloyu güncelleme
function updateTable(tableId, scoresKey) {
    const tbody = document.getElementById(tableId);
    if (!tbody) return;

    tbody.innerHTML = '';
    
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        
        // Öğrenci no ve adı ayrı sütunlarda
        row.innerHTML = `
            <td>${student.number}</td>
            <td>${student.name}</td>
        `;
        
        // Kriter puanları
        student[scoresKey].forEach(score => {
            row.innerHTML += `<td>${score}</td>`;
        });
        
        // Toplam puan ve işlem butonları
        const total = student[scoresKey].reduce((a, b) => a + b, 0);
        
        row.innerHTML += `
            <td>${total}</td>
            <td class="no-print">
                <button onclick="editStudent(${index})" class="edit-btn">Düzenle</button>
                <button onclick="deleteStudent(${index})" class="delete-btn">Sil</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// LocalStorage'a kaydetme
function saveToLocalStorage() {
    try {
        localStorage.setItem('students', JSON.stringify(students));
        localStorage.setItem('mainTitle', document.getElementById('mainTitle').value);
        localStorage.setItem('subTitle', document.getElementById('subTitle').value);
        localStorage.setItem('book1Title', document.getElementById('book1Title').value);
        localStorage.setItem('book2Title', document.getElementById('book2Title').value);
        localStorage.setItem('criteria', JSON.stringify(criteria));
        localStorage.setItem('classes', JSON.stringify(classes));
        localStorage.setItem('currentClass', currentClass || '');
    } catch (error) {
        console.error('Veriler kaydedilirken hata oluştu:', error);
    }
}

// LocalStorage'dan yükleme
function loadFromLocalStorage() {
    try {
        const savedClasses = localStorage.getItem('classes');
        const savedCurrentClass = localStorage.getItem('currentClass');
        const mainTitle = localStorage.getItem('mainTitle');
        const subTitle = localStorage.getItem('subTitle');
        const book1Title = localStorage.getItem('book1Title');
        const book2Title = localStorage.getItem('book2Title');
        const savedCriteria = localStorage.getItem('criteria');
        
        if (savedClasses) {
            classes = JSON.parse(savedClasses);
        }
        
        if (savedCurrentClass) {
            currentClass = savedCurrentClass;
            students = classes[currentClass] || [];
        }
        
        if (mainTitle) document.getElementById('mainTitle').value = mainTitle;
        if (subTitle) document.getElementById('subTitle').value = subTitle;
        if (book1Title) document.getElementById('book1Title').value = book1Title;
        if (book2Title) document.getElementById('book2Title').value = book2Title;
        if (savedCriteria) {
            criteria = JSON.parse(savedCriteria);
        }

        updateTitles();
        updateClassTabs();
        updateTables();
    } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error);
        localStorage.clear();
        students = [];
        classes = {};
        currentClass = null;
        criteria = [...defaultCriteria];
    }
}