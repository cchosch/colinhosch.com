import * as THREE from "three";

export type RenderState = {
    readIndex: [number, number],
    contentTexture: THREE.CanvasTexture,
    fullCode: [string, string][],
    codeText: [string, string][][],
    textureCanvas: HTMLCanvasElement,
    // 1 forward, -1 backward
    direction: number
};

const crtFontSize = 40;

export function screenRenderLoop(renderState: RenderState) {
    return () => {
        if(renderState.direction > 0) {
            if(!typeForward(renderState)) {
                renderState.direction *= -1;
                typeBackwards(renderState);
            }
        } else {
            if(!typeBackwards(renderState)) {
                renderState.direction = 1;
                typeForward(renderState);
            }
        }


        const {codeText, textureCanvas, contentTexture} = renderState;
        const tCtx = textureCanvas.getContext("2d");
        if(!tCtx) {
            console.error("NO CANVAS");
            return;
        }
        tCtx.fillStyle = "rgb(31, 31, 31)";
        tCtx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
        tCtx.font = `${crtFontSize}px JetBrains Mono`;

        const offset = {x: 0, y: 0};
        const lastLine = (10 + crtFontSize) * (codeText.length);
        if(lastLine > textureCanvas.height * 0.9) {
            offset.y = textureCanvas.height * 0.9-lastLine;
        }
        const skip = Math.max(Math.floor(-offset.y / (10 + crtFontSize))-1, 0);
        const baseXOffset = tCtx.measureText("0000  ").width;
        const paddingWidth = tCtx.measureText("  ").width;

        let cY = 0;
        for(let i = skip; i < codeText.length; i++) {
            offset.x = baseXOffset;
            cY = (10 + crtFontSize) * (i+1) + offset.y;
            if(i < codeText.length-1)
                tCtx.fillStyle = "#6e7681";
            else
                tCtx.fillStyle = "#fff";
            tCtx.fillText(`${i}`, ((baseXOffset-paddingWidth)-tCtx.measureText(`${i}`).width), cY);
            for(let j = 0; j < codeText[i].length; j++) {
                if(codeText[i][j][1].trim().length > 0) {
                    tCtx.fillStyle = codeText[i][j][0];
                    tCtx.fillText(codeText[i][j][1], 10 + offset.x, cY);
                }
                offset.x += tCtx.measureText(codeText[i][j][1]).width;
            }
        }

        tCtx.fillStyle = "white";
        tCtx.fillText("|", 10 + offset.x, cY);
        contentTexture.needsUpdate = true;
    };
}

function typeBackwards(renderState: RenderState): boolean {
    const {codeText} = renderState;

    const lastY = codeText.length-1;
    const writeIndex = [lastY, codeText[lastY].length-1];
    // if currently removing string is done
    if(codeText[writeIndex[0]][writeIndex[1]][1].length === 0) {
        // if at 0, 0 (start) return false and start going forwards
        if(writeIndex[0] === 0 && writeIndex[1] === 0) {
            renderState.readIndex = [0, 0];
            return false;
        }

        // remove current string because it's length is 0
        codeText[writeIndex[0]].pop();

        // if we're at the start of this line pop it
        if(writeIndex[1] === 0) {
            codeText.pop();
            writeIndex[0]--;
            writeIndex[1] = codeText[writeIndex[0]].length-1;
        } else {
            // otherwise move to next string
            writeIndex[1]--;
        }
    }

    const currSnippet = codeText[writeIndex[0]][writeIndex[1]][1];
    // Are there 4 spaces behind cursor?
    // If so, consider it a tab and remove in chunks of 4
    if(currSnippet.length >= 4 && currSnippet.substring(currSnippet.length-4) === "    ") {
        codeText[writeIndex[0]][writeIndex[1]][1] = codeText[writeIndex[0]][writeIndex[1]][1].substring(0, codeText[writeIndex[0]][writeIndex[1]][1].length-4);
    } else {
        codeText[writeIndex[0]][writeIndex[1]][1] = codeText[writeIndex[0]][writeIndex[1]][1].substring(0, codeText[writeIndex[0]][writeIndex[1]][1].length-1);
    }
    return true;
}

function typeForward(renderState: RenderState): boolean {
    // if at end of line
    if(renderState.readIndex[0] >= renderState.fullCode.length ||
        (renderState.readIndex[0] === renderState.fullCode.length-1 && renderState.readIndex[1] === renderState.fullCode[renderState.readIndex[0]][1].length)) {
        return false;
    }
    const {readIndex, fullCode, codeText} = renderState;
    // if at end of current segment
    if(fullCode[readIndex[0]][1].length === readIndex[1]) {
        readIndex[0]++;
        readIndex[1] = 0;
        if(codeText[codeText.length-1][codeText[codeText.length-1].length-1][1].length === 0)
            codeText[codeText.length-1].pop();
        codeText[codeText.length-1].push([fullCode[readIndex[0]][0], ""]);
    }

    const lastY = codeText.length-1;
    const writeIndex = [lastY, codeText[lastY].length-1];
    const currChar = fullCode[readIndex[0]][1][readIndex[1]];
    if(currChar === "\n") {
        codeText.push([[fullCode[readIndex[0]][0], ""]]);
    } else if(currChar === "\t") {
        codeText[writeIndex[0]][writeIndex[1]][1] += "    ";
    } else {
        codeText[writeIndex[0]][writeIndex[1]][1] += currChar;
    }
    readIndex[1]++;
    return true;
}

export const getCodeHighlights = (el: Element): [string, string][] => {
    const h = getChildHighlights(el);

    addBracketColors(h);

    // replace all blocks of 4 spaces with tabs
    for(let i = 0; i < h.length; i++) {
        h[i][1] = h[i][1].replaceAll("    ", "\t");
    }

    return h;
}

const cols = ["#ffd700", "#da70d6", "#179fff"];
const chars = "(){}[]";
const ignoreColors = [
    // comments
    "rgb(106, 153, 85)",
    // strings
    "rgb(206, 145, 120)"
];

const isOpeningChar = (c: string): boolean | null => {
    const i = chars.indexOf(c);
    if(i === -1)
        return null;

    return (i % 2) === 0;
}

/**
 * @description Modifies h in-place, adding color to all brackets
 * @param h Array of [color, text_segment]
 */
const addBracketColors = (h: [string, string][]) => {
    let colorI = 0;

    // Loop through each text segment
    for(let i = 0; i < h.length; i++) {
        // ignore brackets in strings and comments
        if(ignoreColors.includes(h[i][0]))
            continue;
        
        for(let j = 0; j < h[i][1].length; j++) {
            const cChar = h[i][1][j];
            const isOpening = isOpeningChar(cChar);
            // Not a bracket character, return
            if(isOpening === null)
                continue;

            // If it's an closing character, move color index back
            if(!isOpening) {
                colorI -= 1;
            }
            // Get color of bracket character
            const currColor = cols[colorI % 3];
            // If it's an opening character, move color index forward for inside scope
            if(isOpening) {
                colorI += 1;
            }
            // snippet before current character
            const start = h[i][1].substring(0, j);
            // snippet after current character
            const end = h[i][1].substring(j+1);

            let iOff = 1;
            const ogColor = h[i][0];
            if(start.length === 0) {
                // If start length is zero, overwrite current segment with just the
                // bracket and later end.length check takes care of anything after the bracket
                h[i] = [currColor, cChar];
            } else {
                // Since start has content, make current segment just the beginning and splice in
                // char with it's proper color
                h[i][1] = start;
                h.splice(i+1, 0, [currColor, cChar]);
                iOff += 1;
            }
            if(end.length > 0) {
                // Since end has content, splice it in after all changes above
                h.splice(i+iOff, 0, [ogColor, end]);
            }
            // Move index to wherever we spliced in the current char
            // Break out of current loop because we spliced up array
            i += iOff-1;
            break
        }
    }

}

const getChildHighlights = (el: Element): [string, string][] => {
    let innerHighlightedCode: [string, string][] = [];
    el.childNodes.forEach((node) => {
        if(node.nodeType === node.TEXT_NODE) {
            innerHighlightedCode.push(["rgb(255, 255, 255)", node.textContent!]);
        } else {
            for(let i = 0; i < el.children.length; i++) {
                if(el.children[i] === node) {
                    const childNode = el.children.item(i);
                    if(!childNode || (childNode.textContent?.length??0) === 0) {
                        return;
                    }
                    if(childNode.childNodes.length > 1 || childNode.childNodes[0].nodeType !== 3) {
                        innerHighlightedCode = [...innerHighlightedCode, ...getChildHighlights(childNode)];
                    } else {
                        const col = childNode.computedStyleMap().get("color")?.toString()??"#fff";
                        // node
                        innerHighlightedCode.push([col, childNode.textContent!]);
                    }
                    return;
                }
            }
        }
    });
    return innerHighlightedCode;
};