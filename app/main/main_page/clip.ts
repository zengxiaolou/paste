import crypto from 'node:crypto';
import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { clipboard, nativeImage, NativeImage } from 'electron';
import { JSDOM } from 'jsdom';
import { ClipData } from './type';
import { DataTypes } from './enum';
import { MAIN_PAGE_DIRECTION } from './const';

class ClipboardManager {
  private lastHtmlContent: string | undefined = undefined;
  private lastImageHash: string | undefined = undefined;
  private pasteContent: ClipData | undefined;
  private readonly imageDir: string;

  constructor() {
    this.imageDir = path.join(MAIN_PAGE_DIRECTION, 'images');

    if (!fs.existsSync(this.imageDir)) {
      fs.mkdirSync(this.imageDir);
    }
  }

  setInitContent(type: DataTypes, content: string) {
    if (type === 'html') {
      this.lastHtmlContent = content;
    } else {
      fs.readFile(content, (error: Error | null, data: any) => {
        if (error) {
          console.log('Error reading file:', error);
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
    if (this.pasteContent?.type === DataTypes.HTML && htmlContent === this.pasteContent?.content) {
      return undefined;
    }
    if (this.pasteContent?.type === DataTypes.IMAGE && currentImageHash === this.pasteContent?.content) {
      return undefined;
    }

    if (htmlContent && htmlContent !== this.lastHtmlContent) {
      this.lastHtmlContent = htmlContent;
      this.lastImageHash = '';
      return { type: DataTypes.HTML, content: htmlContent };
    } else if (!imageContent.isEmpty() && currentImageHash !== this.lastImageHash) {
      this.lastImageHash = currentImageHash;
      this.lastHtmlContent = '';
      const imagePath = this.saveImageToDisk(imageContent);
      return { type: DataTypes.IMAGE, content: imagePath };
    }

    return undefined;
  }

  private saveImageToDisk(image: NativeImage): string {
    const timestamp = new Date().toISOString().replaceAll(/[.:-]/g, '');
    const imagePath = path.join(this.imageDir, `image-${timestamp}.png`);
    fs.writeFileSync(imagePath, image.toPNG());
    return imagePath;
  }

  paste(type: string, content: string): boolean {
    if (type === DataTypes.HTML) {
      const dom = new JSDOM(content);
      const text = dom.window.document.body.textContent || '';
      this.pasteContent = { type, content: text };
      clipboard.writeText(text);
    } else if (type === DataTypes.IMAGE) {
      this.pasteContent = { type, content };
      fs.readFile(content, (error: Error | null, data: any) => {
        if (error) {
          console.log('Error reading file:', error);
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
      // eslint-disable-next-line security/detect-child-process
      exec('echo off | clip && echo ' + content + ' | clip');
    } else {
      exec('xdotool key ctrl+v');
    }
    return true;
  }
}

export default ClipboardManager;
