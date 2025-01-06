// 模型选择器相关功能
export function setupModelSelector({ modelSelector, modelButton, modelName, modelDropdown, modelOptions }) {
    let currentModel = 'Claude-3.5';
    let isDropdownOpen = false;

    // 更新显示的模型名称
    function updateModelName(name) {
        currentModel = name;
        modelName.textContent = name;
    }

    // 切换下拉菜单的显示状态
    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen;
        if (isDropdownOpen) {
            modelDropdown.style.display = 'block';
            modelSelector.classList.add('active');
        } else {
            modelDropdown.style.display = 'none';
            modelSelector.classList.remove('active');
        }
    }

    // 关闭下拉菜单
    function closeDropdown() {
        isDropdownOpen = false;
        modelDropdown.style.display = 'none';
        modelSelector.classList.remove('active');
    }

    // 选择模型
    function selectModel(option) {
        const name = option.querySelector('.option-name').textContent;
        updateModelName(name);
        closeDropdown();
    }

    // 点击按钮时切换下拉菜单
    modelButton.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown();
    });

    // 点击选项时选择模型
    modelOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            selectModel(this);
        });
    });

    // 点击其他地方时关闭下拉菜单
    document.addEventListener('click', function(e) {
        if (!modelSelector.contains(e.target)) {
            closeDropdown();
        }
    });

    // 监听快捷键
    document.addEventListener('keydown', function(e) {
        if (e.metaKey || e.ctrlKey) {
            const key = e.key;
            if (key === '1' || key === '2') {
                e.preventDefault();
                const index = parseInt(key) - 1;
                if (modelOptions[index]) {
                    selectModel(modelOptions[index]);
                }
            }
        } else if (e.key === 'Escape' && isDropdownOpen) {
            closeDropdown();
        }
    });

    return {
        getCurrentModel: () => currentModel
    };
} 