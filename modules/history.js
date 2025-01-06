// 历史记录相关功能模块
export function setupHistory({ textarea }) {
    // 存储历史消息记录
    let messageHistory = [];
    // 当前浏览的历史记录索引,-1表示当前输入
    let historyIndex = -1; 
    // 临时存储当前输入内容
    let tempInput = '';
    // 标记是否修改了历史记录
    let isHistoryModified = false;

    /**
     * 浏览历史记录
     * @param {string} direction - 浏览方向,'up'向上,'down'向下
     */
    function navigateHistory(direction) {
        const totalHistory = messageHistory.length;
        
        // 如果没有历史记录，直接返回
        if (totalHistory === 0) return;
        
        // 首次向上浏览时保存当前输入
        if (historyIndex === -1) {
            tempInput = textarea.value;
        }
        
        // 根据方向更新索引位置
        if (direction === 'up') {
            if (historyIndex < totalHistory - 1) {
                historyIndex++;
                isHistoryModified = false;  // 重置修改标记
            }
        } else if (direction === 'down') {
            if (historyIndex > -1) {
                historyIndex--;
                isHistoryModified = false;  // 重置修改标记
            }
        }
        
        // 根据索引更新输入框内容
        if (historyIndex === -1) {
            textarea.value = tempInput;
        } else {
            textarea.value = messageHistory[historyIndex];
        }
        
        // 触发input事件以调整输入框高度
        textarea.dispatchEvent(new Event('input'));
        
        // 将光标移到文本末尾
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    }

    /**
     * 添加新消息到历史记录
     * @param {string} message - 要添加的消息
     */
    function addToHistory(message) {
        messageHistory.unshift(message);
        historyIndex = -1;
        tempInput = '';
        isHistoryModified = false;
    }

    // 监听输入事件,标记历史记录是否被修改
    textarea.addEventListener('input', function() {
        if (historyIndex !== -1 && textarea.value !== messageHistory[historyIndex]) {
            isHistoryModified = true;
        }
    });

    // 返回公共接口
    return {
        addToHistory,
        // 处理键盘事件
        handleKeydown: function(e) {
            // 如果历史记录已被修改,禁止继续导航
            if (isHistoryModified) return;
            
            // 向上键导航历史
            if (e.key === 'ArrowUp' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                navigateHistory('up');
            }
            // 向下键导航历史
            if (e.key === 'ArrowDown' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                navigateHistory('down');
            }
        }
    };
} 