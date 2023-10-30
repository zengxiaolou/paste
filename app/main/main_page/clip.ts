import crypto from 'node:crypto';
import {exec} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {app, clipboard, nativeImage, NativeImage} from 'electron';
import {JSDOM} from 'jsdom';
import {ClipData} from './type';
import {DataTypes} from './enum';

class ClipboardManager {
  private pasteContentQueue: ClipData[] = [];
  private readonly imageDir: string;

  constructor() {
    this.imageDir = path.join(app.getPath('userData'), 'images');

    if (!fs.existsSync(this.imageDir)) {
      fs.mkdirSync(this.imageDir);
    }
  }
  setInitContent(type: DataTypes, content: string) {
    if (type === 'html') {
      this.pasteContentQueue.push({ type, content: content });
    } else {
      fs.readFile(content, (error: Error | null, data: any) => {
        if (error) {
          console.log('Error reading file:', error);
        } else {
          this.pasteContentQueue.push({ type, content: crypto.createHash('md5').update(data).digest('hex') });
        }
      });
    }
  }
  checkClipboardContent(): ClipData | undefined {
    const htmlContent = clipboard.readHTML();
    const imageContent = clipboard.readImage();
    const imageBuffer = imageContent.toPNG();
    const currentImageHash = crypto.createHash('md5').update(imageBuffer).digest('hex');

    let newContent: ClipData | undefined;

    if (htmlContent) {
      newContent = { type: DataTypes.HTML, content: htmlContent };
    } else if (imageContent.isEmpty()) {
      const textContent = clipboard.readText()
      if (textContent) {
        newContent = { type: DataTypes.HTML, content: textContent };
      }
    }else {
      const imagePath = this.saveImageToDisk(imageContent);
      newContent = { type: DataTypes.IMAGE, content: imagePath };
    }

    if (newContent) {
      const isDuplicate = this.pasteContentQueue.some(item => {
        if (item.type === DataTypes.HTML && item.content === newContent?.content) {
          return true;
        }
        if (item.type === DataTypes.IMAGE && item.content === currentImageHash) {
          return true;
        }
      });

      if (!isDuplicate) {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        this.pasteContentQueue.push(newContent.type === DataTypes.HTML ? newContent : {...newContent, content: currentImageHash });
        if (this.pasteContentQueue.length > 10) {
          this.pasteContentQueue.shift();
        }
        return newContent;
      }
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
      this.pasteContentQueue.push({ type, content: text });
      if (this.pasteContentQueue.length > 10) {
        this.pasteContentQueue.shift();
      }
      clipboard.writeText(text);
    } else if (type === DataTypes.IMAGE) {
      fs.readFile(content, (error: Error | null, data: any) => {
        if (error) {
          console.log('Error reading file:', error);
        } else {
          this.pasteContentQueue.push({ type, content: crypto.createHash('md5').update(data).digest('hex') });
          if (this.pasteContentQueue.length > 10) {
            this.pasteContentQueue.shift();
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
