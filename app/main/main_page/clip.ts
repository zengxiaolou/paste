import * as electron from 'electron';
import { ClipData } from './type';
import * as crypto from 'crypto';
import nativeImage = electron.nativeImage;
import { exec } from 'child_process';

import { clipboard } from 'electron';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

class ClipboardManager {
  private lastHtmlContent: string | undefined = undefined;
  private lastImageHash: string | undefined = undefined;
  private pasteContent: ClipData | undefined;
  private readonly imageDir: string;

  constructor() {
    this.imageDir = path.join(__dirname, 'images');

    if (!fs.existsSync(this.imageDir)) {
      fs.mkdirSync(this.imageDir);
    }
  }

  setInitContent(type: 'html' | 'image', content: string) {
    if (type === 'html') {
      this.lastHtmlContent = content;
    } else {
      fs.readFile(content, (err: Error | null, data: any) => {
        if (err) {
          console.log('Error reading file: ', err);
        } else {
          this.lastImageHash = crypto.createHash('md5').update(data).digest('hex');
        }
      });
    }
  }

  checkClipboardContent(): ClipData | undefined {
    const htmlContent = clipboard.readHTML();
    const imageContent = clipboard.readImage();
    const imageBuffer = imageContent.toPNG();
    const currentImageHash = crypto.createHash('md5').update(imageBuffer).digest('hex');
    if (this.pasteContent?.type === 'html' && htmlContent === this.pasteContent?.content) {
      return undefined;
    }
    if (this.pasteContent?.type === 'image' && currentImageHash === this.pasteContent?.content) {
      return undefined;
    }

    if (htmlContent && htmlContent !== this.lastHtmlContent) {
      this.lastHtmlContent = htmlContent;
      this.lastImageHash = '';
      return { type: 'html', content: htmlContent };
    } else if (!imageContent.isEmpty() && currentImageHash !== this.lastImageHash) {
      this.lastImageHash = currentImageHash;
      this.lastHtmlContent = '';
      const imagePath = this.saveImageToDisk(imageContent);
      return { type: 'image', content: imagePath };
    }

    return undefined;
  }

  private saveImageToDisk(image: electron.NativeImage): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    const imagePath = path.join(this.imageDir, `image-${timestamp}.png`);
    fs.writeFileSync(imagePath, image.toPNG());
    return imagePath;
  }

  paste(type: string, content: string) {
    if (type === 'html') {
      const dom = new JSDOM(content);
      const text = dom.window.document.body.textContent || '';
      this.pasteContent = { type, content: text };
      clipboard.writeText(text);
    } else if (type === 'image') {
      this.pasteContent = { type, content };
      fs.readFile(content, (err: Error | null, data: any) => {
        if (err) {
          console.log('Error reading file: ', err);
        } else {
          if (this.pasteContent?.content) {
            this.pasteContent.content = crypto.createHash('md5').update(data).digest('hex');
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
  }
}

module.exports = ClipboardManager;
