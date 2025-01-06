import { setupHistory } from './history.js';
import { setupResize } from './resize.js';

export function setupTextarea(elements) {
    const { textarea } = elements;
    const history = setupHistory(elements);
    const resize = setupResize(elements);
    
    // 重置输入框状态
    function resetTextarea() {
        // 清空输入内容
        textarea.value = '';
        
        // 先触发高度调整
        autoResize();
        
        // 重置自定义高度
        resize.resetCustomHeight();
        
        // 重置历史记录状态
        history.resetState();
        
        // 触发 input 事件以更新提示文案
        textarea.dispatchEvent(new Event('input'));
        
        // 聚焦输入框
        textarea.focus();
    }
    
    // 自动调整高度函数
    function autoResize() {
        // 如果有自定义高度，不进行自动调整
        if (resize.hasCustomHeight()) {
            return;
        }
        
        const minHeight = resize.getMinHeight();
        const maxHeight = 600;
        
        // 先将高度设置为最小值，以便正确计算 scrollHeight
        textarea.style.height = `${minHeight}px`;
        
        // 计算实际内容高度
        const scrollHeight = textarea.scrollHeight;
        
        // 根据内容高度和限制确定最终高度
        const finalHeight = Math.min(
            Math.max(scrollHeight, minHeight),
            maxHeight
        );
        
        textarea.style.height = `${finalHeight}px`;
        
        // 如果内容超过最大高度，显示滚动条
        textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
    
    // 监听输入事件，自动调整高度
    textarea.addEventListener('input', autoResize);
    
    // 监听键盘事件
    textarea.addEventListener('keydown', function(e) {
        // 处理 Enter 键
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Shift + Enter 允许换行
                e.stopPropagation(); // 阻止事件冒泡，避免触发发送
            } else {
                // 普通 Enter 阻止换行
                e.preventDefault();
            }
        }
        
        // 处理历史记录导航的键盘事件(上下键切换历史消息)
        history.handleKeydown(e);
    });
    
    // 监听全局快捷键
    document.addEventListener('keydown', function(e) {
        // 处理 Cmd+K
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();  // 阻止默认行为
            resetTextarea();
        }
    });
    
    // 监听窗口大小变化，重新调整高度
    window.addEventListener('resize', autoResize);
    
    // 监听字体加载完成，重新调整高度
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(autoResize);
    }
    
    // 初始调用一次以设置正确的高度
    autoResize();
    
    return {
        autoResize,
        addToHistory: history.addToHistory,
        resetTextarea  // 暴露重置方法
    };
} 