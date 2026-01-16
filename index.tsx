import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// 👇 加入這行偵錯訊息
console.log("🚀 正在啟動 React...");

// 👇 聰明尋找：不管你是 root 還是 app，我都抓得到
const rootElement = document.getElementById('root') || document.getElementById('app');

if (!rootElement) {
  // 如果真的都找不到，會在 Console 報錯告訴我們
  console.error("❌ 嚴重錯誤：在 index.html 裡找不到 id='root' 或 id='app' 的 div！");
} else {
  console.log(`✅ 成功找到掛載點：id="${rootElement.id}"，開始渲染畫面...`);
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
