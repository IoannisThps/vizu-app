const paper = document.getElementById("paper");
let pageCount = 0;
let activePage = null;

function updateStatusBar() {
    const currentIndex = Array.from(document.querySelectorAll('.paper-page')).indexOf(activePage) + 1;
    const totalPages = document.querySelectorAll('.paper-page').length;

    document.getElementById('currentPage').textContent = currentIndex;
    document.getElementById('totalPages').textContent = totalPages;
}

function addNewPage() {
    const newPage = document.createElement('div');
    newPage.classList.add('paper-page');
    newPage.setAttribute('contenteditable', 'true');
    newPage.setAttribute('data-page', pageCount + 1);

    newPage.addEventListener('click', () => {
        activePage = newPage;
        updateStatusBar();
    });

    paper.appendChild(newPage);
    pageCount++;

    newPage.focus();
    activePage = newPage;

    const sound = document.getElementById("myAudio");
    sound.play();

    updateStatusBar();
}

document.querySelector('[data-cmd="addpage"]').addEventListener('click', addNewPage);

window.addEventListener('DOMContentLoaded', () => {
    if (paper.children.length === 0) {
        addNewPage();
    }
    const allDocs = JSON.parse(localStorage.getItem("vizuDocs") || "{}");
    const title = localStorage.getItem("currentDoc");

    if (title && allDocs[title]) {
        paper.innerHTML = allDocs[title];

        const pages = document.querySelectorAll('.paper-page');
        if (pages.length > 0) {
            activePage = pages[pages.length - 1];
            activePage.focus();
        }
    }

    updateStatusBar();
});

document.querySelectorAll('[data-cmd]').forEach(btn => {
    btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        document.execCommand(cmd, false, null);
        btn.classList.toggle("active");
    });
});


colortext.addEventListener("click", () => {
    colorPicker.click();
});
colorPicker.addEventListener("input", function () {
    document.execCommand("forecolor", false, this.value);
    colortext.classList.toggle("active");
});

heading.addEventListener("click", function () {
    document.execCommand("fontSize", false, "3");
});

subheading.addEventListener("click", function () {
    document.execCommand("fontSize", false, "7");
});

fill.addEventListener("click", function () {
    colorPicker2.click();
});
colorPicker2.addEventListener("input", function () {
    document.execCommand("backcolor", false, this.value);
    fill.classList.toggle("active");
});

list.addEventListener("click", function () {
    document.execCommand("insertUnorderedList");
    list.classList.toggle("active");
});

undo.addEventListener("click", function () {
    document.execCommand("undo");
});

redo.addEventListener("click", function () {
    document.execCommand("redo");
});

const alignToggle = document.getElementById('align-toggle');
const alignDropdown = alignToggle.closest('.align-dropdown');
const alignOptions = alignDropdown.querySelectorAll('.align-options img');

alignToggle.addEventListener('click', () => {
    alignDropdown.classList.toggle('open');
    alignToggle.classList.toggle("active");
});

alignOptions.forEach(btn => {
    btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        document.execCommand(cmd);
        alignDropdown.classList.remove('open');
    });
});

document.addEventListener('click', (e) => {
    if (!alignDropdown.contains(e.target) && !alignToggle.contains(e.target)) {
        alignDropdown.classList.remove('open');
    }
});

const fontToggle = document.getElementById('font-toggle');
const fontDropdown = fontToggle.closest('.font-dropdown');
const fontOptions = fontDropdown.querySelectorAll('.font-options button');

fontToggle.addEventListener('click', () => {
    fontDropdown.classList.toggle('open');
});

fontOptions.forEach(btn => {
    btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        const value = btn.getAttribute('data-value');
        document.execCommand(cmd, false, value);
        fontDropdown.classList.remove('open');
    });
});

document.addEventListener('click', (e) => {
    if (!fontDropdown.contains(e.target) && !fontToggle.contains(e.target)) {
        fontDropdown.classList.remove('open');
    }
});

save.addEventListener("click", () => {
    const content = paper.innerHTML;
    const title = localStorage.getItem("currentDoc");

    if (!title) {
        alert("Document name not found!");
        return;
    }

    const allDocs = JSON.parse(localStorage.getItem("vizuDocs") || "{}");
    allDocs[title] = content;
    localStorage.setItem("vizuDocs", JSON.stringify(allDocs));

    alert("Changes saved!");
});

saveLocal.addEventListener('click', () => {
    const pages = document.querySelectorAll('.paper-page');
    const container = document.createElement('div');

    pages.forEach(page => {
        const clonedPage = page.cloneNode(true);
        clonedPage.style.boxShadow = 'none';
        clonedPage.style.marginBottom = '0';
        clonedPage.style.backgroundColor = 'white';
        container.appendChild(clonedPage);
    });

    const opt = {
        margin: 0,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(container).save();
});

document.getElementById('file-upload').addEventListener('change', function () {
    const file = this.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.display = 'block';
            img.style.margin = '10px auto';

            if (activePage) {
                activePage.appendChild(img);
            } else {
                alert("No page selected!");
            }
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('deletePage').addEventListener('click', () => {
    if (activePage) {
        if (document.querySelectorAll('.paper-page').length > 1) {
            activePage.remove();
            const pages = document.querySelectorAll('.paper-page');
            activePage = pages[pages.length - 1];
            activePage.focus();
            updateStatusBar();
        } else {
            alert("You can't delete the last page!");
        }
    } else {
        alert("No page has been selected for deletion!");
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Delete" && activePage) {
        if (document.querySelectorAll('.paper-page').length > 1) {
            activePage.remove();
            const pages = document.querySelectorAll('.paper-page');
            activePage = pages[pages.length - 1];
            activePage.focus();
            updateStatusBar();
        } else {
            alert("The last page cannot be deleted!");
        }
    }
});
