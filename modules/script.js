import { setupTextarea } from './textarea.js';
import { setupButtons } from './buttons.js';
import { setupModelSelector } from './modelSelector.js';

// 当DOM加载完成后初始化聊天输入组件
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有需要的DOM元素:
    // - 文本输入框
    // - 代码库和聊天发送按钮
    // - 输入框大小调整手柄
    // - 模型选择器相关元素(下拉框、按钮等)
    const elements = {
        textarea: document.querySelector('.styled-input'),
        codebaseButton: document.querySelector('.send-button:first-of-type'),
        chatButton: document.querySelector('.send-button:last-of-type'),
        resizeHandle: document.querySelector('.resize-handle'),
        modelSelector: document.querySelector('.model-selector'),
        modelButton: document.querySelector('.model-button'),
        modelName: document.querySelector('.model-name'),
        modelDropdown: document.querySelector('.model-dropdown'),
        modelOptions: document.querySelectorAll('.model-option')
    };
    
    // 初始化三个主要模块:
    // - textarea模块: 处理输入框的自动调整大小、历史记录等功能
    // - buttons模块: 处理发送按钮的点击事件
    // - modelSelector模块: 处理AI模型的选择功能
    const textarea = setupTextarea(elements);
    const buttons = setupButtons(elements);
    const modelSelector = setupModelSelector(elements);
    const shortcutHint = document.querySelector('.shortcut-hint');
    const originalHintText = shortcutHint.textContent;

    // 监听输入框内容变化
    elements.textarea.addEventListener('input', function() {
        const hasContent = elements.textarea.value.trim().length > 0;
        shortcutHint.textContent = hasContent 
            ? `${originalHintText}  ⌘+K 清空 `
            : originalHintText;
    });

    // 设置按钮模块的回调函数:
    // - 添加消息到历史记录shortcut-hintshortcut-hintshortcut-hintshortcut-hintshortcut-hint
    // - 获取当前选择的模型
    buttons.setAddToHistory(textarea.addToHistory);
    buttons.setGetCurrentModel(modelSelector.getCurrentModel);

    // 将主要功能暴露为全局API，供外部调用:
    // - 获取当前选择的模型
    // - 添加消息到历史记录
    // - 手动触发输入框大小调整
    window.chatInput = {
        getCurrentModel: modelSelector.getCurrentModel,
        addToHistory: textarea.addToHistory,
        autoResize: textarea.autoResize
    };

    // 添加调试代码
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            console.log('Key pressed:', e.key);
            console.log('Event target:', e.target);
            console.log('Active element:', document.activeElement);
        }
    });
}); 