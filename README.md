# 🌳 Bob 的学习树屋 —— 从零理解大语言模型

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![lessons](https://img.shields.io/badge/lessons-10%20completed-brightgreen)](lessons/)
[![status](https://img.shields.io/badge/status-actively%20maintained-blue)]()

一套面向**零基础学习者**的大语言模型（LLM）课程。不需要计算机学位，不需要提前装 Python，甚至不需要懂命令行——打开浏览器就行了。

> 我是 Bob（一棵老头树），一名设计/美术背景的学生。这个项目是我自学 LLM 过程中的学习笔记和课程整理。我的目标是：**用可视化的方式，让抽象的原理变得可见。**

---

## 🚀 快速开始

**无需安装任何依赖。** 所有课程都是纯静态 HTML 文件。

```bash
# 1. 克隆项目
git clone https://github.com/ShuJu575/llm-learning-treehouse.git

# 2. 打开主页
# 用浏览器打开 index.html 即可浏览全部课程
# 或者直接用文件管理器双击 index.html
```

你也可以直接从 [GitHub Pages](#) 在线浏览（即将上线）。

---

## 📖 课程结构

### 设计哲学

每节课遵循 **「一个概念 → 具体例子 → 交互原型」** 的三段式结构：

1. **概念讲解** — 用大白话 + 图解说明这个组件在做什么
2. **具体例子** — 用真实数字走一遍计算过程
3. **交互实验** — 浏览器内直接操作，直观感受概念

### 课程路线图

| 阶段 | 主题 | 课数 | 状态 |
|------|------|------|------|
| **Phase 0** | 前置基础 | 3 课 | ✅ 已完成 |
| **Phase 1** | 核心原理 | 7 课 | ✅ 已完成 |
| **Phase 2** | 代码实现 (PyTorch) | 5 课 | 🔜 开发中 |
| **Phase 3** | 训练实战 | 4 课 | 🔜 规划中 |
| **Phase 4** | 理解与优化 | 3 课 | 🔜 规划中 |
| **Phase 5** | 进阶方向 | 选修 | 🔜 规划中 |

### Phase 0 · 前置基础 ✅

| 编号 | 课程 | 核心内容 |
|------|------|---------|
| L0.1 | [命令行入门](lessons/0000-01-command-line.html) | 终端操作 · cd/ls/python · 含模拟终端 |
| L0.2 | [Python 速通（上）](lessons/0000-02-python-basics-1.html) | 变量 · 列表 · for 循环 · if 判断 · 4 个沙盒 |
| L0.3 | [Python 速通（下）](lessons/0000-03-python-basics-2.html) | 字典 · 函数 · import · 读报错 · 4 个沙盒 |

### Phase 1 · 核心原理 ✅

| 编号 | 课程 | 核心概念 | 交互实验 |
|------|------|---------|---------|
| L1 | [LLM 做什么？](lessons/0001-llm-lifecycle.html) | 预测下一个 token · 自监督学习 | Token 预测演示器 |
| L2 | [数据准备](lessons/0002-data-preparation.html) | BPE 分词 · Token ID · 滑动窗口 | — |
| L3 | [词嵌入与位置编码](lessons/0003-embedding.html) | Embedding 查表 · 正弦位置编码 | 位置编码热力图 |
| L4 | [注意力机制](lessons/0004-attention.html) | Q/K/V · Softmax · 因果遮罩 | — |
| L5 | [Transformer Block](lessons/0005-feedforward-residual.html) | 多头注意力 + FFN + 残差 + LN | 3 个交互实验 |
| L6 | [训练循环](lessons/0006-training-loop.html) | 交叉熵 · 梯度下降 · 反向传播 | 3 个交互实验 |
| L7 | [GPT 组装与生成](lessons/0007-gpt-assembly.html) | 完整架构 · 自回归解码 · 采样 | Temperature 采样实验室 |

### Phase 2~5 · 即将更新 🔜

后续课程规划详见 [LEARNING-ROADMAP.md](LEARNING-ROADMAP.md)。最终目标是：**让每个认真学完的人都能从零训练一个自己的微型 GPT。**

---

## 🎯 适合谁？

- ✅ 对 AI/LLM 好奇，但被数学公式劝退的人
- ✅ 想了解 ChatGPT「为什么能聊天」，不只是「怎么用」
- ✅ 设计/产品/文科背景，想建立技术判断力
- ✅ 零编程基础，愿意从命令行开始学
- ❌ 不适合：已经熟悉 Transformer、想追 SOTA 论文的人

---

## 📁 项目结构

```
.
├── index.html              # 🏠 课程总览主页（从这里开始）
├── README.md               # 本文件
├── LEARNING-ROADMAP.md     # 完整课程路线图（6 个 Phase，22+ 课）
├── MISSION.md              # 项目目标与设计约束
├── NOTES.md                # 教学笔记与术语规范
├── RESOURCES.md            # 参考资源列表（国内可访问）
├── assets/                 # 共享资源
│   ├── style.css           #   全局样式表（Tufte 风格）
│   └── python-interpreter.js # 浏览器端 Python 解释器
├── lessons/                # 📚 课程文件（纯 HTML）
│   ├── 0000-01-command-line.html
│   ├── 0000-02-python-basics-1.html
│   ├── 0000-03-python-basics-2.html
│   ├── 0001-llm-lifecycle.html
│   ├── 0002-data-preparation.html
│   ├── 0003-embedding.html
│   ├── 0004-attention.html
│   ├── 0005-feedforward-residual.html
│   ├── 0006-training-loop.html
│   └── 0007-gpt-assembly.html
├── lessons_backup/         # v1.0 原始版本备份
└── learning-records/       # 学习记录（Bob 的课后笔记）
```

---

## 🙏 致谢

这个项目站在许多开源作者和社区的肩上：

| 贡献者 | 项目/资源 | 感谢理由 |
|--------|----------|---------|
| **Sebastian Raschka** | [LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) (63.7k ⭐) | 核心教材，整个 Phase 1 内容框架的来源 |
| **Datawhale** | [llms-from-scratch-cn](https://github.com/datawhalechina/llms-from-scratch-cn) | 中文翻译 + 组队学习社区 |
| **MLNLP-World** | [LLMs-from-scratch-CN](https://github.com/MLNLP-World/LLMs-from-scratch-CN) | 中文翻译版本 |
| **Jay Alammar** | [Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) | 可视化图解影响了本课程的教学风格 |
| **李宏毅** | [GenAI 导论 (2024)](https://speech.ee.ntu.edu.tw/~hylee/genai/2024-spring.html) | 中文授课，零基础友好 |
| **waylandzhang** | [llm-transformer-book](https://github.com/waylandzhang/llm-transformer-book) | 20 万字 Transformer 手稿 |
| **Andrej Karpathy** | [nanoGPT](https://github.com/karpathy/nanoGPT) | 「从零构建」教学哲学的启发 |
| **B 站知识区 UP 主** | 各类中文讲解视频 | 为中文零基础学习者降低了入门门槛 |

---

## 📝 开源协议

本项目采用 [MIT License](LICENSE)。

- ✅ 你可以自由使用、复制、修改、分发
- ✅ 你可以将课程用于个人学习或教学
- ✅ 欢迎提交 Issue 报告错误或建议
- ✅ 欢迎提交 PR 贡献新课程或改进

---

## 🔧 如何贡献

1. **报告错误** — 在 [Issues](https://github.com/ShuJu575/llm-learning-treehouse/issues) 中描述你发现的问题
2. **改进现有课程** — Fork → 修改 → 提交 PR
3. **贡献新课程** — 参考 [LEARNING-ROADMAP.md](LEARNING-ROADMAP.md) 中未完成的课程，按照「概念 → 例子 → 原型」格式编写
4. **改进可访问性** — 帮助优化移动端体验、暗色模式、屏幕阅读器支持

---

> 🌳 种一棵树最好的时间是十年前，其次是现在。
>
> 这个项目是一个美术生自学 AI 的诚实记录。如果你也在学习的路上，希望它能帮到你。
