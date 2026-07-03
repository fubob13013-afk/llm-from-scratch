# DataLoader 三大概念：Batching / Shuffling / Padding

Bob 在第 2 课末尾对 DataLoader 的三个概念感到困惑，第 3 课专门展开讲解。

## 学习前的困惑
- 「Batching：一次处理 8~64 个样本」——为什么是这个数字？GPU 和 CPU 在处理方式上到底有什么不同？
- 「Shuffling：每个 epoch 开始前打乱样本顺序」——为什么模型会「记住顺序」？记住顺序有什么不好？
- 「Padding：短的补 [PAD] 到统一长度」——补了之后模型会不会把 PAD 也学了？

## 核心理解（课后）
- **Batching** = 利用 GPU 几千核心的并行能力，一次喂一组样本（而非一个一个喂），GPU 利用率从 ~3% 提升到 ~85%
- **CPU vs GPU**：CPU 是少数大将（擅长复杂逻辑），GPU 是几千小兵（擅长大量简单运算同时做）
- **Padding** = 让 batch 内不同长度的样本对齐成矩阵（GPU 要求矩形输入），短句后面补 [PAD]，配合 Attention Mask 让模型忽略 PAD 位置
- **Shuffling** = 每个 epoch 前全局打乱样本顺序，防止模型利用数据排列顺序作为「作弊信号」而非学习语言规律
- 三者配合顺序：Shuffle → 分组(Batching) → Padding → 喂 GPU（注意 Shuffle 必须在前）

## 遗留问题
- Attention Mask 的具体机制还没展开——留到 Attention 那课
- 「梯度」是什么？为什么 shuffle 能让梯度更随机？——留到训练/优化器那课

## 教学观察
- Bob 对「类比」的吸收非常好——食堂托盘、搬家打包、背单词卡片这几个类比让他快速建立了直觉
- 视觉组件（batch grid、shuffle viz、gpu 利用率 bar）有效——比纯文字描述直观得多
- 可能需要警惕：类比是简化模型，Bob 可能会过度依赖类比而忽略精确理解。后续课程中应该偶尔回测精确理解。
