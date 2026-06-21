"use client";

import { useState, useRef } from "react";

const encouragements = [
  "太棒了！继续保持！",
  "完美！你的拼写能力真强！",
  "做得好！继续前进！",
  "精彩！你的英语水平很高！",
  "优秀！继续保持这个势头！",
];

const wordTranslations: Record<string, string> = {
  about: "关于", above: "在...上面", accept: "接受", access: "访问",
  account: "账户", achieve: "实现", active: "活跃", activity: "活动",
  address: "地址", admit: "承认", adopt: "采用", advance: "前进",
  advantage: "优势", advice: "建议", affect: "影响", afford: "负担得起",
  agree: "同意", allow: "允许", almost: "几乎", alone: "独自",
  already: "已经", although: "虽然", among: "在...之中", amount: "数量",
  analyze: "分析", announce: "宣布", annual: "年度", answer: "回答",
  anyone: "任何人", appear: "出现", apply: "申请", approach: "方法",
  argue: "争论", around: "围绕", arrange: "安排", article: "文章",
  attempt: "尝试", attention: "注意", attitude: "态度", attract: "吸引",
  audience: "观众", authority: "权威", available: "可用", average: "平均",
  avoid: "避免", balance: "平衡", base: "基础", basic: "基本",
  become: "成为", before: "之前", begin: "开始", believe: "相信",
  benefit: "好处", beyond: "超越", billion: "十亿", birth: "出生",
  board: "董事会", break: "打破", brief: "简短", broad: "广泛",
  budget: "预算", build: "建造", business: "商业", campaign: "运动",
  capital: "首都", capture: "捕获", careful: "小心", carry: "携带",
  catch: "抓住", category: "类别", cause: "原因", center: "中心",
  central: "中心", century: "世纪", certain: "确定", challenge: "挑战",
  champion: "冠军", chance: "机会", change: "改变", channel: "频道",
  chapter: "章节", character: "角色", charge: "收费", check: "检查",
  choice: "选择", choose: "选择", citizen: "公民", claim: "声称",
  class: "班级", clear: "清晰", close: "关闭", coach: "教练",
  collect: "收集", college: "大学", combine: "结合", command: "命令",
  comment: "评论", common: "常见", community: "社区", company: "公司",
  compare: "比较", compete: "竞争", complex: "复杂", computer: "电脑",
  concern: "关心", condition: "条件", conduct: "进行", conference: "会议",
  confirm: "确认", conflict: "冲突", connect: "连接", consider: "考虑",
  consumer: "消费者", contain: "包含", content: "内容", context: "背景",
  continue: "继续", contract: "合同", contribute: "贡献", control: "控制",
  convince: "使信服", country: "国家", couple: "夫妇", course: "课程",
  create: "创造", credit: "信用", crime: "犯罪", culture: "文化",
  current: "当前", customer: "客户", dark: "黑暗", data: "数据",
  deal: "交易", debate: "辩论", decade: "十年", decide: "决定",
  decision: "决定", deep: "深", defense: "防御", degree: "程度",
  deliver: "交付", demand: "需求", depend: "依赖", describe: "描述",
  design: "设计", despite: "尽管", detail: "细节", determine: "决定",
  develop: "发展", difference: "不同", different: "不同", difficult: "困难",
  dinner: "晚餐", direction: "方向", director: "导演", discover: "发现",
  discuss: "讨论", disease: "疾病", doctor: "医生", document: "文件",
  domestic: "国内", door: "门", draw: "画", dream: "梦想",
  drive: "驾驶", drop: "掉落", drug: "药物", during: "在...期间",
  each: "每个", early: "早", economic: "经济", economy: "经济",
  edge: "边缘", editor: "编辑", education: "教育", effect: "效果",
  effective: "有效", effort: "努力", eight: "八", election: "选举",
  employee: "员工", energy: "能量", enjoy: "享受", enough: "足够",
  enter: "进入", entire: "整个", environment: "环境", especially: "特别",
  establish: "建立", even: "甚至", event: "事件", every: "每个",
  evidence: "证据", example: "例子", exist: "存在", expect: "期望",
  experience: "经验", expert: "专家", explain: "解释", factor: "因素",
  fail: "失败", fall: "落下", family: "家庭", famous: "著名",
  far: "远", father: "父亲", feel: "感觉", field: "领域",
  fight: "战斗", figure: "人物", fill: "填满", film: "电影",
  final: "最终", finally: "终于", financial: "金融", find: "找到",
  fine: "好的", finger: "手指", finish: "完成", fire: "火",
  first: "第一", floor: "地板", fly: "飞", focus: "焦点",
  follow: "跟随", food: "食物", foot: "脚", force: "力量",
  foreign: "外国", forget: "忘记", form: "形式", former: "以前",
  forward: "向前", free: "自由", friend: "朋友", front: "前面",
  full: "满", fund: "基金", future: "未来", game: "游戏",
  garden: "花园", general: "一般", generation: "一代", girl: "女孩",
  goal: "目标", government: "政府", great: "伟大", ground: "地面",
  group: "群组", grow: "成长", growth: "增长", guess: "猜测",
  hair: "头发", half: "一半", hand: "手", happen: "发生",
  happy: "快乐", hard: "硬", head: "头", health: "健康",
  hear: "听到", heart: "心", heat: "热", heavy: "重",
  help: "帮助", high: "高", hit: "打", hold: "握住",
  home: "家", hope: "希望", horse: "马", hospital: "医院",
  hot: "热", hotel: "酒店", hour: "小时", house: "房子",
  how: "如何", however: "然而", huge: "巨大", human: "人类",
  hundred: "百", husband: "丈夫", idea: "主意", identify: "识别",
  image: "图像", imagine: "想象", impact: "影响", implement: "实施",
  important: "重要", improve: "改善", include: "包括", increase: "增加",
  indicate: "表明", individual: "个人", industry: "工业", initial: "初始",
  inside: "里面", instead: "代替", interest: "兴趣", interview: "面试",
  involve: "涉及", issue: "问题", item: "项目", join: "加入",
  joint: "联合", judge: "判断", jump: "跳跃", just: "只是",
  justice: "正义", keep: "保持", key: "关键", kid: "孩子",
  kill: "杀", kind: "种类", king: "国王", kitchen: "厨房",
  knee: "膝盖", knife: "刀", know: "知道", knowledge: "知识",
  land: "土地", language: "语言", large: "大", later: "后来",
  laugh: "笑", law: "法律", lawyer: "律师", lead: "领导",
  leader: "领导", learn: "学习", least: "至少", leave: "离开",
  left: "左", leg: "腿", legal: "法律", less: "少",
  letter: "信", level: "水平", life: "生活", light: "光",
  like: "喜欢", likely: "可能", line: "线", list: "列表",
  listen: "听", little: "小", live: "生活", local: "本地",
  long: "长", look: "看", lose: "失去", loss: "损失",
  lot: "很多", love: "爱", low: "低", machine: "机器",
  magazine: "杂志", main: "主要", maintain: "维持", major: "主要",
  majority: "多数", manage: "管理", manager: "经理", many: "许多",
  market: "市场", marriage: "婚姻", material: "材料", matter: "事情",
  maybe: "也许", mean: "意味着", measure: "测量", media: "媒体",
  medical: "医疗", meet: "见面", meeting: "会议", member: "成员",
  memory: "记忆", mention: "提到", message: "消息", method: "方法",
  middle: "中间", might: "可能", military: "军事", million: "百万",
  mind: "头脑", minute: "分钟", miss: "错过", mission: "任务",
  model: "模型", modern: "现代", moment: "时刻",   money: "钱",
  month: "月", more: "更多", morning: "早上", most: "最",
  mother: "母亲", mouth: "嘴", move: "移动", movement: "运动",
  movie: "电影", much: "很多", music: "音乐", must: "必须",
  name: "名字", nation: "国家", national: "国家", natural: "自然",
  nature: "自然", near: "近", nearly: "几乎", necessary: "必要",
  need: "需", network: "网络", never: "从不", new: "新",
  news: "新闻", next: "下一个", nice: "好", night: "夜晚",
  nobody: "没有人", north: "北", note: "笔记", nothing: "没有什么",
  notice: "注意", now: "现在", number: "数字", occur: "发生",
  offer: "提供", office: "办公", officer: "官员", official: "官方",
  often: "经常", old: "老", once: "一次", one: "一",
  only: "只有", open: "打开", operation: "操作", opportunity: "机会",
  option: "选择", order: "顺序", organization: "组织", others: "其他",
  out: "外", outside: "外面", over: "在...上面", own: "自己",
  owner: "所有者", page: "页面", pain: "疼痛", pair: "一对",
  paper: "纸", parent: "父母", part: "部分", particular: "特定",
  partner: "伙伴", party: "聚会", pass: "通过", past: "过去",
  path: "路径", patient: "病人", pattern: "模式", pay: "支付",
  peace: "和平", people: "人们", per: "每", perform: "执行",
  performance: "表现", perhaps: "也许", period: "时期", person: "人",
  personal: "个人", phone: "电话", physical: "物理", pick: "选择",
  picture: "图片", piece: "片", place: "地方", plan: "计划",
  plant: "植物", play: "玩", player: "玩家", please: "请",
  point: "点", police: "警察", policy: "政策", political: "政治",
  poor: "贫穷", popular: "流行", population: "人口", position: "位置",
  positive: "积极", possible: "可能", power: "力量", practice: "实践",
  prepare: "准备", present: "现在", president: "总统", pressure: "压力",
  prevent: "防止", private: "私有", probably: "可能", problem: "问题",
  process: "过程", produce: "生产", product: "产品", production: "生产",
  professional: "专业", program: "程序", project: "项目", property: "财产",
  protect: "保护", prove: "证明", provide: "提供", public: "公共",
  pull: "拉", purpose: "目的", push: "推", quality: "质量",
  question: "问题", quickly: "快", quite: "相当", race: "比赛",
  raise: "提高", range: "范围", rate: "率", rather: "相当",
  reach: "到达", read: "读", ready: "准备", real: "真实",
  reality: "现实", realize: "意识到", really: "真的", reason: "原因",
  receive: "接收", recent: "最近", recognize: "认识", record: "记录",
  reduce: "减少", reflect: "反映", region: "地区", relate: "相关",
  relationship: "关系", remain: "保持", remember: "记住", remove: "删除",
  report: "报告", represent: "代表", require: "要求", research: "研究",
  resource: "资源", respond: "回应", response: "回应", rest: "休息",
  result: "结果", return: "返回", reveal: "揭示", rich: "丰富",
  right: "右", rise: "上升", risk: "风险", road: "路",
  rock: "岩石", role: "角色", room: "房间", rule: "规则",
  run: "跑", safe: "安全", save: "保存", say: "说",
  scene: "场景", school: "学校", science: "科学", scientist: "科学家",
  score: "分数", sea: "海", season: "季节", seat: "座位",
  second: "第二", section: "部分", security: "安全", seek: "寻求",
  seem: "似乎", sell: "卖", send: "发", senior: "高级",
  sense: "感觉", serious: "严重", serve: "服务", service: "服务",
  set: "设置", seven: "七", several: "几个", share: "分享",
  shoot: "射击", short: "短", shot: "射击", should: "应该",
  shoulder: "肩膀", show: "显示", side: "边", sign: "标志",
  significant: "重要", similar: "相似", simple: "简单", simply: "简单地",
  since: "自从", sing: "唱", single: "单", sister: "姐妹",
  sit: "坐", site: "地点", situation: "情况", six: "六",
  size: "大小", skill: "技能", skin: "皮肤", small: "小",
  smile: "微笑", social: "社会", society: "社会", soldier: "士兵",
  some: "一些", somebody: "某人", someone: "某人", something: "某事",
  sometimes: "有时", son: "儿子", song: "歌", soon: "很快",
  sort: "排序", source: "来源", south: "南", space: "空间",
  speak: "说", special: "特别", specific: "具体", speech: "演讲",
  spend: "花费", sport: "运动", spring: "春天", staff: "员工",
  stage: "阶段", stand: "站", standard: "标准", star: "星",
  start: "开", state: "状态", statement: "声明", station: "车站",
  stay: "停留", step: "步骤", still: "仍然", stop: "停止",
  story: "故事", strategy: "策略", street: "街道", strong: "强",
  structure: "结构", student: "学生", study: "学习", stuff: "东西",
  style: "风格", subject: "主题", success: "成功", such: "这样",
  suddenly: "突然", suffer: "遭受", suggest: "建议", summer: "夏天",
  support: "支持", sure: "确定", surface: "表面", system: "系统",
  table: "桌子", take: "拿", talk: "说", task: "任务",
  tax: "税", teach: "教", teacher: "老师", team: "团队",
  technology: "技术", tell: "告诉", ten: "十", tend: "倾向",
  term: "术语", test: "测试",   than: "比", thank: "谢谢",
  that: "那个", their: "他们的", them: "他们", then: "然后",
  there: "那里", these: "这些", they: "他们", thing: "东西",
  think: "想", third: "第三", this: "这个", those: "那些",
  though: "虽然", thought: "想法",   thousand: "千", threat: "威胁",
  three: "三", through: "通过", throughout: "贯穿", throw: "扔",
  thus: "因此", time: "时间", today: "今天", together: "一起",
  tonight: "今晚", too: "也", total: "总计", tough: "困难",
  toward: "朝向", town: "城镇", trade: "贸易", traditional: "传统",
  training: "训练", travel: "旅行", treat: "对待", treatment: "治疗",
  tree: "树", trial: "审判", trip: "旅行", trouble: "麻烦",
  true: "真的", truth: "真相", try: "尝试", turn: "转",
  two: "二", type: "类型", under: "在...下面", understand: "理解",
  unit: "单位", until: "直到", up: "上", upon: "在...上",
  use: "使用", usually: "通常", value: "价值", various: "各种",
  very: "非常", view: "观点", visit: "访问", voice: "声音",
  vote: "投票", wait: "等待", walk: "走", wall: "墙",
  want: "想要", war: "战争", watch: "看", water: "水",
  way: "方式", weapon: "武器", wear: "穿", week: "周",
  weight: "重量", well: "好", west: "西", what: "什么",
  when: "当", where: "哪里", whether: "是否", which: "哪个",
  while: "当", white: "白", who: "谁", whole: "整个",
  whose: "谁的", why: "为什么", wide: "宽", wife: "妻子",
  will: "会", win: "赢", wind: "风", window: "窗户",
  winter: "冬天", wish: "希望", with: "和", within: "在...之内",
  without: "没有", woman: "女人", wonder: "奇迹", word: "词",
  work: "工作", worker: "工人", world: "世界", worry: "担心",
  would: "会", write: "写", wrong: "错", yard: "院子",
  year: "年", yes: "是", yet: "还", you: "你",
  young: "年轻", your: "你的", yourself: "你自己", youth: "青年",
};

function getRandomEncouragement() {
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

export default function SpellingBeePage() {
  const [screen, setScreen] = useState<"start" | "game" | "result">("start");
  const [level, setLevel] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; type: "correct" | "incorrect" | "" }>({ text: "", type: "" });
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [hintUsed, setHintUsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState("");
  const [currentPhonetic, setCurrentPhonetic] = useState("");
  const [elapsedTime, setElapsedTime] = useState("00:00");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const maxMistakes = 1;
  const wordsPerLevel = 5;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);

  const loadWordInfo = async (word: string) => {
    setCurrentTranslation(wordTranslations[word.toLowerCase()] || "请拼写以下单词");
    setCurrentPhonetic("");
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (response.ok) {
        const data = await response.json();
        if (data[0]) {
          if (data[0].phonetic) {
            setCurrentPhonetic(data[0].phonetic);
          } else if (data[0].phonetics) {
            const phonetic = data[0].phonetics.find((p: { text?: string }) => p.text);
            if (phonetic) setCurrentPhonetic(phonetic.text);
          }
        }
      }
    } catch {
      // ignore API errors
    }
  };

  const initInputs = (length: number) => {
    setInputValues(new Array(length).fill(""));
    inputRefs.current = new Array(length).fill(null);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const loadWordsForLevel = async (lvl: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/words?level=${lvl}&count=${wordsPerLevel}`);
      const words = await response.json();
      setCurrentWords(words);
      setCurrentWordIndex(0);
      setMistakes(0);
      setHintUsed(0);
      setFeedback({ text: "", type: "" });
      setShowPhonetic(false);
      loadWordInfo(words[0]);
      initInputs(words[0].length);
    } catch (error) {
      console.error("Failed to load words:", error);
      setFeedback({ text: "加载单词失败，请重试", type: "incorrect" });
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = async () => {
    setScreen("game");
    setLevel(1);
    setCurrentWordIndex(0);
    setMistakes(0);
    setTotalCorrect(0);
    // eslint-disable-next-line react-hooks/purity
    startTimeRef.current = Date.now();
    setElapsedTime("00:00");
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setElapsedTime(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);
    
    await loadWordsForLevel(1);
  };

  const handleInput = (index: number, value: string) => {
    if (!/^[a-zA-Z]?$/.test(value)) return;
    const newValues = [...inputValues];
    newValues[index] = value.toLowerCase();
    setInputValues(newValues);
    if (value && index < inputValues.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !inputValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      submitAnswer();
    }
  };

  const showHint = () => {
    if (!currentWords[currentWordIndex] || hintUsed >= 2) return;
    const word = currentWords[currentWordIndex].toLowerCase();
    const newValues = [...inputValues];

    if (hintUsed === 0) {
      newValues[0] = word[0];
      setInputValues(newValues);
      if (inputRefs.current[0]) {
        inputRefs.current[0].value = word[0];
      }
      inputRefs.current[1]?.focus();
    } else if (hintUsed === 1) {
      const lastIndex = word.length - 1;
      newValues[lastIndex] = word[lastIndex];
      setInputValues(newValues);
      if (inputRefs.current[lastIndex]) {
        inputRefs.current[lastIndex].value = word[lastIndex];
      }
    }
    setHintUsed(hintUsed + 1);
  };

  const submitAnswer = async () => {
    if (isSubmitting || !currentWords[currentWordIndex]) return;
    setIsSubmitting(true);

    const userAnswer = inputValues.join("").toLowerCase();
    const correctAnswer = currentWords[currentWordIndex].toLowerCase();

    if (userAnswer.length < correctAnswer.length) {
      setFeedback({ text: "请完成所有字母的输入", type: "incorrect" });
      setIsSubmitting(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (userAnswer === correctAnswer) {
      setFeedback({ text: getRandomEncouragement(), type: "correct" });
      setShowPhonetic(true);
      setTotalCorrect((prev) => prev + 1);

      setTimeout(() => {
        if (currentWordIndex < wordsPerLevel - 1) {
          const nextIndex = currentWordIndex + 1;
          setCurrentWordIndex(nextIndex);
          loadWordInfo(currentWords[nextIndex]);
          initInputs(currentWords[nextIndex].length);
          setFeedback({ text: "", type: "" });
          setShowPhonetic(false);
        } else {
          if (level < 5) {
            const nextLevel = level + 1;
            setLevel(nextLevel);
            loadWordsForLevel(nextLevel);
          } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setScreen("result");
          }
        }
      }, 1500);
    } else {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setFeedback({ text: `答错了！正确答案是：${correctAnswer}`, type: "incorrect" });
      setShowPhonetic(true);

      setTimeout(() => {
        if (newMistakes > maxMistakes) {
          if (timerRef.current) clearInterval(timerRef.current);
          setScreen("result");
        } else {
          if (currentWordIndex < wordsPerLevel - 1) {
            const nextIndex = currentWordIndex + 1;
            setCurrentWordIndex(nextIndex);
            loadWordInfo(currentWords[nextIndex]);
            initInputs(currentWords[nextIndex].length);
            setFeedback({ text: "", type: "" });
            setShowPhonetic(false);
          } else {
            if (level < 5) {
              const nextLevel = level + 1;
              setLevel(nextLevel);
              loadWordsForLevel(nextLevel);
            } else {
              if (timerRef.current) clearInterval(timerRef.current);
              setScreen("result");
            }
          }
        }
      }, 2000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {screen === "start" && (
        <div className="text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🐝</div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              单词拼写挑战
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              测试你的英语拼写能力，挑5个等级！
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">游戏规则</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>① 共有5个等级，难度逐级提升</li>
              <li>② 每个级别需要完成5个单词</li>
              <li>③ 每个级别最多允许1个错误</li>
              <li>④ 根据中文释义拼写英文单词</li>
              <li>⑤ 可以使用提示功能显示首字母和末字母</li>
              <li>⑥ 单词库包含5000+个单词</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-3 text-lg font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            开始挑战          </button>
        </div>
      )}

      {screen === "game" && (
        <div>
          <div className="flex justify-between items-center mb-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-sm font-medium">
                第{level} 关              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                单词 {currentWordIndex + 1}/{wordsPerLevel}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{elapsedTime}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: maxMistakes + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < mistakes ? "bg-red-500" : "bg-zinc-200 dark:bg-zinc-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-100 mx-auto mb-4"></div>
              <p className="text-zinc-600 dark:text-zinc-400">加载中...</p>
            </div>
          ) : currentWords[currentWordIndex] ? (
            <div className="text-center mb-8">
              <div className="inline-block px-6 py-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-500 mb-6">
                <p className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                  {currentTranslation}
                </p>
              </div>

              <div className="flex justify-center gap-2 mb-6 min-h-[60px]">
                {inputValues.map((value, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleInput(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 text-2xl font-bold text-center border-2 rounded-lg transition-all ${
                      feedback.type === "correct"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600"
                        : feedback.type === "incorrect" && value
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600"
                        : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
                    disabled={feedback.type === "correct"}
                  />
                ))}
              </div>

              {showPhonetic && currentPhonetic && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  音标：{currentPhonetic}
                </p>
              )}

              {feedback.text && (
                <div
                  className={`p-4 rounded-lg mb-6 ${
                    feedback.type === "correct"
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={showHint}
                  disabled={hintUsed >= 2}
                  className="px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {hintUsed === 0 ? "显示首字母" : hintUsed === 1 ? "显示末字母" : "已用完"}
                </button>
                <button
                  onClick={submitAnswer}
                  disabled={isSubmitting || feedback.type === "correct"}
                  className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "提交中..." : "提交答案"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {screen === "result" && (
        <div className="text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">{mistakes <= maxMistakes ? "🏆" : "😢"}</div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              {mistakes <= maxMistakes ? "挑战成功！" : "挑战失败"}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              {mistakes <= maxMistakes ? "恭喜你完成了所有挑战！" : "下次继续努力！"}
            </p>
          </div>

          <div className="inline-block p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl mb-8">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{level}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">最终等级</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalCorrect}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">正确单词</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{elapsedTime}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">用时</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={startGame}
              className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              再来一局
            </button>
            <button
              onClick={() => setScreen("start")}
              className="px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
