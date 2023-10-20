import * as electron from 'electron';
import { clipData } from './type';
import * as crypto from 'crypto';
import nativeImage = electron.nativeImage;
import { exec } from 'child_process';

const { clipboard } = require('electron');
const fs = require('fs');
const clipPath = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const imageDir = clipPath.join(__dirname, 'images');

if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

let lastHtmlContent: string | undefined = undefined;
let lastImageHash: string | undefined = undefined;
let pasteContent: clipData | undefined;

const setInitContent = (type: 'html' | 'image', content: string) => {
  if (type === 'html') {
    lastHtmlContent = content;
  } else {
    fs.readFile(content, (err: Error | null, data: any) => {
      if (err) {
        console.log('Error reading file: ', err);
      } else {
        lastImageHash = crypto.createHash('md5').update(data).digest('hex');
      }
    });
  }
};

const checkClipboardContent = (): clipData | undefined => {
  const htmlContent = clipboard.readHTML();
  const imageContent = clipboard.readImage();
  const imageBuffer = imageContent.toPNG();
  const currentImageHash = crypto.createHash('md5').update(imageBuffer).digest('hex');
  if (pasteContent?.type === 'html' && htmlContent === pasteContent?.content) {
    return undefined;
  }
  if (pasteContent?.type === 'image' && currentImageHash === pasteContent?.content) {
    return undefined;
  }

  if (htmlContent && htmlContent !== lastHtmlContent) {
    lastHtmlContent = htmlContent;
    lastImageHash = '';
    return { type: 'html', content: htmlContent };
  } else if (!imageContent.isEmpty() && currentImageHash !== lastImageHash) {
    lastImageHash = currentImageHash;
    lastHtmlContent = '';
    const imagePath = saveImageToDisk(imageContent);
    return { type: 'image', content: imagePath };
  }

  return undefined;
};

const saveImageToDisk = (image: electron.NativeImage): string => {
  const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
  const imagePath = clipPath.join(imageDir, `image-${timestamp}.png`);
  fs.writeFileSync(imagePath, image.toPNG());
  return imagePath;
};

const paste = (type: string, content: string) => {
  if (type === 'html') {
    const dom = new JSDOM(content);
    const text = dom.window.document.body.textContent || '';
    pasteContent = { type, content: text };
    clipboard.writeText(text);
  } else if (type === 'image') {
    pasteContent = { type, content };
    fs.readFile(content, (err: Error | null, data: any) => {
      if (err) {
        console.log('Error reading file: ', err);
      } else {
        if (pasteContent?.content) {
          pasteContent.content = crypto.createHash('md5').update(data).digest('hex');
        }
      }
    });
    clipboard.writeImage(nativeImage.createFromPath(content));
  }

  if (process.platform === 'darwin') {
    exec('osascript -e \'tell application "System Events" to keystroke "v" using command down\'');
  } else if (process.platform === 'win32') {
    exec('echo off | clip && echo ' + content + ' | clip');
  } else {
    exec('xdotool key ctrl+v');
  }
};

module.exports = { checkClipboardContent, setInitContent, paste };
