# Perspective Outline Griller

视角提纲盘问器是一个 Codex Skill：当用户说 `盘问我`，它会调用一个人物视角 Skill，围绕文章、汇报、PPT、演讲或会议提纲做一问一答的主线盘问。

## 一键安装

当前仓库可以直接通过 GitHub + npx 安装，不需要先 clone：

```sh
npx -y github:Hermess/perspective-outline-griller
```

默认安装到：

```text
~/.codex/skills/perspective-outline-griller/
```

安装后包含：

- `SKILL.md`
- `ADAPTER-FORMAT.md`
- `OUTLINE-FORMAT.md`
- `TEST-SCENARIOS.md`

## 指定安装位置

安装到某个 skills 根目录下：

```sh
npx -y github:Hermess/perspective-outline-griller -- --target ~/.codex/skills
```

安装到精确目录：

```sh
npx -y github:Hermess/perspective-outline-griller -- --dest ./perspective-outline-griller
```

只查看会复制哪些文件：

```sh
npx -y github:Hermess/perspective-outline-griller -- --dry-run
```

如果后续发布到 npm registry，也可以使用：

```sh
npx -y perspective-outline-griller
```

## 使用方式

在 Codex 中说：

```text
盘问我，我想用芒格视角整理一篇关于 AI 工作流改革的文章提纲
```

这个 Skill 是壳，不是魂。它负责盘问协议、提纲状态、停止条件和输出格式；人物视角来自已经安装的女娲蒸馏类 Skill。
