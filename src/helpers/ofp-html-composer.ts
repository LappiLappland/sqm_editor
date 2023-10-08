import { imageOFPValue } from "../components/richEditor/imageOFPclass";
import { getStorage, storageGetValue } from "../storage/storage";

type attributeType = {name: string, value: string};

function embedText(text: string, tag: string, attributes: attributeType[] = [], newLined = false) {
  let opening = '<'+tag.toLowerCase();

  for (const attr of attributes) {
    opening = opening + ` ${attr.name}="${attr.value}"`
  }

  opening = opening + '>';
  
  const closing = '</'+tag+'>';
  if (newLined) {
    return opening+'\n'+text+'\n'+closing
  } else {
    return opening+text+closing
  }
  ;
}

function createComment(comment: string) {
  const longArrow = '<!----'+'-'.repeat(comment.length+2)+'---->'
  const commentEmbed = `${longArrow}\n<!---- ${comment} ---->\n${longArrow}\n`;
  return commentEmbed;
}

function splitLongStrings(text: string, breakLimit: number) {
  let lines = text.split('\n');
  let err = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    err++; if (err > 250) return 'ERROOOOOR'

    if (line.length > breakLimit) {
      const words = line.split(' ');
      let curLen = 0;
      for (let j = 0; j < words.length; j++) {
        const word = words[j];
        
        err++; if (err > 250) return 'ERROOOOOR'
        if (word.length + curLen > 66) {
          const start = words.slice(0, j+1);
          const end = words.slice(j+1);
          lines.splice(i, 1, start.join(' ')+'', end.join(' '))
          break;
        } else {
          curLen += word.length;
        }
      }
    }
  }
  return lines.join('\n');
}

type lineTypes = 'br' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type lineAligns = 'left' | 'center' | 'right';

interface lineInformation {
  text: string,
  type: lineTypes,
  align: lineAligns,
}

function convertQuillDeltaToLines(delta: any) {
  const ops = delta.content.ops;
  if (!ops) return [];
  //console.log(ops);
  
  const lines: lineInformation[] = [];
  let previousWasLineStyle = false;
  let previousWasEmbed = false;

  for (let i = 0; i < ops.length; i++) {
    const insert = ops[i].insert as string | {imageOFP: imageOFPValue};
    const attrbts = ops[i].attributes as {header?: number, align?: lineAligns, pageLink?: string, markerLink?: string} | undefined;

    if (typeof insert === 'string') {
      //if (insert !== '\n') {
      if (!/^\n+$/.test(insert)) {
        const split: lineInformation[] = insert.split('\n').map(str => {
          return {
            text: str ? str : '\n',
            type: str ? 'p' : 'br',
            align: 'left',
          }
        });

        if (split.length > 1 && previousWasEmbed) {
          const lastLine = lines[lines.length-1];
          lastLine.text += split[0].text;
          lines.push(...split.slice(1));
          previousWasEmbed = false;
          previousWasLineStyle = false;
        }
        else if (split.length > 1) {
          lines.push(...split);
        }
        else {
          let lastLine = lines[lines.length-1];
          if (!lastLine) {
            lines[0] = {
              text: '',
              type: 'p',
              align: 'left',
            }
            lastLine = lines[0];
          }
          let textEmbed = split[0].text;
          if (attrbts?.pageLink) {
            let link = attrbts.pageLink;
            if (link === '#main') link = '#Plan';
            if (link === '#notes') link = '#Main';
            textEmbed = embedText(textEmbed, 'a', [{name: 'href', value: link}])
          }
          if (attrbts?.markerLink) {
            textEmbed = embedText(textEmbed, 'a', [{name: 'href', value: attrbts.markerLink}])
          }
          if (!previousWasLineStyle) {
            //console.log('embed =>', textEmbed);
            lastLine.text = lastLine.text + textEmbed;
          } else {
            lines.push({text: textEmbed, type: 'p', align: 'left'});
          }
          previousWasLineStyle = false;
          previousWasEmbed = true;
        }
      } else {
        let lastLine = lines[lines.length-1];
        if (!lastLine) {
          lines[0] = {text: '\n', type: 'p', align: 'left'};
          lastLine = lines[0];
        };
        if (!attrbts) continue; //Impossible
        if (attrbts.header) lastLine.type = 'h'+attrbts.header as lineTypes;
        if (attrbts.align) lastLine.align = attrbts.align;
        previousWasLineStyle = true;
        previousWasEmbed = false;
        if (i === ops.length - 1) {
          const breaks: lineInformation[] = insert.slice(1).split('\n').map(str => {
            return {
              text: '\n',
              type: 'br',
              align: 'left',
            }
          });
          lines.push(...breaks.slice(1));
        }
      }
    } else {
      const img = insert.imageOFP;
      const embedImg = embedText('', 'img', [
        {
          name: 'src',
          value: img.src,
        },
        {
          name: 'height',
          value: img.height+'',
        },
        {
          name: 'width',
          value: img.width+'',
        },
      ])
      const lastLine = lines[lines.length-1];
      if (lastLine) {
        lastLine.text = lastLine.text + embedImg;
      } else {
        lines[0] = {text: embedImg, type: 'p', align: 'left'};
      }
      previousWasEmbed = true;
    }
    
  }

  //const lines2 = JSON.parse(JSON.stringify(lines));
  //console.log('LINES->', lines2);


  return lines;
}

function joinIdenticalLines(lines: lineInformation[]) {

  if (!lines[0]) return [];

  const cmpLines = (l1: lineInformation, l2: lineInformation) => {return l1.align === l2.align && l1.type === l2.type};
  const joinedLines: lineInformation[] = [lines[0]];


  for (let i = 1; i < lines.length; i++) {
    const curLine = lines[i];
    const lastJoinedLine = joinedLines[joinedLines.length - 1];
    if (!curLine.text) {
      continue; //Skip empty lines. Should be impossible
    }
    else if (i === lines.length - 1 && curLine.type === 'br') {
      continue; //Last line break is always fake
    }
    else if (curLine.type === 'br' || cmpLines(curLine, lastJoinedLine)) {
      const addStr = curLine.text !== '\n' ? '\n' + curLine.text : '\n';
      const joinedText = lastJoinedLine.text + addStr;
      lastJoinedLine.text = joinedText;
    } 
    else {
      joinedLines.push(curLine);
    }
  }

  //console.log('joined->',joinedLines);

  return joinedLines;
}

function convertQuillDeltaToString(delta: any) {
  const lines = convertQuillDeltaToLines(delta);
  const joinedLines = joinIdenticalLines(lines);

  let str = '';
  joinedLines.forEach(line => {
    const textWithBR = line.text.replaceAll('\n','<br>\n');
    const textShorter = splitLongStrings(textWithBR, 40);
    const attributes = line.align !== 'left' ? [{name: 'align', value: line.align}] : [];
    const embed = embedText(textShorter, line.type, attributes, true);
    str += embed + '\n';
  })

  return str;
}

function isDeltaEmpty(delta: any) {
  return !delta.content.ops || delta.content.ops[0].insert === '\n';
}

function createSection(name: string, delta: any, comment: string = '') {
  const rawText = convertQuillDeltaToString(delta);
  let cleanText = rawText;
  // for (const tag of TAGS_TO_BREAK_LINE) {
  //   cleanText = cleanText.replaceAll(`<${tag}>`, `<${tag}>\n`).replaceAll(`</${tag}>`, `\n</${tag}>\n`)
  // }
  //cleanText = cleanText.replaceAll('<', '\n<').replaceAll('>', '>\n');
  //cleanText = cleanText.replaceAll('<br>', '<br>\n');

  //cleanText = splitLongStrings(cleanText, 40);

  const commentStart = comment ? createComment(comment) : '';
  const start = `<p><a name="${name}"></a></p>\n`;
  const end = `<hr>\n`;
  const commentEnd = comment ? createComment('End of '+comment) : '';

  return commentStart+start+cleanText+end+commentEnd;
}

const brief = getStorage().briefing;
const ENDINGS_KEYS: (keyof typeof brief.main)[] = ['end1','end2','end3','end4','end5','end6']

export function composeBriefing() {
  const main = createSection('Plan', brief.main.main, 'Mission plan'); //Plan always exists

  let mainSides = [];
  if (brief.memory.showSideSpecific) {
    if (!isDeltaEmpty(brief.side.mainWest)) {
      mainSides.push(createSection('Plan.west', brief.side.mainWest, 'West Side Plan'))
    }
    if (!isDeltaEmpty(brief.side.mainEast)) {
      mainSides.push(createSection('Plan.east', brief.side.mainEast, 'East Side Plan'))
    }
    if (!isDeltaEmpty(brief.side.mainRes)) {
      mainSides.push(createSection('Plan.resistance', brief.side.mainRes, 'Resistance Side Plan'))
    }
    if (!isDeltaEmpty(brief.side.mainCiv)) {
      mainSides.push(createSection('Plan.civilian', brief.side.mainCiv, 'Civilian Side Plan'))
    }
  }

  const notes = !isDeltaEmpty(brief.main.notes) ? createSection('Main', brief.main.notes, 'Notes') : '';
  const endings = ENDINGS_KEYS.map(end => {
    const delta = brief.main[end];
    return !isDeltaEmpty(delta) ? createSection("Debriefing:End"+end[3], delta, 'Ending '+end[3]) : '';
  }).filter(e => e);

  const objectivesCommentStart = `<!-------------------------------->\n<!---- Mission Objectives ---->\n<!-------------------------------->\n`;
  const objectivesCommentEnd = `<!-------------------------------->\n<!---- End of Mission Objectives ---->\n<!-------------------------------->\n`;
  const objectives = brief.objectives.length > 0 ? objectivesCommentStart + brief.objectives.map(obj => createSection('OBJ_'+obj.id, obj, '')).join('\n') + objectivesCommentEnd : '';

  const extraSections = Object.entries(brief.extra).map((section) => {
    return createSection(section[0], section[1], 'CUSTOM  ===  '+section[0]);
  })

  const briefingStart = '<html>\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=windows-1250">\n<title>Briefing</title>\n</head>\n<body>\n\n\n';
  const briefingEnd = '\n\n\n</body>\n</html>';


  return [briefingStart, main, ...mainSides, notes, ...endings, objectives, ...extraSections, briefingEnd]
}

export function composeOverview() {


  const overiewStart = '<html>\n\n<head><title>\nOverview\n</title></head>\n\n<body>\n\n';

  const title = storageGetValue('overview/title');
  const titleText = `<br>\n<h2 align="center"><a name="Main">${title}</a></h2>\n\n`;

  const image = getStorage().overview.image;
  const imageText = image.src.length > 1 ? `<p align="center"><img src="${image.src.slice(1)}" width="${image.width.length > 1 ? image.width.slice(1) : '170'}" height="${image.height.length > 1 ? image.height.slice(1) : '64'}"></img></p>\n` : '';

  const description = getStorage().overview.description;
  const descriptionText = '<BR>\n'+convertQuillDeltaToString(description);

  const overviewEnd = '\n\n</body>\n</html>';

  return [overiewStart, titleText, imageText, descriptionText, overviewEnd];
}