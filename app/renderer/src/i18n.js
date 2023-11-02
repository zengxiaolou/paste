"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
i18next_1.default.use(i18next_fs_backend_1.default).init({
    resources: {
        en: {
            translation: {
                All: 'All',
                Collect: 'Collect',
                Today: 'Today',
                Text: 'Text',
                Image: 'Image',
                Link: 'Link',
                'Type to Search': 'Type to Search',
                'On Top': 'On Top',
                'Remove from top': 'Remove from top',
                quit: 'quit',
            },
        },
        zh: {
            translation: {
                All: '全部',
                Collect: '收藏',
                Today: '今天',
                Text: '文本',
                Image: '图像',
                Link: '链接',
                'Type to Search': '输入搜索',
                'On Top': '置顶',
                'Remove from top': '取消置顶',
                quit: '退出',
            },
        },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});
var i18next_2 = require("i18next");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(i18next_2).default; } });
//# sourceMappingURL=i18n.js.map