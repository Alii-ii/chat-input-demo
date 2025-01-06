// 大小调整相关
export function setupResize({ textarea, resizeHandle }) {
    const DEFAULT_HEIGHT = 32;
    const MAX_HEIGHT = 600;
    let customHeight = null;
    let isResizing = false;
    let dragStartY = 0;
    let dragStartHeight = 0;
    let activeHandle = null;
    
    // 计算基于内容的最小高度
    function getContentBasedHeight() {
        // 临时设置高度为最小值以获取实际内容高度
        const originalHeight = textarea.style.height;
        textarea.style.height = `${DEFAULT_HEIGHT}px`;
        const contentHeight = textarea.scrollHeight;
        textarea.style.height = originalHeight;
        
        return Math.min(Math.max(contentHeight, DEFAULT_HEIGHT), MAX_HEIGHT);
    }
    
    function onMouseDown(e) {
        e.preventDefault();
        isResizing = true;
        activeHandle = e.target;
        
        dragStartY = e.clientY;
        dragStartHeight = parseInt(getComputedStyle(textarea).height);
        
        document.body.style.cursor = 'ns-resize';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.body.style.userSelect = 'none';
    }
    
    function onMouseMove(e) {
        if (!isResizing) return;
        
        const delta = e.clientY - dragStartY;
        const invertedDelta = -delta;
        
        // 计算新高度，handle位置直接映射到输入框高度
        const newHeight = Math.min(
            Math.max(dragStartHeight + invertedDelta, DEFAULT_HEIGHT),
            MAX_HEIGHT
        );
        
        customHeight = newHeight;
        textarea.style.height = `${newHeight}px`;
        
        textarea.focus();
    }
    
    function onMouseUp(e) {
        if (!isResizing) return;
        
        isResizing = false;
        activeHandle = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    
    function onDoubleClick() {
        customHeight = null;
        const contentHeight = getContentBasedHeight();
        textarea.style.height = `${contentHeight}px`;
    }
    
    // 获取顶部触点元素
    const topHandle = document.querySelector('.resize-handle-top');
    
    resizeHandle.addEventListener('mousedown', onMouseDown);
    resizeHandle.addEventListener('dblclick', onDoubleClick);
    topHandle.addEventListener('mousedown', onMouseDown);
    topHandle.addEventListener('dblclick', onDoubleClick);
    
    return {
        getMinHeight: () => DEFAULT_HEIGHT,
        hasCustomHeight: () => customHeight !== null,
        getCustomHeight: () => customHeight,
        getContentBasedHeight,
        resetCustomHeight: () => {
            customHeight = null;
            textarea.style.height = `${DEFAULT_HEIGHT}px`;
        }
    };
} 