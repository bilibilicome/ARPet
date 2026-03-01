(function() {
    'use strict';

    const CONFIG = {
        UPLOAD_API: 'http://localhost:8080/api/upload',
        QUERY_API: 'http://localhost:8080/api/query'
    };

    const elements = {
        uploadBox: document.getElementById('uploadBox'),
        fileInput: document.getElementById('fileInput'),
        uploadBtn: document.getElementById('uploadBtn'),
        resetBtn: document.getElementById('resetBtn'),
        previewArea: document.getElementById('previewArea'),
        originalImage: document.getElementById('originalImage'),
        cartoonImage: document.getElementById('cartoonImage'),
        arBtn: document.getElementById('arBtn'),
        saveOriginalBtn: document.getElementById('saveOriginalBtn'),
        saveCartoonBtn: document.getElementById('saveCartoonBtn'),
        loading: document.getElementById('loading'),
        toast: document.getElementById('toast')
    };

    let selectedFile = null;
    let currentData = null;

    function showToast(message) {
        elements.toast.textContent = message;
        elements.toast.classList.add('active');
        setTimeout(() => {
            elements.toast.classList.remove('active');
        }, 2000);
    }

    function showLoading(text) {
        document.querySelector('.loading-text').textContent = text || '处理中...';
        elements.loading.classList.add('active');
    }

    function hideLoading() {
        elements.loading.classList.remove('active');
    }

    function handleUploadBoxClick() {
        elements.fileInput.click();
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        elements.uploadBox.classList.add('dragover');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        elements.uploadBox.classList.remove('dragover');
    }

    function handleDrop(e) {
        e.preventDefault();
        elements.uploadBox.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    }

    function processFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('请选择图片文件');
            return;
        }
        selectedFile = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            elements.originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
        elements.uploadBtn.disabled = false;
    }

    async function uploadImage() {
        if (!selectedFile) {
            showToast('请先选择图片');
            return;
        }

        showLoading('正在生成卡通形象...');

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(CONFIG.UPLOAD_API, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.code === 200 || result.code === 0) {
                currentData = result.data;
                elements.cartoonImage.src = result.data.cartoonUrl;
                elements.previewArea.classList.add('active');
                
                localStorage.setItem('cartoonUrl', result.data.cartoonUrl);
                localStorage.setItem('originalImageUrl', elements.originalImage.src);
                localStorage.setItem('hasData', 'true');
                
                showToast('生成成功！数据已保存！');
            } else {
                showToast(result.message || '生成失败，请重试');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showToast('网络错误，请检查网络连接');
        } finally {
            hideLoading();
        }
    }

    function resetForm() {
        selectedFile = null;
        currentData = null;
        elements.fileInput.value = '';
        elements.uploadBtn.disabled = true;
        elements.previewArea.classList.remove('active');
        elements.originalImage.src = '';
        elements.cartoonImage.src = '';
    }

    function saveImage(imgSrc, filename) {
        const link = document.createElement('a');
        link.href = imgSrc;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('图片已保存！');
    }

    function saveOriginalImage() {
        if (elements.originalImage.src) {
            saveImage(elements.originalImage.src, 'original-target.jpg');
        }
    }

    function saveCartoonImage() {
        if (elements.cartoonImage.src) {
            saveImage(elements.cartoonImage.src, 'cartoon-result.jpg');
        }
    }

    function goToAR() {
        if (currentData && currentData.cartoonUrl) {
            localStorage.setItem('cartoonUrl', currentData.cartoonUrl);
            localStorage.setItem('originalImageUrl', elements.originalImage.src);
            localStorage.setItem('hasData', 'true');
            window.location.href = 'ar-start.html';
        } else {
            const savedCartoonUrl = localStorage.getItem('cartoonUrl');
            const savedOriginalUrl = localStorage.getItem('originalImageUrl');
            if (savedCartoonUrl && savedOriginalUrl) {
                window.location.href = 'ar-start.html';
            } else {
                showToast('请先上传图片');
            }
        }
    }

    function checkSavedData() {
        const savedCartoonUrl = localStorage.getItem('cartoonUrl');
        const savedOriginalUrl = localStorage.getItem('originalImageUrl');
        const hasData = localStorage.getItem('hasData');
        
        if (hasData === 'true' && savedCartoonUrl && savedOriginalUrl) {
            elements.originalImage.src = savedOriginalUrl;
            elements.cartoonImage.src = savedCartoonUrl;
            elements.previewArea.classList.add('active');
            elements.uploadBtn.disabled = false;
        }
    }

    function init() {
        checkSavedData();
        
        elements.uploadBox.addEventListener('click', handleUploadBoxClick);
        elements.fileInput.addEventListener('change', handleFileSelect);
        elements.uploadBox.addEventListener('dragover', handleDragOver);
        elements.uploadBox.addEventListener('dragleave', handleDragLeave);
        elements.uploadBox.addEventListener('drop', handleDrop);
        elements.uploadBtn.addEventListener('click', uploadImage);
        elements.resetBtn.addEventListener('click', resetForm);
        elements.arBtn.addEventListener('click', goToAR);
        if (elements.saveOriginalBtn) {
            elements.saveOriginalBtn.addEventListener('click', saveOriginalImage);
        }
        if (elements.saveCartoonBtn) {
            elements.saveCartoonBtn.addEventListener('click', saveCartoonImage);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
