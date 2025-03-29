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
    
    popup.classList.add('active');
};

window.closePopup = function() {
    document.getElementById('editPopup').classList.remove('active');
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
    popup.classList.add('active');
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
    popup.classList.remove('active');
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
    popup.classList.add('active');
}

function closeExcelPopup() {
    const popup = document.getElementById('excelPopup');
    popup.classList.remove('active');
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
let jsonDataLoaded = false; // JSON verisi yüklendi mi?

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

// Sınıf seçim listesini güncelle
function updateClassTabs() {
    const classSelect = document.getElementById('classSelect');
    const selectedClassActions = document.getElementById('selectedClassActions');
    const selectedClassName = document.getElementById('selectedClassName');
    
    // Select içeriğini temizle, sadece ilk seçeneği bırak
    classSelect.innerHTML = '<option value="" disabled>Sınıf Seçin</option>';
    
    // Sınıfları alfabetik sırala
    const sortedClasses = Object.keys(classes).sort();
    
    // Sınıf yok ise uyarı göster
    if (sortedClasses.length === 0) {
        const emptyOption = document.createElement('option');
        emptyOption.disabled = true;
        emptyOption.textContent = '-- Hiç sınıf bulunamadı --';
        classSelect.appendChild(emptyOption);
    } else {
        // Sınıfları ekle
        sortedClasses.forEach(className => {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = className;
            
            // Öğrenci sayısını da göster
            const studentCount = classes[className].length;
            option.textContent = `${className} (${studentCount} öğrenci)`;
            
            if (className === currentClass) {
                option.selected = true;
            }
            
            classSelect.appendChild(option);
        });
    }
    
    // Eğer bir sınıf seçiliyse, o sınıfın bilgilerini göster
    if (currentClass) {
        const studentCount = classes[currentClass].length;
        selectedClassName.textContent = `${currentClass} (${studentCount} öğrenci)`;
        selectedClassActions.style.display = 'block';
        
        // Animasyon ekle
        selectedClassActions.classList.add('highlight-effect');
        setTimeout(() => {
            selectedClassActions.classList.remove('highlight-effect');
        }, 500);
    } else {
        selectedClassActions.style.display = 'none';
    }
}

// Sınıf değiştir
function switchClass(className) {
    if (currentClass) {
        // Mevcut sınıfın öğrencilerini kaydet
        classes[currentClass] = [...students];
    }
    
    // Yeni sınıfa geç
    currentClass = className;
    students = [...(classes[className] || [])];
    
    // UI'ı güncelle
    updateTables();
    updateClassTabs();
    
    // Sınıf adını başlığa ekle
    const mainTitleInput = document.getElementById('mainTitle');
    const mainTitleElements = document.querySelectorAll('.main-title');
    const baseTitle = mainTitleInput.value;
    
    mainTitleElements.forEach(el => {
        el.textContent = `${baseTitle} - ${className}`;
    });
}

// Sınıf düzenleme
function editClass(className) {
    document.getElementById('oldClassName').value = className;
    document.getElementById('editClassName').value = className;
    document.getElementById('editClassPopup').classList.add('active');
}

// Sınıf düzenleme popupını kapat
function closeEditClassPopup() {
    document.getElementById('editClassPopup').classList.remove('active');
}

// Sınıf düzenleme kaydet
function saveClassEdit() {
    const oldName = document.getElementById('oldClassName').value;
    const newName = document.getElementById('editClassName').value.trim();
    
    if (!newName) {
        alert('Lütfen sınıf adı girin');
        return;
    }
    
    if (newName !== oldName && classes[newName]) {
        alert('Bu isimde bir sınıf zaten mevcut');
        return;
    }
    
    // Sınıfı yeniden adlandır
    classes[newName] = classes[oldName];
    delete classes[oldName];
    
    // Eğer aktif sınıf değiştiyse güncelle
    if (currentClass === oldName) {
        currentClass = newName;
    }
    
    updateClassTabs();
    saveToLocalStorage();
    closeEditClassPopup();
}

// Sınıf silme
function deleteClass(className) {
    if (!confirm(`"${className}" sınıfını silmek istediğinizden emin misiniz?`)) {
        return;
    }
    
    delete classes[className];
    
    // Eğer aktif sınıf silindiyse
    if (currentClass === className) {
        currentClass = null;
        students = [];
        
        // Başka bir sınıf varsa ona geç
        const classNames = Object.keys(classes);
        if (classNames.length > 0) {
            switchClass(classNames[0]);
        } else {
            updateTables();
        }
    }
    
    updateClassTabs();
    saveToLocalStorage();
}

// JSON dosyasından verileri yükle
async function loadJsonData() {
    try {
        const response = await fetch('/api/classes');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // JSON verisindeki classes dizisini işle
        if (Array.isArray(data.classes)) {
            data.classes.forEach(classItem => {
                const className = classItem.name;
                
                // Öğrencileri işle
                let classStudents = [];
                if (Array.isArray(classItem.students)) {
                    classStudents = classItem.students.map(student => {
                        return {
                            number: student.number,
                            name: student.name,
                            book1Scores: distributeCriteriaPoints(student.points || 50),
                            book2Scores: distributeCriteriaPoints(student.points || 50)
                        };
                    });
                }
                
                // Sınıfı ekle
                classes[className] = classStudents;
            });
            
            // Sınıf sekmelerini güncelle
            updateClassTabs();
            
            // İlk sınıfı seç (eğer varsa)
            const classNames = Object.keys(classes);
            if (classNames.length > 0 && !currentClass) {
                switchClass(classNames[0]);
            }
            
            jsonDataLoaded = true;
            console.log("JSON verisi başarıyla yüklendi");
        }
    } catch (error) {
        console.error("JSON verisi yüklenirken hata oluştu:", error);
    }
}

// Puan dağılımı için yardımcı fonksiyon
function distributeCriteriaPoints(totalPoints) {
    if (!totalPoints || isNaN(totalPoints)) totalPoints = 0;
    
    // Sadece 0, 5 veya 10 değerlerini dağıt
    let remainingPoints = totalPoints;
    let criteriaPts = Array(10).fill(0);
    
    // İlk olarak tüm kriterlere 0 puan ata
    // Sonra toplam puana göre bazı kriterlere 5 veya 10 puan ata
    while (remainingPoints >= 5) {
        // Kriter seçimi: Önce puanı 0 olan kriterleri seç
        // Puanı 5 olan kriterlere 5 daha ekleyerek 10'a çıkarabilir
        // Ama puanı 10 olan kriterler artık seçilmez
        const availableCriteria = criteriaPts
            .map((pts, idx) => pts < 10 ? idx : -1)
            .filter(idx => idx !== -1);
        
        // Mevcut puan 0 olan kriterlere öncelik ver
        const unassignedCriteria = criteriaPts
            .map((pts, idx) => pts === 0 ? idx : -1)
            .filter(idx => idx !== -1);
        
        // Seçilecek kriter indeksi
        let criteriaIndex;
        
        if (unassignedCriteria.length > 0) {
            // Puanı 0 olan kriterlerden birini seç
            criteriaIndex = unassignedCriteria[Math.floor(Math.random() * unassignedCriteria.length)];
        } else if (availableCriteria.length > 0) {
            // Puanı 5 olan kriterlerden birini seç
            criteriaIndex = availableCriteria[Math.floor(Math.random() * availableCriteria.length)];
        } else {
            // Tüm kriterler 10 puan almış, döngüyü sonlandır
            break;
        }
        
        // 5 puan ekle
        criteriaPts[criteriaIndex] += 5;
        remainingPoints -= 5;
    }
    
    // Son kalan puanları herhangi bir kritere ekle
    if (remainingPoints > 0 && remainingPoints < 5) {
        // Şu anda puan almamış bir kriter varsa ona ekle
        const unpointedCriteria = criteriaPts
            .map((pts, idx) => pts === 0 ? idx : -1)
            .filter(idx => idx !== -1);
        
        if (unpointedCriteria.length > 0) {
            criteriaPts[unpointedCriteria[0]] += remainingPoints;
        } else {
            // Puan almamış kriter yoksa, en düşük puana sahip kritere ekle
            const minValueIndex = criteriaPts.indexOf(Math.min(...criteriaPts));
            criteriaPts[minValueIndex] += remainingPoints;
        }
    }
    
    // Toplam puanın doğru olduğunu kontrol et
    const sum = criteriaPts.reduce((a, b) => a + b, 0);
    if (sum !== totalPoints) {
        // Fark varsa, düzelt
        const diff = totalPoints - sum;
        
        if (diff > 0) {
            // Eksik varsa, puan almamış veya 5 puan almış kriterlere ekle
            const availableCriteria = criteriaPts
                .map((pts, idx) => pts < 10 ? idx : -1)
                .filter(idx => idx !== -1);
                
            if (availableCriteria.length > 0) {
                criteriaPts[availableCriteria[0]] += diff;
            } else {
                // Tüm kriterler 10 ise bir tanesinden diğerlerine dağıt
                criteriaPts[0] += diff;
            }
        } else if (diff < 0) {
            // Fazla varsa, puanı pozitif olan kriterlerden çıkar
            for (let i = 9; i >= 0; i--) {
                if (criteriaPts[i] > 0) {
                    const subtract = Math.min(criteriaPts[i], Math.abs(diff));
                    criteriaPts[i] -= subtract;
                    if (subtract === Math.abs(diff)) break;
                }
            }
        }
    }
    
    return criteriaPts;
}

// Kriter görünümünü güncelle
function updateCriteriaDisplay() {
    const criteriaRow1 = document.getElementById('criteriaRow1');
    const criteriaRow2 = document.getElementById('criteriaRow2');
    const criteriaTitles = document.querySelectorAll('.criteria-header');
    
    if (!criteriaRow1 || !criteriaRow2 || !criteriaTitles) return;
    
    // Başlıkları güncelle
    const criteriaTitle = document.getElementById('subTitle').value;
    criteriaTitles.forEach(el => {
        el.textContent = criteriaTitle;
    });
    
    // Satırlardaki kriterleri temizle ve yeniden ekle
    criteriaRow1.innerHTML = '';
    criteriaRow2.innerHTML = '';
    
    criteria.forEach(criterion => {
        const th1 = document.createElement('th');
        th1.innerHTML = criterion;
        criteriaRow1.appendChild(th1);
        
        const th2 = document.createElement('th');
        th2.innerHTML = criterion;
        criteriaRow2.appendChild(th2);
    });
}

// Tabloları güncelle
function updateTables() {
    if (!currentClass) {
        // Sınıf seçili değilse, tabloları temizle
        document.getElementById('book1TableBody').innerHTML = '';
        document.getElementById('book2TableBody').innerHTML = '';
        return;
    }
    
    updateTable('book1TableBody', 'book1Scores');
    updateTable('book2TableBody', 'book2Scores');
}

// Belirli bir tabloyu güncelle
function updateTable(tableId, scoresKey) {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = '';
    
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        
        // Öğrenci No
        if (tableId === 'book1TableBody') {
            const numberCell = document.createElement('td');
            numberCell.textContent = student.number;
            row.appendChild(numberCell);
        }
        
        // Öğrenci Adı
        const nameCell = document.createElement('td');
        nameCell.textContent = student.name;
        row.appendChild(nameCell);
        
        // Kriterler (Puanlar)
        student[scoresKey].forEach(score => {
            const cell = document.createElement('td');
            cell.textContent = score;
            row.appendChild(cell);
        });
        
        // Toplam Puan
        const totalCell = document.createElement('td');
        const totalScore = student[scoresKey].reduce((a, b) => a + b, 0);
        totalCell.textContent = totalScore;
        row.appendChild(totalCell);
        
        // İşlem butonları
        const actionsCell = document.createElement('td');
        actionsCell.className = 'no-print';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Düzenle';
        editBtn.onclick = () => window.editStudent(index);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Sil';
        deleteBtn.onclick = () => window.deleteStudent(index);
        
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        
        tableBody.appendChild(row);
    });
}

// LocalStorage'a kaydet
function saveToLocalStorage() {
    try {
        // Mevcut sınıfın öğrencilerini kaydet
        if (currentClass) {
            classes[currentClass] = [...students];
        }
        
        const data = {
            criteria,
            classes,
            currentClass
        };
        
        localStorage.setItem('readingEvaluation', JSON.stringify(data));
    } catch (error) {
        console.error("LocalStorage'a kaydedilirken hata oluştu:", error);
    }
}

// LocalStorage'dan yükle
function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('readingEvaluation');
        if (savedData) {
            const data = JSON.parse(savedData);
            criteria = data.criteria || [...defaultCriteria];
            classes = data.classes || {};
            currentClass = data.currentClass || null;
            
            if (currentClass) {
                students = [...(classes[currentClass] || [])];
            }
            
            updateClassTabs();
            updateCriteriaDisplay();
            updateTables();
            return true;
        }
    } catch (error) {
        console.error("LocalStorage'dan yüklenirken hata oluştu:", error);
    }
    
    return false;
}

// Sayfa yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', function() {
    // Kriter görünümünü güncelle
    updateCriteriaDisplay();
    
    // Başlıkları güncelle
    const mainTitleInput = document.getElementById('mainTitle');
    const mainTitleElements = document.querySelectorAll('.main-title');
    const baseTitle = mainTitleInput.value;
    
    mainTitleElements.forEach(el => {
        el.textContent = baseTitle;
    });
    
    // Kitap başlıklarını güncelle
    document.querySelector('.book1-title').textContent = document.getElementById('book1Title').value;
    document.querySelector('.book2-title').textContent = document.getElementById('book2Title').value;
    
    // Yerel depolamadan veri yüklemeyi dene
    const localDataLoaded = loadFromLocalStorage();
    
    // Eğer yerel veriler yoksa veya istenirse, JSON dosyasından yükle
    if (!localDataLoaded || !jsonDataLoaded) {
        loadJsonData();
    }
});

// Başlık değişikliklerini dinle
document.getElementById('mainTitle').addEventListener('input', function() {
    const value = this.value;
    const mainTitleElements = document.querySelectorAll('.main-title');
    
    mainTitleElements.forEach(el => {
        if (currentClass) {
            el.textContent = `${value} - ${currentClass}`;
        } else {
            el.textContent = value;
        }
    });
});

document.getElementById('subTitle').addEventListener('input', function() {
    const value = this.value;
    const criteriaTitles = document.querySelectorAll('.criteria-header');
    
    criteriaTitles.forEach(el => {
        el.textContent = value;
    });
});

document.getElementById('book1Title').addEventListener('input', function() {
    document.querySelector('.book1-title').textContent = this.value;
});

document.getElementById('book2Title').addEventListener('input', function() {
    document.querySelector('.book2-title').textContent = this.value;
});