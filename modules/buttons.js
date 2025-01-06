// 按钮相关功能
export function setupButtons(elements) {
    const { textarea, codebaseButton, chatButton } = elements;
    let addToHistory = null;
    let getCurrentModel = null;
    
    // 发送消息的处理函数
    function handleSend() {
        const message = textarea.value.trim();
        if (!message) return;
        
        console.log('Sending message:', message);
        
        // 添加到历史记录
        if (addToHistory) {
            addToHistory(message);
        }
        
        // 清空输入框
        textarea.value = '';
        
        // 触发 input 事件以调整高度和更新提示文案
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
    }
    
    // 监听按钮点击事件
    codebaseButton.addEventListener('click', handleSend);
    chatButton.addEventListener('click', handleSend);
    
    // 监听键盘快捷键
    document.addEventListener('keydown', function(e) {
        // 只在输入框聚焦时响应快捷键
        if (document.activeElement !== textarea) return;
        
        if (e.key === 'Enter' && !e.shiftKey) {
            if (e.metaKey) {
                // Command + Enter
                e.preventDefault();
                // 只有 Codebase 按钮显示按下效果
                codebaseButton.classList.add('active');
                codebaseButton.click();
            } else {
                // Enter
                e.preventDefault();
                // 只有 Chat 按钮显示按下效果
                chatButton.classList.add('active');
                chatButton.click();
            }
        }
    });
    
    // 按键抬起时恢复样式
    document.addEventListener('keyup', function(e) {
        // 只在输入框聚焦时响应快捷键
        if (document.activeElement !== textarea) return;
        
        // 如果松开的是 Enter 键，恢复 Chat 按钮样式
        if (e.key === 'Enter') {
            chatButton.classList.remove('active');
        }
        
        // 如果松开的是 Command/Ctrl 键或 Enter 键且没有按住 Command/Ctrl，恢复 Codebase 按钮样式
        if (e.key === 'Meta' || e.key === 'Control' || (e.key === 'Enter' && !e.metaKey && !e.ctrlKey)) {
            codebaseButton.classList.remove('active');
        }
    });
    
    return {
        setAddToHistory: (callback) => {
            addToHistory = callback;
        },
        setGetCurrentModel: (callback) => {
            getCurrentModel = callback;
        }
    };
} 