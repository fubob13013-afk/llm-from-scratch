# 🗺️ LLM 学习路线图 · 从零到训练自己的大模型

> 目标人群：零基础、高中数学水平、对电脑了解不深
> 最终目标：① 理解大模型底层原理与训练过程 ② 能自己构建大模型训练框架
> 教学原则：每课 = 一个核心概念 → 具体例子 → 交互原型（浏览器可操作）

---

## 📐 整体架构：五个阶段

```
Phase 0      Phase 1        Phase 2         Phase 3         Phase 4        Phase 5
前置基础  →  核心原理   →   代码实现   →   训练实战   →   理解优化   →   进阶方向
(3课 ✅)    (7课 ✅)       (5课 ✅)       (4课 ✅)       (3课 ✅)       (1课 ✅)
 环境        Transformer    逐组件用       数据+训练       参数计算        微调对齐
 Python      架构原理       PyTorch       在Colab上       训练技巧        量化部署
 命令行                     实现GPT        跑通训练        评估方法        多模态Agent
```

### 阶段依赖关系

```
Phase 0 ──→ Phase 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4 ──→ Phase 5
   ✅          ✅          ✅          ✅          ✅          ✅
已完成      已完成      已完成      已完成      已完成      已完成
```

每个 Phase 内部也有严格的先后依赖。Phase 2 的每节课必须按顺序上——因为每节课的代码是下一节课代码的基础。

---

## Phase 0：前置基础（3 课）—— 工欲善其事

> **为什么需要这个阶段？** 后续 Phase 2+3 需要写代码、跑命令行、用 Jupyter Notebook。如果连「终端」「变量」「pip install」都不熟，会卡在环境配置上。这三节课只教「刚好够用」的基础，不深入。

### L0.1 · 命令行入门（30 分钟）
- **核心问题**：怎么在电脑上运行一个 Python 脚本？
- **内容**：终端是什么 → cd/ls/pwd → 运行 `python hello.py` → pip install → 常见报错怎么看
- **交互原型**：浏览器内模拟终端（输入命令看输出）
- **产出**：学员能在自己电脑上成功运行 `python --version` 和 `pip install numpy`

### L0.2 · Python 速通（上）—— 变量、列表、循环（45 分钟）
- **核心问题**：怎么让计算机重复做一件事？
- **内容**：变量赋值 → 数字/字符串/列表 → for 循环 → if 判断 → 函数定义
- **只教后续课程用得到的语法**，不教面向对象、装饰器、上下文管理器等
- **交互原型**：浏览器内 Python 小沙盒（输入代码 → 立即执行看结果）
- **产出**：学员能看懂 `for x in data: print(x)` 这样的代码

### L0.3 · Python 速通（下）—— 函数、字典、import（45 分钟）
- **核心问题**：怎么用别人写好的代码？
- **内容**：字典（key-value）→ 函数（def + return）→ import → 读报错信息
- **交互原型**：浏览器内 Python 沙盒
- **产出**：学员能看懂 `import torch; torch.nn.Linear(768, 768)` 这样的代码

> ⚠️ Phase 0 的三个「产出」标准很关键：不是「学过」，而是「能做到」。如果连 `python hello.py` 都跑不起来，后面课程无法进行。

---

## Phase 1：核心原理（7 课）✅ 已完成

> 这就是当前 7 节课。理解 Transformer/GPT 的完整架构和训练原理——不需要写代码，只需要「看懂」。

| 课次 | 标题 | 核心概念 | 交互实验 |
|------|------|---------|---------|
| L1 | LLM 做什么？ | 预测下一个 token，自监督学习 | Token 预测演示器 |
| L2 | 数据准备 | BPE 分词 → Token ID → 滑动窗口 → DataLoader | — |
| L3 | 词嵌入与位置编码 | Embedding 查表，正弦位置编码 | 位置编码热力图 |
| L4 | 注意力机制 | 单头 Q/K/V，Softmax，因果遮罩 | — |
| L5 | Transformer Block | 多头注意力 + FFN + 残差 + LayerNorm | 线性vs非线性 / 梯度衰减 / 数值漂移 |
| L6 | 训练循环 | 交叉熵损失，梯度下降，前向→反向→更新 | 交叉熵计算器 / 梯度下降可视化 / 微型训练循环 |
| L7 | GPT 组装与生成 | 完整架构串联，自回归解码，Temperature 采样 | Temperature 采样实验室 |

**Phase 1 产出**：能用自己的话向别人解释 LLM 从数据到生成文本的完整原理。

---

## Phase 2：代码实现（5 课）—— 用 PyTorch 逐组件实现 GPT

> **这是最关键的一个阶段。** 把 Phase 1 的「概念理解」变成「能跑通的代码」。每一课对应一个组件，从零把 GPT-2 小型版（124M 参数）的所有代码写出来。

### L8 · PyTorch 基础（45 分钟）
- **核心问题**：张量是什么？PyTorch 怎么自动求导？
- **内容**：
  - 张量 = 多维数组（对标 NumPy，但能在 GPU 上跑）
  - `torch.randn()`, `torch.matmul()`, `torch.softmax()`
  - `nn.Linear` = 矩阵乘法 + 偏置（就是第 5 课讲的 Wx+b）
  - `nn.Embedding` = 查表（就是第 3 课讲的 Embedding 层）
  - `autograd`：forward 自动记录计算图，backward 自动求梯度
- **交互原型**：浏览器 PyTorch 沙盒（或 Colab 链接），每个 API 都有可运行的代码单元
- **产出**：学员能定义 `nn.Linear(768, 768)` 并理解它在做什么

### L9 · 实现 Embedding + 位置编码（30 分钟）
- **核心问题**：怎么把第 3 课的概念翻译成代码？
- **内容**：
  - `nn.Embedding(vocab_size, emb_dim)` 的定义和使用
  - 正弦位置编码的代码实现（sin/cos 公式 → 代码）
  - 可学习位置编码（`nn.Parameter`）
  - 两种编码的加法：`x = tok_emb + pos_emb`
  - Dropout 层
- **产出**：学员能写出 GPT 的输入处理层（token ID → embedding 向量）

### L10 · 实现注意力机制（45 分钟）
- **核心问题**：怎么把 Q/K/V 和因果遮罩写成代码？
- **内容**：
  - `nn.Linear` 实现 W^Q, W^K, W^V 三个投影
  - 点积注意力：`attn_scores = Q @ K.T / sqrt(d_k)`
  - 因果遮罩：`torch.tril()` 生成下三角矩阵，masked_fill 把上三角设为 -inf
  - Softmax + 加权求和 V
  - 单头 → 多头：拆分 head 维度，`transpose` 操作
  - 完整 `MultiHeadAttention` 类
- **产出**：学员能写出完整的 `MultiHeadAttention` 模块

### L11 · 实现 Transformer Block（30 分钟）
- **核心问题**：怎么把 Attention + FFN + 残差 + LayerNorm 拼成一个 Block？
- **内容**：
  - `nn.LayerNorm` 的用法
  - FFN：`nn.Linear(emb_dim, 4*emb_dim)` → GELU → `nn.Linear(4*emb_dim, emb_dim)`
  - 残差连接：`x = x + sublayer(x)`
  - Pre-LN 顺序：LN → Sublayer → +x
  - 完整 `TransformerBlock` 类
- **产出**：学员能写出完整的 `TransformerBlock` 模块

### L12 · 组装完整 GPT-2 模型（30 分钟）
- **核心问题**：怎么把所有组件拼成一个能前向传播的完整模型？
- **内容**：
  - `GPTModel` 类：`__init__` 里定义所有层，`forward` 里串联
  - 最终输出层：`nn.Linear(emb_dim, vocab_size)` + Softmax
  - 参数统计：`sum(p.numel() for p in model.parameters())` → 看到 124M
  - 前向传播测试：输入随机 token ID，检查输出 shape 是否正确
  - 与 HuggingFace GPT-2 的权重对应关系
- **产出**：学员拥有一个完整的、能前向传播的 GPT-2 小型版代码（约 150 行）

**Phase 2 产出**：一份约 150 行的 `gpt2.py`，包含 `MultiHeadAttention`、`TransformerBlock`、`GPTModel` 三个类，能接受 token ID 输入并输出概率分布。

---

## Phase 3：训练实战（4 课）—— 真正训练一个模型

> 有了模型代码，下一步是喂数据、跑训练、看 loss 下降。这个阶段使用免费 GPU（Google Colab 或 AutoDL），不需要自己的硬件。

### L13 · 数据准备实战（45 分钟）
- **核心问题**：怎么把原始文本变成训练用的 DataLoader？
- **内容**：
  - 选一个极小数据集（如《三体》第一部的前 10 万字，或维基百科中文子集）
  - 用 tiktoken（GPT-2 的分词器）做 BPE 分词
  - 实现滑动窗口切分：`create_dataloader(text, batch_size, max_length, stride)`
  - 构造训练集和验证集（9:1 划分）
  - 验证 DataLoader 输出 shape 正确
- **产出**：学员能加载文本数据并转换为可训练的 batch

### L14 · 训练循环实战（45 分钟）
- **核心问题**：怎么写出完整的训练脚本？
- **内容**：
  - 实现 `train_one_epoch` 函数：遍历 DataLoader → forward → loss → backward → update
  - 实现 `evaluate` 函数：在验证集上计算 loss（不更新参数）
  - 训练状态打印：步数、训练 loss、验证 loss、每秒 token 数
  - 学习率调度器：`torch.optim.lr_scheduler.CosineAnnealingLR`
  - 梯度裁剪：`torch.nn.utils.clip_grad_norm_`
  - Checkpoint 保存与恢复
- **产出**：学员拥有完整的训练脚本，包含训练循环、验证、checkpoint

### L15 · 在云端训练（30 分钟）
- **核心问题**：怎么不花钱用 GPU 训练模型？
- **内容**：
  - Google Colab 免费 GPU 使用教程（或 AutoDL 国内替代）
  - 上传代码 + 数据 → 运行训练
  - 监控：loss 曲线、训练速度
  - 训练多久？小数据 + 小模型 = 1~2 小时出初步结果
  - 下载训练好的 checkpoint
- **交互原型**：提供完整的 Colab notebook 链接，一键运行
- **产出**：学员在云端成功运行训练，得到 loss 下降曲线和一个能生成文本的 checkpoint

### L16 · 文本生成实战（30 分钟）
- **核心问题**：怎么加载训练好的模型来生成文本？
- **内容**：
  - 加载 checkpoint：`model.load_state_dict(torch.load('model.pth'))`
  - 实现 `generate` 函数：输入 prompt → 逐 token 预测 → 拼接 → 循环
  - Temperature / Top-k / Top-p 采样的代码实现
  - 对比不同 prompt 和不同采样参数的生成效果
  - 分析：模型学会了什么模式？有什么明显的错误？
- **产出**：学员能用自己的 checkpoint 生成文本，并能调 Temperature 控制风格

**Phase 3 产出**：一个自己训练的、能生成中文文本的微型 GPT 模型 + 完整的训练+生成脚本。

---

## Phase 4：理解与优化（3 课）—— 从「能跑」到「理解为什么」

> 训练跑通了，但还有一堆问题：参数怎么算出来的？为什么这样设计？怎么让训练更快更好？

### L17 · 参数计算与模型缩放（45 分钟）
- **核心问题**：124M 参数到底是怎么算出来的？从 124M 到 1.5B 改变了什么？
- **内容**：
  - 逐组件计算参数量：Embedding 表、每层 Attention（Q/K/V/O）、每层 FFN（W1/W2）、LayerNorm
  - 参数量 ≈ 12 × (4 × d_model² + 8 × d_model²) + vocab_size × d_model
  - 缩放定律简介：层数 vs 宽度 vs 数据量，哪个对效果影响最大？
  - Chinchilla 定律：最优的训练 token 数 ≈ 20 × 参数量
  - 为什么 GPT-4 是 GPT-3 的 ~10 倍参数但效果好那么多？
- **产出**：学员能根据层数、维度、词表大小，手动估算任何 GPT 模型的参数量

### L18 · 训练技巧（45 分钟）
- **核心问题**：同样的模型架构，为什么有人训练一周效果好，有人训练一个月效果差？
- **内容**：
  - 学习率调度：warmup → cosine decay（为什么需要 warmup？回到第 5 课的梯度概念）
  - 梯度裁剪：防止某一步梯度爆炸把参数拽飞
  - 混合精度训练（FP16/BF16）：省显存 + 加速，原理是半精度算矩阵、全精度存参数
  - 梯度累积：显存不够时，「假装」用更大的 batch size
  - Batch Size 对训练稳定性的影响
  - 数据去重与质量过滤：Garbage in, garbage out
- **产出**：学员能解释每个训练超参数的作用，并知道调参的方向

### L19 · 评估方法（30 分钟）
- **核心问题**：怎么客观判断一个模型好不好？
- **内容**：
  - Perplexity（困惑度）：最基础的评估指标，exp(交叉熵)
  - 为什么 Perplexity 低不代表模型好用？（过拟合、数据污染）
  - 常用 Benchmark：HellaSwag、MMLU、C-Eval（中文）
  - 人工评估：A/B 测试、Elo 评分
  - 训练数据污染问题：为什么不能只看 benchmark 分数
- **产出**：学员理解「好模型」的评判标准是多维度的，不只看 loss

**Phase 4 产出**：能回答「为什么 GPT-3 比 GPT-2 好」「为什么这个训练配置有效」等深层问题。拥有调试训练的技术判断力。

---

## Phase 5：进阶方向（选修，按兴趣选学）

> 以下内容不属于「理解预训练原理 + 构建训练框架」的核心目标，但是通向「离线陪伴机器人」这个 Bob 长远目标的必经之路。

### 方向 A：微调与对齐
- **SFT（监督微调）**：用几千条高质量对话把 Base Model 变成 Chat Model
- **RLHF / DPO**：用人类反馈让模型输出安全、有帮助的内容
- **LoRA / QLoRA**：不更新全部参数，只训练一小部分——显存友好

### 方向 B：量化与部署
- **量化原理**：INT8/INT4 量化，怎么把 7B 模型压到 4GB
- **llama.cpp / Ollama**：本地推理引擎，CPU 上跑 7B 模型
- **边缘部署**：树莓派、手机上跑 LLM 的可行性

### 方向 C：多模态
- **CLIP**：文本-图像对齐，让模型「看懂」图片
- **Diffusion + DiT**：视频生成模型的原理（C-Dance 等技术栈）
- **语音对话**：ASR + LLM + TTS 串联

### 方向 D：Agent 与工具使用
- **Function Calling**：让 LLM 调用外部工具（搜索、计算器、API）
- **RAG（检索增强生成）**：外挂知识库，解决幻觉问题
- **Memory**：让模型记住多轮对话的历史

> 每个方向 2~3 课。建议在 Phase 4 完成后，根据当时的兴趣选择 1~2 个方向深入。

---

## 📊 总览

| 阶段 | 课数 | 累计 | 状态 | 核心产出 |
|------|------|------|------|---------|
| Phase 0 · 前置基础 | 3 | 3 | ✅ 已完成 | 能跑 Python 脚本 |
| Phase 1 · 核心原理 | 7 | 10 | ✅ 已完成 | 能用嘴解释 LLM 原理 |
| Phase 2 · 代码实现 | 5 | 15 | ✅ 已完成 | 约 150 行 gpt2.py |
| Phase 3 · 训练实战 | 4 | 19 | ✅ 已完成 | 自己训练的微型 GPT |
| Phase 4 · 理解优化 | 3 | 22 | ✅ 已完成 | 能解释设计决策 |
| Phase 5 · 进阶方向 | 1 | 23 | ✅ 已完成 | 四条路线总览 |

---

## 🎯 两个学习目标的达成路径

### 目标一：整体理解大模型的底层原理及训练过程
**完成 Phase 1 + Phase 4 即达成。**
- Phase 1 给你「知识骨架」：每个组件做什么、为什么这样设计
- Phase 4 给你「判断力」：为什么大模型比小模型好、训练配置怎么影响效果

### 目标二：能自己构建出大模型的训练框架
**完成 Phase 0 + Phase 2 + Phase 3 即达成。**
- Phase 0 给你「工具能力」：能用 Python、命令行、Jupyter
- Phase 2 给你「代码骨架」：从零写出 GPT 的每个组件
- Phase 3 给你「实战经验」：真正跑通训练+生成

---

## ⚠️ 重要约束

1. **每课必须可交互**：概念讲解后必须有浏览器内可操作的实验（延续 Phase 1 的风格）
2. **代码必须有逐行注释**：目标人群不是程序员，每行代码都要解释「这一行在干什么」
3. **只用国内可访问的资源**：Colab 可能需要替代方案（AutoDL / 魔搭社区）
4. **保持「一个概念 → 例子 → 原型」结构**：延续 Phase 1 的教学模式
5. **同一术语全课程统一**：延续 NOTES.md 里的术语规范
