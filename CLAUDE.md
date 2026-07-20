# 项目：LLM 学习树屋 (bob-llm-treehouse)

> 一套面向零基础学习者的 LLM 课程网站。Bob（一棵老头树）的自学项目。
> 在线地址：https://bob-llm-treehouse.netlify.app

## 项目身份
- 23 课全完结（Phase 0~5），纯静态 HTML，部署在 Netlify
- 目标人群：零基础、设计/文科背景、不想被数学公式劝退的人
- 教学风格：「一个概念 → 具体例子 → 交互原型」，聊天式、大白话、中文优先

## 关键文件
| 文件 | 内容 |
|------|------|
| `README.md` | 项目总览、课程表、致谢 |
| `MISSION.md` | Bob 的学习目标与约束 |
| `LEARNING-ROADMAP.md` | 完整课程路线图 |
| `NOTES.md` | 教学笔记：学习偏好、术语规范、类比原则、沟通格式 |
| `assets/style.css` | 全局样式（Tufte 风格，支持 dark mode） |
| `index.html` | 课程总览主页 |

## 课程结构
```
lessons/
├── 0000-01~03   Phase 0: 前置基础（命令行、Python 上下）
├── 0001~0007    Phase 1: 核心原理（token→embedding→attention→block→训练→GPT）
├── 0008~0012    Phase 2: 代码实现（PyTorch 逐组件实现 GPT-2）
├── 0013~0016    Phase 3: 训练实战（数据→训练循环→云端→生成）
├── 0017~0019    Phase 4: 理解优化（参数计算、训练技巧、评估）
└── 0020         Phase 5: 进阶方向总览
```

## 技术栈
- 纯静态 HTML + CSS + JS，无框架
- CSS 变量定义在 `assets/style.css`，dark mode 通过 `@media (prefers-color-scheme: dark)` 自动切换
- 交互实验用内联 `<script>` 手写 JS，不依赖外部库
- 部署：`npx netlify deploy --prod --dir "."` （CLI 部署，非 GitHub 自动部署）
- Site ID: `88999a43-1f9c-4f11-9cfa-4ba0320064f6`

## 写作约定
- **所有英文术语首次出现必须加中文翻译**
- 术语译名统一（见 NOTES.md）：Block→块, Layer→层, FFN→前馈网络, Residual→残差连接 等
- 减少类比，聚焦技术本身；用过的类比不能为通俗牺牲准确性
- 正式课程内容写 HTML，单独问题解答直接在聊天中输出
- 对已有课程的补充直接整合进原 HTML

## Dark mode 颜色参考
```
--bg: #1a1a18    --text: #e8e4dc    --muted: #b0aca4
--faint: #706c64  --accent: #e88     --link: #e88
--rule: #3a3834   --code-bg: #2a2824  --callout-bg: #282420
--callout-border: #8a6820
```

## 部署命令
```bash
cd "E:\ClaudeCode\学习ai大模型"
npx netlify deploy --prod --dir "."
```
