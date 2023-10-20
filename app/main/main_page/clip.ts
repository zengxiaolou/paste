import * as electron from 'electron';
import { clipData } from './type';
import * as crypto from 'crypto';
import nativeImage = electron.nativeImage;
import { exec } from 'child_process';

const { clipboard } = require('electron');
const fs = require('fs');
const clipPath = require('path');

const imageDir = clipPath.join(__dirname, 'images');

if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

let lastHtmlContent: string | undefined = undefined;
let lastImageHash: string | undefined = undefined; // 用于存储上一次图像的哈希值

const setInitContent = (type: 'html' | 'image', content: string) => {
  if (type === 'html') {
    lastHtmlContent = content;
  } else {
    fs.reandFile(content, (err: Error | null, data: any) => {
      if (err) {
        console.log('Error reading file: ', err);
      } else {
        lastImageHash = crypto.createHash('mad5').update(data).digest('hex');
      }
    });
  }
};

const checkClipboardContent = (): clipData | undefined => {
  const htmlContent = clipboard.readHTML();
  const imageContent = clipboard.readImage();
  const imageBuffer = imageContent.toPNG();
  const currentImageHash = crypto.createHash('sha256').update(imageBuffer).digest('hex');

  if (htmlContent && htmlContent !== lastHtmlContent) {
    lastHtmlContent = htmlContent; // 更新最后的HTML内容
    lastImageHash = ''; // 重置图像哈希值
    return { type: 'html', content: htmlContent };
  } else if (!imageContent.isEmpty() && currentImageHash !== lastImageHash) {
    lastImageHash = currentImageHash; // 更新图像哈希值
    lastHtmlContent = ''; // 重置HTML内容
    const imagePath = saveImageToDisk(imageContent);
    return { type: 'image', content: imagePath };
  }

  // 如果没有检测到新的内容，返回undefined
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
    clipboard.writeText(content);
  } else if (type === 'image') {
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
