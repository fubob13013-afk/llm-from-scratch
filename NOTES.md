# Teaching Notes

## 学习偏好
- **自然聊天式**：不要课程表，不要"今天必须学完 X"。像朋友聊天一样讨论技术。
- **视频优先**：新概念先推视频，再补文字。不想看视频时问我方向性问题。
- **平台限制**：只推荐国内可访问的平台（B站、知乎等）。视频必须是中文或带中文字幕。YouTube、Reddit 等推荐了也看不了。
- **代码为辅**：代码用来"看懂"而不是"会写"。给代码时必须有逐行注释，解释每一段在做什么。
- **视觉解释**：Bob 是美术生/信息设计背景，图解比公式有效。但 CSS 示意图不如直接画在纸上的流程图清晰。

## 节奏
- 每次只教一个概念，保证能装进工作记忆
- 每个概念结束时问：要不要继续深入，还是换方向

## 术语规范
- **所有英文术语首次出现时必须加中文翻译**（括号标注），便于记忆
- 已确认的译名：Block→块, Layer→层, FFN→前馈网络, Residual→残差连接, LayerNorm→层归一化, BatchNorm→批归一化, Embedding→词嵌入, Attention→注意力, Token→词元, Gradient→梯度, Pre-LN→前置层归一化, Post-LN→后置层归一化

## 类比使用原则
- **减少类比，聚焦技术本身**。只有确实精准贴切的类比才用，不为通俗而牺牲准确性
- Bob 曾因酒会聊天类比误解了 Q/K/V 的本质（Q 不是一个能用自然语言描述的"意图"）。此后再用类比时必须加"诚实地说"的后续说明
- 好的类比（保留）：搜索引擎 Q/K/V、RGB 颜色空间解释 Embedding
- 删掉的类比：酒会聊天、食堂打饭、搬家打包

## 沟通格式
- **正式课程内容** → 写 HTML 网页（lessons/ 目录）
- **单独问题解答 / 概念解释** → 直接在终端聊天中输出，不单独创建网页
- 对已有课程的补充解释，直接整合进原 HTML 文件 + 终端说明

## 当前进度（v2.0 完成 · 2026-07-04）

> 重构原则：每课 = 一个核心概念 → 具体例子 → 交互原型。概念依赖链完整串联。

### Phase 0 · 前置基础 ✅
- ✅ L0.1：命令行入门 —— 终端操作、cd/ls/pwd、python、pip（含模拟终端交互）
- ✅ L0.2：Python 速通（上）—— 变量、列表、for 循环、if 判断（含 4 个 Python 沙盒）
- ✅ L0.3：Python 速通（下）—— 字典、函数、import、读报错（含 4 个 Python 沙盒）

### Phase 1 · 核心原理 ✅

- ✅ 第 1 课：LLM 核心任务 —— 预测下一个 token，自监督学习（含 Token 预测演示器交互）
- ✅ 第 2 课：数据准备 —— 分词(BPE) → Token ID → 滑动窗口 → DataLoader
- ✅ 第 3 课：词嵌入与位置编码 —— Embedding（RGB 类比）+ 正弦位置编码（含位置编码热力图交互）
- ✅ 第 4 课：注意力机制 —— 单头 Q/K/V、Softmax、因果遮罩（搜索引擎类比，含 L8 点乘 forward reference）
- ✅ 第 5 课：Transformer Block —— 多头注意力 + FFN + 残差连接 + LayerNorm（含 3 个交互实验）
- ✅ 第 6 课：训练循环 —— 交叉熵损失、梯度下降、前向→反向→更新（含 3 个交互实验）
- ✅ 第 7 课：GPT 组装与文本生成 —— 完整架构串联、自回归解码、Temperature 采样（含采样实验室）

### Phase 2 · 代码实现 ✅

- ✅ 第 8 课：PyTorch 基础 —— 张量、nn.Linear、autograd（含点乘详解 + 矩阵乘法可视化 + autograd 模拟器）
- ✅ 第 9 课：实现 Embedding + 位置编码 —— GPTInputLayer 类（含查表、热力图、组装三个交互）
- ✅ 第 10 课：实现注意力机制 —— MultiHeadAttention 类（含因果遮罩可视化 + 注意力权重模拟）
- ✅ 第 11 课：实现 Transformer Block —— TransformerBlock 类（含 Block 数据流追踪）
- ✅ 第 12 课：组装完整 GPT-2 —— GPTModel 类（含 GPT 参数计算器）

### Phase 3 · 训练实战 ✅

- ✅ 第 13 课：数据准备实战 —— 滑动窗口 → DataLoader（含滑动窗口可视化 + Batch 查看器）
- ✅ 第 14 课：训练循环实战 —— 五步循环 + 学习率调度 + 梯度裁剪 + checkpoint（含训练模拟器）
- ✅ 第 15 课：云端训练 —— Colab / AutoDL 教程
- ✅ 第 16 课：文本生成实战 —— generate() 函数（含逐 token 生成演示）

### Phase 4 · 理解与优化 ✅

- ✅ 第 17 课：参数计算与模型缩放 —— 逐组件公式 + Chinchilla 定律（含 GPT 模型族缩放对比）
- ✅ 第 18 课：训练技巧 —— warmup/cosine、梯度裁剪、混合精度、梯度累积、数据质量（含 LR 曲线图）
- ✅ 第 19 课：评估方法 —— Perplexity、Benchmark、人工评估

### Phase 5 · 进阶方向 ✅

- ✅ 第 20 课：进阶方向总览 —— 微调对齐(A)、量化部署(B)、多模态(C)、Agent工具(D) 四条路线图

### 项目状态
- 🌐 上线地址：https://bob-llm-treehouse.netlify.app
- 📦 GitHub：https://github.com/fubob13013-afk/llm-from-scratch
- 📊 总计：23 课（含 Phase 0 三节）· 18+ 交互实验 · 全部上线
- 主干教材：LLMs-from-scratch (Sebastian Raschka)
