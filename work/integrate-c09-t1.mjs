import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(scriptDir,'..');
const calPath=path.join(root,'work/calibration/cambridge-09/test-1/test.json');
const pagePath=path.join(root,'data/generated/page-json/cambridge-ielts-09.pages.json');
const rawPath=path.join(root,'data/generated/text-pages/cambridge-ielts-09.raw.md');
const bankPaths=[path.join(root,'data/cambridge-test-bank.json'),path.join(root,'data/generated/reports/cambridge-test-bank.json'),path.join(root,'data/cambridge-test-bank.js')];
const intensivePaths=[1,2,3].map(n=>path.join(root,`work/calibration/cambridge-09/test-1/passage-${n}-intensive.json`));
const outputPaths=[
  path.join(root,'data/generated/intensive-reading/cambridge-07-09/Cambridge-IELTS-09-Test-01-Passage-01-William-Henry-Perkin.md'),
  path.join(root,'data/generated/intensive-reading/cambridge-07-09/Cambridge-IELTS-09-Test-01-Passage-02-Search-for-Extra-terrestrial-Intelligence.md'),
  path.join(root,'data/generated/intensive-reading/cambridge-07-09/Cambridge-IELTS-09-Test-01-Passage-03-History-of-the-Tortoise.md'),
];
const c=JSON.parse(await readFile(calPath,'utf8'));
const intensives=await Promise.all(intensivePaths.map(async p=>JSON.parse(await readFile(p,'utf8'))));
const segmenter=new Intl.Segmenter('en',{granularity:'sentence'});
const normalizeParagraph=x=>typeof x==='string'?{label:'',text:x}:x;
const prompts=g=>Object.entries(g.prompts??{}).map(([number,text])=>({number:Number(number),text}));
const options=g=>(g.options??[]).map(x=>({label:String(x.label),text:String(x.text)}));
const groupFor=n=>c.questionGroups.find(g=>prompts(g).some(q=>q.number===n));

function sentenceSource(passage){
  const result=[];
  for(const [i,raw] of passage.bodyParagraphs.entries()){
    const para=normalizeParagraph(raw); const label=para.label||(passage.passage===2&&i===0?'导语（原文无段落标签）':`第${i+1}段（原文无段落标签）`);
    for(const item of segmenter.segment(para.text)){const text=item.segment.trim();if(text)result.push({paragraph:label,text});}
  }
  return result;
}

function readingSection(passage,intensive){
  const src=sentenceSource(passage);
  assert.equal(src.length,intensive.sentences.length,`sentence count mismatch P${passage.passage}`);
  src.forEach((s,i)=>assert.equal(intensive.sentences[i].english,s.text,`source mismatch P${passage.passage} S${i+1}`));
  const structuredParagraphs=[];
  let sentenceIndex=0;
  for(const [i,raw] of passage.bodyParagraphs.entries()){
    const para=normalizeParagraph(raw); const displayLabel=para.label||(passage.passage===2&&i===0?'导语（原文无段落标签）':`第${i+1}段（原文无段落标签）`);
    const count=[...segmenter.segment(para.text)].map(x=>x.segment.trim()).filter(Boolean).length;
    structuredParagraphs.push({id:`P${i+1}`,label:para.label||null,displayLabel,text:para.text,passage:passage.passage,physicalPages:passage.bodyPages,sentenceIds:Array.from({length:count},(_,j)=>`P${passage.passage}-S${sentenceIndex+j+1}`)});
    sentenceIndex+=count;
  }
  return {
    title:`Reading Passage ${passage.passage}`,kind:'reading',pages:passage.bodyPages,
    paragraphs:passage.bodyParagraphs.map(x=>normalizeParagraph(x).text),structuredParagraphs,
    sentences:src.map((s,i)=>({id:`P${passage.passage}-S${i+1}`,paragraphId:structuredParagraphs.find(p=>p.displayLabel===s.paragraph)?.id??'',physicalPages:passage.bodyPages,text:s.text})),
    paragraphCount:structuredParagraphs.length,sentenceCount:src.length,
  };
}

function questionRecord(n){
  const g=groupFor(n); assert(g,`missing group for ${n}`); const a=c.answers[String(n)];
  const opts=options(g); const answerText=a.answerText??opts.find(x=>x.label===a.answer)?.text??a.answer;
  return {id:`R${n}`,number:n,passage:g.passage,type:g.type.replaceAll('_','-'),prompt:g.prompts[String(n)],options:opts.map(x=>x.label),optionDetails:opts,answer:a.answer,answerText,acceptedAnswers:a.acceptedAnswers,answerItems:a.answerItems,scoringNote:a.scoringNote,wordLimit:g.wordLimit??null,instructions:g.instructions,evidence:c.evidence[String(n)],evidenceLocation:c.evidenceLocations[String(n)],distractors:c.distractors[String(n)],sourcePages:[...new Set([...c.passages[g.passage-1].bodyPages,...g.pages])],answerKeyPage:c.answerKeyPage};
}

function renderMarkdown(passage,intensive){
  const lines=[`# Cambridge IELTS 9 Test 1 Reading Passage ${passage.passage}`,`## ${passage.title}`,passage.subtitle?`*${passage.subtitle}*`:'',`**中文标题：${intensive.chineseTitle}**`,intensive.intro,'','## 正文逐句精读',''];
  let lastPara=null;
  for(const s of intensive.sentences){
    const para=sentenceSource(passage)[s.number-1]?.paragraph;
    if(para&&para!==lastPara){lines.push(para.length===1?`### Paragraph ${para}`:`### ${para}`,'');lastPara=para;}
    lines.push(`### ${s.number}. ${s.english}`,'',`**中文翻译：** ${s.translation}`,'',`**句法与表达作用：** ${s.structure}`,'','**词汇与短语：**','',...s.vocabulary.map(v=>`- ${v}`),'');
  }
  lines.push('## 核心表达深挖','');
  for(const d of intensive.deepDives){
    const url=d.link??d.url; lines.push(`### A层深挖：句 ${d.sentence} — [${d.expression}](${url})`,'');
    if(d.explanation) lines.push(d.explanation,'');
    else lines.push(`**含义：** ${d.meaning}`,'',`**语法：** ${d.grammar}`,'',`**语境作用：** ${d.context}`,'',`**近义辨析：** ${d.distinctions}`,'','**双语例句：**','',...d.examples.map(x=>`- ${x}`),'');
  }
  lines.push('## 题目与选项精讲','','### 总体答题指令','',passage.instruction,'',`**总体指令翻译：** ${intensive.overallInstructionTranslation}`,'','先按题组指令完成题目；所有填空答案均须直接取自原文并严格遵守词数限制。判断题只依据文章信息，不使用常识推断。','');
  for(const g of c.questionGroups.filter(x=>x.passage===passage.passage)){
    const notes=intensive.questionGroups[g.range]; assert(notes,`missing question group notes ${g.range}`);
    lines.push(`### ${g.displayTitle}`,'','**原文题型指令：**','',...g.instructions.map(x=>`- ${x}`),'','**指令翻译：**','',...notes.instructionTranslation.map(x=>`- ${x}`),'');
    if(g.wordLimit)lines.push(`**字数限制：** ${g.wordLimit}`,'');
    if(g.example)lines.push(`**示例：** ${g.example.prompt} → ${g.example.answer}`,'');
    if(g.templateTitle)lines.push(`**流程图标题：** ${g.templateTitle}`,'',`**标题翻译：** ${notes.templateTitleTranslation}`,'');
    if(g.options?.length){lines.push('**全部选项 / 标题 / 分类标签：**','',...g.options.map(o=>`- ${o.label}. ${o.text}｜${notes.optionTranslations[o.label]??''}`),'');}
    lines.push(`**本组策略：** ${notes.strategy}`,'');if(notes.sourceNote)lines.push(`**原书内部标记说明：** ${notes.sourceNote}`,'');
    for(const q of prompts(g)){
      const a=c.answers[String(q.number)],qn=intensive.questions[String(q.number)]; assert(qn,`missing notes Q${q.number}`);
      lines.push(`#### ${q.number}. ${q.text}`,'',`**题干翻译：** ${qn.translation}`,'',`**官方答案：** ${a.answer}`,'',`**可接受答案：** ${a.acceptedAnswers.join('；')}`,'');
      if(a.scoringNote)lines.push(`**计分说明：** ${a.scoringNote}`,'');
      if(g.wordLimit)lines.push(`**本题字数限制：** ${g.wordLimit}`,'');
      lines.push(`**原文证据：** ${c.evidence[String(q.number)]}`,'',`**定位：** ${c.evidenceLocations[String(q.number)]}`,'',`**定位逻辑：** ${qn.logic}`,'',`**干扰项排除：** ${qn.distractor} ${c.distractors[String(q.number)]}`,'');
    }
  }
  return lines.filter((x,i,a)=>!(x===''&&a[i-1]==='')).join('\n').trim()+'\n';
}

const pageDoc=JSON.parse(await readFile(pagePath,'utf8'));
for(const [page,text] of Object.entries(c.pages)){const item=pageDoc.pages.find(x=>x.page===Number(page));assert(item,`missing page ${page}`);if(!item.calibration?.reason)item.text=text;}
const answerPage=pageDoc.pages.find(x=>x.page===c.answerKeyPage);assert(answerPage,'missing answer page');if(!answerPage.calibration?.reason)answerPage.text=c.answerKeyText;
await writeFile(pagePath,JSON.stringify(pageDoc,null,2)+'\n');

let raw=await readFile(rawPath,'utf8');
for(const page of [...Object.keys(c.pages).map(Number),c.answerKeyPage].sort((a,b)=>a-b)){
  const text=pageDoc.pages.find(item=>item.page===page).text;
  const re=new RegExp(`(## Page ${page}\\r?\\n\\r?\\n)[\\s\\S]*?(?=\\r?\\n+## Page [0-9]+\\r?\\n|$)`);
  assert(re.test(raw),`raw page block missing ${page}`);raw=raw.replace(re,`$1${text}`);
}
await writeFile(rawPath,raw.replaceAll('\r\n','\n'));

for(let i=0;i<3;i++)await writeFile(outputPaths[i],renderMarkdown(c.passages[i],intensives[i]));

let bank;
try{bank=JSON.parse(await readFile(bankPaths[0],'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;console.log('Shared bank absent: source and intensive files generated; bank integration skipped.');process.exit(0);}
const idx=bank.tests.findIndex(t=>t.id===c.testId);assert(idx>=0,'target bank test missing');
const old=bank.tests[idx];
bank.tests[idx]={...old,source:'original PDF visual inspection',draftStatus:'manually_calibrated',parseConfidence:1,answerKeyText:c.answerKeyText,answerKeyPages:[c.answerKeyPage],mode:'reading',id:c.testId,title:'Cambridge IELTS 9 Reading Test 1',durationSec:3600,passageTitle:c.passages.map(x=>x.title).join(' / '),passage:c.passages.map(x=>x.bodyParagraphs.map(y=>normalizeParagraph(y).text).join('\n\n')).join('\n\n'),rawOcrText:c.sourcePages.map(n=>c.pages[String(n)]).join('\n\n'),readingSections:c.passages.map((x,i)=>readingSection(x,intensives[i])),calibratedPassages:c.passages,questions:Array.from({length:40},(_,i)=>questionRecord(i+1)),sourcePages:c.sourcePages,semanticImagesRequired:false,images:[],calibration:{status:'manually_calibrated',source:'original PDF visual inspection',date:c.calibrationDate,answerKeyPage:c.answerKeyPage}};
const json=JSON.stringify(bank,null,2)+'\n';
await writeFile(bankPaths[0],json);await writeFile(bankPaths[1],json);await writeFile(bankPaths[2],`window.CAMBRIDGE_TEST_BANK = ${JSON.stringify(bank,null,2)};\n`);
console.log('Integrated Cambridge IELTS 9 Test 1: 3 reading sections, 40 questions, 3 intensive-reading files.');
