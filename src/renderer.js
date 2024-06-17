const logContainerElement = document.getElementById('log-container');
const logElement = document.getElementById('log');

const openFileButtonElement = document.getElementById('open-file-button');
const openFileElement = document.getElementById('opened-file');
const openFileContainerElement = document.getElementById('opened-file-container');

const openFileButtonTitleOpenElement = document.getElementById('open-file-button-title-open');
const openFileButtonTitleConvertingElement = document.getElementById('open-file-button-title-converting');

const convertedFilesElement = document.getElementById('converted-files');
const convertedFilesContainerElement = document.getElementById('converted-files-container');

function hide(element) {
    element.classList.add('d-none');
}

function show(element) {
    element.classList.remove('d-none');
}

function disable(element) {
    element.classList.add('disabled');
}

function enable(element) {
    element.classList.remove('disabled');
}

function init() {
    enable(openFileButtonElement);
    hide(openFileContainerElement);
    openFileElement.innerText = '';
    hide(convertedFilesContainerElement);
    convertedFilesElement.innerHTML = '';
    hide(logContainerElement);
    logElement.innerText = '';
}

openFileButtonElement.addEventListener('click', async () => {
    init();
    window.electronAPI.openFile();
})

window.electronAPI.onFileOpened((value) => {

    if (!value.success) {
        return
    }

    disable(openFileButtonElement);
    show(openFileButtonTitleConvertingElement);
    hide(openFileButtonTitleOpenElement);
    show(openFileContainerElement);
    openFileElement.innerText = value.filePath;
})

window.electronAPI.onFileHandled((value) => {
    show(convertedFilesContainerElement);
    enable(openFileButtonElement);
    show(openFileButtonTitleOpenElement);
    hide(openFileButtonTitleConvertingElement);
    convertedFilesElement.innerHTML = '';
    value.forEach(function (val, key) {
        let element = document.createElement('LI');
        element.innerText = val.path;
        convertedFilesElement.appendChild(element)
    });
})

window.electronAPI.onLog((value) => {
    init();
    show(logContainerElement);
    logElement.innerText = JSON.stringify(value);
})

init();
