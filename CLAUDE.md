# Tus - 北京工业大学试卷共享平台

## 项目概述
Tus 是一个面向北京工业大学学生的试卷共享平台，部署在 GitHub Pages。数据以 JSON 格式存储在仓库中，通过管理脚本进行内容管理。纯静态网站，零后端依赖。

## 项目路径
`C:\Users\Haxim\Tus\`

## 上线地址
**[https://tjiux.github.io/tus/](https://tjiux.github.io/tus/)**

## 联系方式 / 维护者
- GitHub: **tjiux**
- 项目仓库: **[https://github.com/tjiux/tus](https://github.com/tjiux/tus)**
- 维护者: Haxim

## 技术栈
- 纯 HTML/CSS/JS 静态网站
- Tailwind CSS (CDN)
- GitHub Pages 部署
- GitHub Actions 自动构建

## 当前数据状态（截至 2026-06-19）

### 科目（2 个）
| ID | 名称 | 年级 | 试卷数 |
|----|------|------|--------|
| 1 | 高等数学 | 大一 | 0 |
| 2 | 高等数学-都柏林 | 大一 | 3 |

### 试卷（3 份，全部属于 都柏林高数）
| ID | 标题 | 年份 | 学期 | 文件 |
|----|------|------|------|------|
| 1 | 2024-2025都柏林高数大一下期末 | 2025 | 下学期期末 | .pdf |
| 2 | 2023-2024都柏林高数大一下期末 | 2024 | 下学期期末 | .pdf |
| 3 | 2024-2025都柏林高数大一下期中（Math 3-Final A） | 2025 | 下学期期中 | .pdf |

## 目录结构
```
Tus/
├── index.html              # 首页 - 科目列表（搜索+年级筛选）
├── subject-detail.html     # 科目详情页 - 试卷列表（年份/学期筛选）
├── submit.html             # 用户提交试卷页（直接上传到 GitHub）
├── upload.html             # 管理员上传试卷（引导页，已弃用）
├── create-subject.html     # 管理员新建科目（引导页，已弃用）
├── css/
│   ├── style.css           # 基础样式 / Tailwind 覆盖
│   └── announcement.css    # 公告弹窗样式（典雅风格）
├── js/
│   ├── api-client.js       # 数据 API 客户端（读取 JSON）
│   ├── index.js            # 首页逻辑（渲染科目卡片）
│   ├── subject-detail.js   # 科目详情逻辑（渲染试卷列表）
│   ├── submit.js           # 用户提交试卷逻辑（上传+创建 Issue）
│   └── announcement.js     # 公告系统（首次进入弹窗+导航入口）
├── data/
│   ├── subjects.json       # 科目数据
│   └── papers.json         # 试卷数据
├── assets/papers/          # PDF / Word 试卷文件存放目录（含 pending/ 子目录）
├── scripts/
│   ├── manage.js           # 管理脚本（终端交互式：添加/审核/部署）
│   └── deploy-via-api.js   # API 部署脚本（中国内地免翻墙上 GitHub）
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── submit-paper.yml  # 试卷提交的 Issue 模板
│   └── workflows/
│       └── deploy.yml       # GitHub Actions 部署配置（push 到 main 触发）
├── supabase-setup.sql      # (备用) Supabase 数据库初始化脚本
├── CLAUDE.md               # 本文件
└── README.md
```

## 数据模型

### subjects.json
```json
{
    "id": 1,
    "name": "高等数学",
    "grade": "大一",        // 大一/大二/大三/大四
    "teacher": "张老师",
    "description": "",
    "created_at": "2025-09-01"
}
```

### papers.json
```json
{
    "id": 1,
    "subject_id": 2,
    "title": "2024-2025都柏林高数大一下期末",
    "year": 2025,
    "semester": "下学期期末",  // 上学期期中/上学期期末/下学期期中/下学期期末
    "grade": "",
    "file_url": "",
    "file_path": "2024-2025都柏林高数大一下期末.pdf",     // assets/papers/ 下的文件名
    "file_name": "2024-2025都柏林高数大一下期末.pdf",     // 下载时的默认文件名
    "file_size": 159658,
    "uploaded_by": "热心同学",
    "download_count": 0,       // （未实现，前端已不显示）
    "created_at": "2026-06-19"
}
```

## 功能清单

| 功能 | 状态 | 说明 |
|------|------|------|
| 科目列表 + 搜索 | ✅ | 按字匹配搜索 |
| 年级筛选 | ✅ | 大一/大二/大三/大四/全部 |
| 试卷列表 + 筛选 | ✅ | 年份下拉 / 学期下拉 / 标题搜索 |
| PDF 下载 | ✅ | `download` 属性强制下载，URL 编码中文路径 |
| Word 下载 | ✅ | 支持 .doc/.docx，自动适配后缀名 |
| 用户在线提交 | ✅ | 选择文件→上传 GitHub pending 目录→创建 Issue |
| 管理员审核 | ✅ | `node scripts/manage.js` → 审核提交 |
| 公告系统 | ✅ | 首次进入弹窗 + 导航栏「公告」入口 |
| 管理终端 | ✅ | 添加科目/试卷、审核、部署、清理 pending |
| GitHub Pages 部署 | ✅ | git push 触发 Actions 自动部署 |
| API 部署（中国内地） | ✅ | 直连受阻时用 `deploy-via-api.js` |

## 常用操作

### 1. 添加内容（推荐）
```bash
cd C:\Users\Haxim\Tus
node scripts/manage.js
```
交互式菜单：列出科目 → 新建科目 → 添加试卷 → 审核提交 → 部署

### 2. 本地预览
```bash
cd C:\Users\Haxim\Tus
python -m http.server 8000
```
然后访问 http://localhost:8000

### 3. 部署到 GitHub

**方式 A — git push（国外/梯子环境）**
```bash
cd C:\Users\Haxim\Tus
git add -A
git commit -m "更新内容"
git push
```
GitHub Actions 自动部署到 Pages。

**方式 B — API 上传（中国内地，推荐）**
```bash
cd C:\Users\Haxim\Tus
node scripts/deploy-via-api.js
```
所有文件通过 GitHub API 直接上传。

### 4. 审核用户提交
```bash
cd C:\Users\Haxim\Tus
node scripts/manage.js
# 选 [4] 查看待审核提交
```

## 关于部署的重要说明

### 部署脚本 `deploy-via-api.js` 的文件列表
`FILES_TO_UPLOAD` 数组**必须手动同步**。新增文件（如新 css/js）后必须加到该数组中，否则部署时不会上传到 GitHub。

当前已注册的文件：
```
css/style.css, css/announcement.css,
js/api-client.js, js/announcement.js, js/index.js,
js/subject-detail.js, js/create-subject.js, js/submit.js,
...（完整列表见 deploy-via-api.js 第 26-45 行）
```

PDF / Word 文件自动扫描 `assets/papers/`（排除 `pending` 子目录），无需手动注册。

### 为什么 git push 失败
中国内地直连 GitHub 的 443 端口被阻断。使用 `node scripts/deploy-via-api.js` 方式部署。

## 公告系统
- **首次访问**：自动弹出典雅风格的公告遮罩（localStorage 记忆，仅一次）
- **再次查看**：点击右上角导航栏「📜 公告」
- **关闭**：只有点击「确定」按钮可关闭，点遮罩不会关闭
- **样式**：宋体衬线、暖色调、毛玻璃背景、响应式适配手机
- **当前公告内容**：2026/6/19 测试版上线通知（见 `js/announcement.js`）

## 已完成的最近改动（2026-06-19）

1. **公告系统** — 新增 `css/announcement.css` + `js/announcement.js`，首次进入弹出 / 导航栏复访
2. **Word 文件支持** — `subject-detail.js` 中 URL 编码中文路径 + 动态扩展名；`deploy-via-api.js` 自动扫描 .doc/.docx
3. **删除未实现下载次数** — 前端不再显示 `download_count` 字段

## 未来计划
- [ ] 添加 Supabase 后端支持在线提交
- [ ] 用户系统 + 积分奖励
- [ ] 积分排行榜
- [ ] 搜索功能增强
- [ ] 移动端体验优化

## 重要提醒
- 修改 HTML/JS/CSS 后需要重新部署才能生效
- PDF 和 Word 文件应放在 `assets/papers/` 目录下，部署脚本自动上传
- **新增文件必须加入 `deploy-via-api.js` 的 `FILES_TO_UPLOAD` 列表**
- GitHub 有 100MB 单个文件大小限制
- 部署后约 1-2 分钟生效（GitHub Actions 构建 + Pages 缓存刷新）
- `upload.html` 和 `create-subject.html` 是旧版引导页，已弃用但未删除