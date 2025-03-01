import { KeyModels } from "./keyboard";

export type Key = {
    legend?: string,
    legendSize?: number,
    legendOffset?: [number, number] | [number, number, number],
    code?: string,
    key?: string,
    model: keyof KeyModels,
    // mm, mm, mm
    offset?: [number, number] | [number, number, number],
    rotation?: [number, number] | [number, number, number],
    // dark?
    d?: boolean,
};

const k = 19.2;

// COLLAPSE IN IDE FOR READABILITY
const arrowRow: Key[] = [
    {
        legend: "Ent",
        model: "_2u_vertical",
        d: true
    },
    {
        legend: ".",
        model: "_1u_arrow",
        offset: [k*5.4, 0],
    },
    {
        legend: "0",
        model: "_2u",
    },
    {
        legend: "←",
        code: "arrowleft",
        model: "_1u_arrow",
        offset: [0, 1],
        d: true,
    },
    {
        legend: "↓",
        code: "arrowdown",
        model: "_1u_arrow",
        offset: [k, 1],
        d: true,
    },
    {
        legend: ">",
        code: "arrowright",
        model: "_1u_arrow",
        offset: [k * 2, 1],
        d: true,
    },
    {
        legend: "↑",
        code: "arrowup",
        model: "_1u_zxc",
        offset: [k * 13.25, 1],
        d: true,
    },
    {
        legend: "ctrl",
        model: "_1_5u_bottom",
        d: true,
    },
    {
        legend: "alt",
        model: "_1_5u_bottom",
        offset: [-k*2.5, 0],
        d: true,
    },
    {
        code: "space",
        model: "space",
        offset: [0, 0]
    },
    {
        legend: "alt",
        model: "_1_5u_bottom",
        offset: [-k*11.1, 0],
        d: true,
    },
    {
        legend: "ctrl",
        model: "_1_5u_bottom",
        offset: [-k*13.6, 0],
        d: true,
    },
];

const zxcRow: Key[] = [
    {
        legend: "shift",
        code: "shiftleft",
        model: "_1_25u",
        d: true,
    },
    {
        legend: "\\",
        model: "_1u_zxc",
        offset: [-k*2, 0]
    },
    {
        legend: "z",
        model: "_1u_zxc",
        offset: [-k*1, 0]
    },
    {
        legend: "x",
        model: "_1u_zxc",
    },
    {
        legend: "c",
        model: "_1u_zxc",
        offset: [k, 0]
    },
    {
        legend: "v",
        model: "_1u_zxc",
        offset: [k*2, 0]
    },
    {
        legend: "b",
        model: "_1u_zxc",
        offset: [k*3, 0]
    },
    {
        legend: "n",
        model: "_1u_zxc",
        offset: [k*4, 0]
    },
    {
        legend: "m",
        model: "_1u_zxc",
        offset: [k*5, 0]
    },
    {
        legend: ",",
        model: "_1u_zxc",
        offset: [k*6, 0]
    },
    {
        legend: ".",
        model: "_1u_zxc",
        offset: [k*7, 0]
    },
    {
        legend: "/",
        code: "slash",
        model: "_1u_zxc",
        offset: [k*8, 0]
    },
    {
        legend: "shift",
        model: "_2_25u",
        d: true,
    },
    {
        legend: "1",
        model: "_1u_zxc",
        offset: [k*15.675, 0]
    },
    {
        legend: "2",
        model: "_1u_zxc",
        offset: [k*16.675, 0]
    },
    {
        legend: "3",
        model: "_1u_zxc",
        offset: [k*17.675, 0]
    },
];

const homeRow: Key[] = [
    {
        legend: "Caps\nLock",
        legendSize: 0.7,
        legendOffset: [1, 2, -1],
        model: "caps_lock",
        d: true,
    },
    {
        legend: "a",
        model: "_1u_home_row",
        offset: [-k*2, 0]
    },
    {
        legend: "s",
        model: "_1u_home_row",
        offset: [-k, 0]
    },
    {
        legend: "d",
        model: "_1u_home_row",
    },
    {
        legend: "f",
        model: "_1u_home_row",
        offset: [k, 0]
    },
    {
        legend: "g",
        model: "_1u_home_row",
        offset: [k*2, 0]
    },
    {
        legend: "h",
        model: "_1u_home_row",
        offset: [k*3, 0]
    },
    {
        legend: "j",
        model: "_1u_home_row",
        offset: [k*4, 0]
    },
    {
        legend: "k",
        model: "_1u_home_row",
        offset: [k*5, 0]
    },
    {
        legend: "l",
        model: "_1u_home_row",
        offset: [k*6, 0]
    },
    {
        legend: ";",
        model: "_1u_home_row",
        offset: [k*7, 0]
    },
    {
        legend: "\"",
        model: "_1u_home_row",
        offset: [k*8, 0]
    },
    {
        legend: "{ }",
        model: "_1u_home_row",
        offset: [k*9, 0]
    },
    {
        legend: "↵",
        code: "enter",
        model: "enter",
        d: true
    },
    {
        legend: "4",
        model: "_1u_home_row",
        offset: [k*15.25, 0]
    },
    {
        legend: "5",
        model: "_1u_home_row",
        offset: [k*16.25, 0]
    },
    {
        legend: "6",
        model: "_1u_home_row",
        offset: [k*17.25, 0]
    },
    {
        legend: "4",
        model: "_2u_vertical",
        offset: [0, k*2.2, 19.05],
        rotation: [Math.PI/16, 0, 0]
    },
];

const qwertyRow: Key[] = [
    {
        model: "_1_5u",
        legend: "Tab",
        d: true,
    },
    {
        model: "_1u_qwerty_row",
        legend: "q",
        offset: [-k*2, 0],
    },
    {
        model: "_1u_qwerty_row",
        legend: "w",
        offset: [-k, 0],
    },
    {
        model: "_1u_qwerty_row",
        legend: "e",
    },
    {
        model: "_1u_qwerty_row",
        legend: "r",
        offset: [k, 0],
    },
    {
        model: "_1u_qwerty_row",
        legend: "t",
        offset: [k*2, 0],
    },
    {
        model: "_1u_qwerty_row",
        legend: "y",
        offset: [k*3, 0],
    },
    {
        model: "_1u_qwerty_row",
        legend: "u",
        offset: [k*4, 0],
    },
    {
        model: "_1u_qwerty_row",
        legend: "i",
        offset: [k*5, 0],
    },
    {
        model: "_1u_qwerty_row",
        legend: "o",
        offset: [k*6, 0],
    },
    {
        model: "_1u_qwerty_row",
        legend: "p",
        offset: [k*7, 0],
    },
    {
        model: "_1u_qwerty_row",
        legend: "{",
        offset: [k*8, 0],
    },
    {
        model: "_1u_qwerty_row",
        legend: "}",
        offset: [k*9, 0],
    },

    {
        legend: "Delete",
        legendSize: 0.4,
        legendOffset: [3, 0],
        model: "_1u_qwerty_row",
        offset: [k*12.07, 0],
        d: true,
    },
    {
        legend: "End",
        legendSize: 0.4,
        legendOffset: [3, 0],
        model: "_1u_qwerty_row",
        offset: [k*13.07, 0],
        d: true,
    },
    {
        legend: "Page Down",
        legendSize: 0.25,
        legendOffset: [3, 0],
        model: "_1u_qwerty_row",
        offset: [k*14.07, 0],
        d: true,
    },
    {
        legend: "7",
        model: "_1u_qwerty_row",
        offset: [k*15.5, 0],
    },
    {
        legend: "8",
        model: "_1u_qwerty_row",
        offset: [k*16.5, 0],
    },
    {
        legend: "9",
        model: "_1u_qwerty_row",
        offset: [k*17.5, 0],
    },
];

const numbersRow: Key[] = [
    {
        legend: "`",
        code: "backquote",
        model: "_1u_numbers_row",
        offset: [-k*4, 0],
    },
    {
        legend: "1",
        model: "_1u_numbers_row",
        offset: [-k*3, 0],
    },
    {
        legend: "2",
        model: "_1u_numbers_row",
        offset: [-k*2, 0],
    },
    {
        legend: "3",
        model: "_1u_numbers_row",
        offset: [-k, 0],
    },
    {
        legend: "4",
        model: "_1u_numbers_row",
    },
    {
        legend: "5",
        model: "_1u_numbers_row",
        offset: [k, 0],
    },
    {
        legend: "6",
        model: "_1u_numbers_row",
        offset: [k*2, 0],
    },
    {
        legend: "7",
        model: "_1u_numbers_row",
        offset: [k*3, 0],
    },
    {
        legend: "8",
        model: "_1u_numbers_row",
        offset: [k*4, 0],
    },
    {
        legend: "9",
        model: "_1u_numbers_row",
        offset: [k*5, 0],
    },
    {
        legend: "0",
        model: "_1u_numbers_row",
        offset: [k*6, 0],
    },
    {
        legend: "-",
        code: "minus",
        model: "_1u_numbers_row",
        offset: [k*7, 0],
    },
    {
        legend: "+",
        code: "equal",
        model: "_1u_numbers_row",
        offset: [k*8, 0],
    },
    {
        legend: "Backspace",
        model: "backspace",
        d: true
    },
    {
        legend: "Insert",
        legendSize: 0.45,
        legendOffset: [1.5, 0],
        model: "_1u_numbers_row",
        offset: [k*11.55, 0],
        d: true,
    },
    {
        legend: "Home",
        legendSize: 0.45,
        legendOffset: [3, 0],
        model: "_1u_numbers_row",
        offset: [k*12.55, 0],
        d: true,
    },
    {
        legend: "Page Up",
        legendSize: 0.4,
        legendOffset: [1.5, 0],
        model: "_1u_numbers_row",
        offset: [k*13.55, 0],
        d: true,
    },
    {
        legend: "Num Lock",
        legendSize: 0.35,
        legendOffset: [2, 0],
        model: "_1u_numbers_row",
        offset: [k*14.98, 0],
        d: true,
    },
    {
        legend: "/",
        model: "_1u_numbers_row",
        offset: [k*15.98, 0],
        d: true,
    },
    {
        legend: "*",
        model: "_1u_numbers_row",
        offset: [k*16.98, 0],
        d: true,
    },
    {
        legend: "-",
        model: "_1u_numbers_row",
        offset: [k*17.98, 0],
        d: true,
    },
];

const fRow: Key[] = [
    {
        legend: "Esc",
        code: "escape",
        model: "_1u_f_row",
        offset: [-k*3, 0],
        d: true
    },
    {
        legend: "F1",
        model: "_1u_f_row",
        offset: [-k, 0],
    },
    {
        legend: "F2",
        model: "_1u_f_row",
    },
    {
        legend: "F3",
        model: "_1u_f_row",
        offset: [k, 0],
    },
    {
        legend: "F4",
        model: "_1u_f_row",
        offset: [k*2, 0],
    },
    {
        legend: "F5",
        model: "_1u_f_row",
        offset: [k*3.55, 0],
        d: true
    },
    {
        legend: "F6",
        model: "_1u_f_row",
        offset: [k*4.55, 0],
        d: true
    },
    {
        legend: "F7",
        model: "_1u_f_row",
        offset: [k*5.55, 0],
        d: true
    },
    {
        legend: "F8",
        model: "_1u_f_row",
        offset: [k*6.55, 0],
        d: true
    },
    {
        legend: "F9",
        model: "_1u_f_row",
        offset: [k*8.05, 0],
    },
    {
        legend: "F10",
        model: "_1u_f_row",
        offset: [k*9.05, 0],
    },
    {
        legend: "F11",
        model: "_1u_f_row",
        offset: [k*10.05, 0],
    },
    {
        legend: "F12",
        model: "_1u_f_row",
        offset: [k*11.05, 0],
    },
    {
        legend: "PntSc",
        legendSize: 0.5,
        legendOffset: [2, 0],
        model: "_1u_f_row",
        offset: [k*12.6, 0],
        d: true
    },
    {
        legend: "ScrLck",
        legendSize: 0.45,
        legendOffset: [2, 0],
        model: "_1u_f_row",
        offset: [k*13.6, 0],
        d: true
    },
    {
        legend: "Pause",
        legendSize: 0.45,
        legendOffset: [2, 0],
        model: "_1u_f_row",
        offset: [k*14.6, 0],
        d: true
    },
];

export const KeyPositions: Key[] = [
    ...arrowRow,
    ...zxcRow,
    ...homeRow,
    ...qwertyRow,
    ...numbersRow,
    ...fRow
];
