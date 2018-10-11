/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import * as Utils from '../utils/ngx-editor.utils';
var CommandExecutorService = /** @class */ (function () {
    /**
     *
     * @param _http HTTP Client for making http requests
     */
    function CommandExecutorService(_http) {
        this._http = _http;
        /**
         * saves the selection from the editor when focussed out
         */
        this.savedSelection = undefined;
    }
    /**
     * executes command from the toolbar
     *
     * @param command command to be executed
     */
    /**
     * executes command from the toolbar
     *
     * @param {?} command command to be executed
     * @return {?}
     */
    CommandExecutorService.prototype.execute = /**
     * executes command from the toolbar
     *
     * @param {?} command command to be executed
     * @return {?}
     */
    function (command) {
        if (!this.savedSelection && command !== 'enableObjectResizing') {
            throw new Error('Range out of Editor');
        }
        if (command === 'enableObjectResizing') {
            document.execCommand('enableObjectResizing', true, true);
            return;
        }
        if (command === 'blockquote') {
            document.execCommand('formatBlock', false, 'blockquote');
            return;
        }
        if (command === 'removeBlockquote') {
            document.execCommand('formatBlock', false, 'div');
            return;
        }
        document.execCommand(command, false, null);
        return;
    };
    /**
     * inserts image in the editor
     *
     * @param imageURI url of the image to be inserted
     */
    /**
     * inserts image in the editor
     *
     * @param {?} imageURI url of the image to be inserted
     * @return {?}
     */
    CommandExecutorService.prototype.insertImage = /**
     * inserts image in the editor
     *
     * @param {?} imageURI url of the image to be inserted
     * @return {?}
     */
    function (imageURI) {
        if (this.savedSelection) {
            if (imageURI) {
                /** @type {?} */
                var restored = Utils.restoreSelection(this.savedSelection);
                if (restored) {
                    /** @type {?} */
                    var inserted = this.insertHtml("<app-img [src]=" + imageURI + " style=\"max-width: 100%;\"></app-img>");
                    if (!inserted) {
                        throw new Error('Invalid URL');
                    }
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
        return;
    };
    /**
   * inserts image in the editor
   *
   * @param videParams url of the image to be inserted
   */
    /**
     * inserts image in the editor
     *
     * @param {?} videParams url of the image to be inserted
     * @return {?}
     */
    CommandExecutorService.prototype.insertVideo = /**
     * inserts image in the editor
     *
     * @param {?} videParams url of the image to be inserted
     * @return {?}
     */
    function (videParams) {
        if (this.savedSelection) {
            if (videParams) {
                /** @type {?} */
                var restored = Utils.restoreSelection(this.savedSelection);
                if (restored) {
                    if (this.isYoutubeLink(videParams.videoUrl)) {
                        /** @type {?} */
                        var youtubeURL = '<iframe width="' + videParams.width + '" height="' + videParams.height + '"'
                            + 'src="' + videParams.videoUrl + '"></iframe>';
                        this.insertHtml(youtubeURL);
                    }
                    else if (this.checkTagSupportInBrowser('video')) {
                        if (this.isValidURL(videParams.videoUrl)) {
                            /** @type {?} */
                            var videoSrc = '<video width="' + videParams.width + '" height="' + videParams.height + '"'
                                + ' controls="true"><source src="' + videParams.videoUrl + '"></video>';
                            this.insertHtml(videoSrc);
                        }
                        else {
                            throw new Error('Invalid video URL');
                        }
                    }
                    else {
                        throw new Error('Unable to insert video');
                    }
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
        return;
    };
    /**
     * checks the input url is a valid youtube URL or not
     *
     * @param {?} url Youtue URL
     * @return {?}
     */
    CommandExecutorService.prototype.isYoutubeLink = /**
     * checks the input url is a valid youtube URL or not
     *
     * @param {?} url Youtue URL
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var ytRegExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
        return ytRegExp.test(url);
    };
    /**
     * check whether the string is a valid url or not
     * @param {?} url url
     * @return {?}
     */
    CommandExecutorService.prototype.isValidURL = /**
     * check whether the string is a valid url or not
     * @param {?} url url
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var urlRegExp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        return urlRegExp.test(url);
    };
    /**
     * uploads image to the server
     *
     * @param file file that has to be uploaded
     * @param endPoint enpoint to which the image has to be uploaded
     */
    /**
     * uploads image to the server
     *
     * @param {?} file file that has to be uploaded
     * @param {?} endPoint enpoint to which the image has to be uploaded
     * @return {?}
     */
    CommandExecutorService.prototype.uploadImage = /**
     * uploads image to the server
     *
     * @param {?} file file that has to be uploaded
     * @param {?} endPoint enpoint to which the image has to be uploaded
     * @return {?}
     */
    function (file, endPoint) {
        if (!endPoint) {
            throw new Error('Image Endpoint isn`t provided or invalid');
        }
        /** @type {?} */
        var formData = new FormData();
        if (file) {
            formData.append('file', file);
            /** @type {?} */
            var req = new HttpRequest('POST', endPoint, formData, {
                reportProgress: true
            });
            return this._http.request(req);
        }
        else {
            throw new Error('Invalid Image');
        }
    };
    /**
     * inserts link in the editor
     *
     * @param params parameters that holds the information for the link
     */
    /**
     * inserts link in the editor
     *
     * @param {?} params parameters that holds the information for the link
     * @return {?}
     */
    CommandExecutorService.prototype.createLink = /**
     * inserts link in the editor
     *
     * @param {?} params parameters that holds the information for the link
     * @return {?}
     */
    function (params) {
        if (this.savedSelection) {
            /**
                   * check whether the saved selection contains a range or plain selection
                   */
            if (params.urlNewTab) {
                /** @type {?} */
                var newUrl = '<a href="' + params.urlLink + '" target="_blank">' + params.urlText + '</a>';
                if (document.getSelection().type !== 'Range') {
                    /** @type {?} */
                    var restored = Utils.restoreSelection(this.savedSelection);
                    if (restored) {
                        this.insertHtml(newUrl);
                    }
                }
                else {
                    throw new Error('Only new links can be inserted. You cannot edit URL`s');
                }
            }
            else {
                /** @type {?} */
                var restored = Utils.restoreSelection(this.savedSelection);
                if (restored) {
                    document.execCommand('createLink', false, params.urlLink);
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
        return;
    };
    /**
     * insert color either font or background
     *
     * @param color color to be inserted
     * @param where where the color has to be inserted either text/background
     */
    /**
     * insert color either font or background
     *
     * @param {?} color color to be inserted
     * @param {?} where where the color has to be inserted either text/background
     * @return {?}
     */
    CommandExecutorService.prototype.insertColor = /**
     * insert color either font or background
     *
     * @param {?} color color to be inserted
     * @param {?} where where the color has to be inserted either text/background
     * @return {?}
     */
    function (color, where) {
        if (this.savedSelection) {
            /** @type {?} */
            var restored = Utils.restoreSelection(this.savedSelection);
            if (restored && this.checkSelection()) {
                if (where === 'textColor') {
                    document.execCommand('foreColor', false, color);
                }
                else {
                    document.execCommand('hiliteColor', false, color);
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
        return;
    };
    /**
     * set font size for text
     *
     * @param fontSize font-size to be set
     */
    /**
     * set font size for text
     *
     * @param {?} fontSize font-size to be set
     * @return {?}
     */
    CommandExecutorService.prototype.setFontSize = /**
     * set font size for text
     *
     * @param {?} fontSize font-size to be set
     * @return {?}
     */
    function (fontSize) {
        if (this.savedSelection && this.checkSelection()) {
            /** @type {?} */
            var deletedValue = this.deleteAndGetElement();
            if (deletedValue) {
                /** @type {?} */
                var restored = Utils.restoreSelection(this.savedSelection);
                if (restored) {
                    if (this.isNumeric(fontSize)) {
                        /** @type {?} */
                        var fontPx = '<span style="font-size: ' + fontSize + 'px;">' + deletedValue + '</span>';
                        this.insertHtml(fontPx);
                    }
                    else {
                        /** @type {?} */
                        var fontPx = '<span style="font-size: ' + fontSize + ';">' + deletedValue + '</span>';
                        this.insertHtml(fontPx);
                    }
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
    };
    /**
     * set font name/family for text
     *
     * @param fontName font-family to be set
     */
    /**
     * set font name/family for text
     *
     * @param {?} fontName font-family to be set
     * @return {?}
     */
    CommandExecutorService.prototype.setFontName = /**
     * set font name/family for text
     *
     * @param {?} fontName font-family to be set
     * @return {?}
     */
    function (fontName) {
        if (this.savedSelection && this.checkSelection()) {
            /** @type {?} */
            var deletedValue = this.deleteAndGetElement();
            if (deletedValue) {
                /** @type {?} */
                var restored = Utils.restoreSelection(this.savedSelection);
                if (restored) {
                    if (this.isNumeric(fontName)) {
                        /** @type {?} */
                        var fontFamily = '<span style="font-family: ' + fontName + 'px;">' + deletedValue + '</span>';
                        this.insertHtml(fontFamily);
                    }
                    else {
                        /** @type {?} */
                        var fontFamily = '<span style="font-family: ' + fontName + ';">' + deletedValue + '</span>';
                        this.insertHtml(fontFamily);
                    }
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
    };
    /**
     * insert HTML
     * @param {?} html
     * @return {?}
     */
    CommandExecutorService.prototype.insertHtml = /**
     * insert HTML
     * @param {?} html
     * @return {?}
     */
    function (html) {
        /** @type {?} */
        var isHTMLInserted = document.execCommand('insertHTML', false, html);
        if (!isHTMLInserted) {
            throw new Error('Unable to perform the operation');
        }
        return;
    };
    /**
     * check whether the value is a number or string
     * if number return true
     * else return false
     * @param {?} value
     * @return {?}
     */
    CommandExecutorService.prototype.isNumeric = /**
     * check whether the value is a number or string
     * if number return true
     * else return false
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return /^-{0,1}\d+$/.test(value);
    };
    /**
     * delete the text at selected range and return the value
     * @return {?}
     */
    CommandExecutorService.prototype.deleteAndGetElement = /**
     * delete the text at selected range and return the value
     * @return {?}
     */
    function () {
        /** @type {?} */
        var slectedText;
        if (this.savedSelection) {
            slectedText = this.savedSelection.toString();
            this.savedSelection.deleteContents();
            return slectedText;
        }
        return false;
    };
    /**
     * check any slection is made or not
     * @return {?}
     */
    CommandExecutorService.prototype.checkSelection = /**
     * check any slection is made or not
     * @return {?}
     */
    function () {
        /** @type {?} */
        var slectedText = this.savedSelection.toString();
        if (slectedText.length === 0) {
            throw new Error('No Selection Made');
        }
        return true;
    };
    /**
     * check tag is supported by browser or not
     *
     * @param {?} tag HTML tag
     * @return {?}
     */
    CommandExecutorService.prototype.checkTagSupportInBrowser = /**
     * check tag is supported by browser or not
     *
     * @param {?} tag HTML tag
     * @return {?}
     */
    function (tag) {
        return !(document.createElement(tag) instanceof HTMLUnknownElement);
    };
    CommandExecutorService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CommandExecutorService.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    return CommandExecutorService;
}());
export { CommandExecutorService };
if (false) {
    /**
     * saves the selection from the editor when focussed out
     * @type {?}
     */
    CommandExecutorService.prototype.savedSelection;
    /** @type {?} */
    CommandExecutorService.prototype._http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtZWRpdG9yL2NvbW1vbi9zZXJ2aWNlcy9jb21tYW5kLWV4ZWN1dG9yLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMvRCxPQUFPLEtBQUssS0FBSyxNQUFNLDJCQUEyQixDQUFDOztJQVFqRDs7O09BR0c7SUFDSCxnQ0FBb0IsS0FBaUI7UUFBakIsVUFBSyxHQUFMLEtBQUssQ0FBWTs7Ozs4QkFOZixTQUFTO0tBTVc7SUFFMUM7Ozs7T0FJRzs7Ozs7OztJQUNILHdDQUFPOzs7Ozs7SUFBUCxVQUFRLE9BQWU7UUFFckIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksT0FBTyxLQUFLLHNCQUFzQixFQUFFO1lBQzlELE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztTQUN4QztRQUVELElBQUksT0FBTyxLQUFLLHNCQUFzQixFQUFFO1lBQ3RDLFFBQVEsQ0FBQyxXQUFXLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pELE9BQU87U0FDUjtRQUVELElBQUksT0FBTyxLQUFLLFlBQVksRUFBRTtZQUM1QixRQUFRLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDekQsT0FBTztTQUNSO1FBRUQsSUFBSSxPQUFPLEtBQUssa0JBQWtCLEVBQUU7WUFDbEMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xELE9BQU87U0FDUjtRQUVELFFBQVEsQ0FBQyxXQUFXLENBQUMs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c0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUmVxdWVzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vdXRpbHMvbmd4LWVkaXRvci51dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlIHtcclxuXHJcbiAgLyoqIHNhdmVzIHRoZSBzZWxlY3Rpb24gZnJvbSB0aGUgZWRpdG9yIHdoZW4gZm9jdXNzZWQgb3V0ICovXHJcbiAgc2F2ZWRTZWxlY3Rpb246IGFueSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gX2h0dHAgSFRUUCBDbGllbnQgZm9yIG1ha2luZyBodHRwIHJlcXVlc3RzXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaHR0cDogSHR0cENsaWVudCkgeyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGV4ZWN1dGVzIGNvbW1hbmQgZnJvbSB0aGUgdG9vbGJhclxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvbW1hbmQgY29tbWFuZCB0byBiZSBleGVjdXRlZFxyXG4gICAqL1xyXG4gIGV4ZWN1dGUoY29tbWFuZDogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgaWYgKCF0aGlzLnNhdmVkU2VsZWN0aW9uICYmIGNvbW1hbmQgIT09ICdlbmFibGVPYmplY3RSZXNpemluZycpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgRWRpdG9yJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbW1hbmQgPT09ICdlbmFibGVPYmplY3RSZXNpemluZycpIHtcclxuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2VuYWJsZU9iamVjdFJlc2l6aW5nJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY29tbWFuZCA9PT0gJ2Jsb2NrcXVvdGUnKSB7XHJcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdmb3JtYXRCbG9jaycsIGZhbHNlLCAnYmxvY2txdW90ZScpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbW1hbmQgPT09ICdyZW1vdmVCbG9ja3F1b3RlJykge1xyXG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ2RpdicpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoY29tbWFuZCwgZmFsc2UsIG51bGwpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogaW5zZXJ0cyBpbWFnZSBpbiB0aGUgZWRpdG9yXHJcbiAgICpcclxuICAgKiBAcGFyYW0gaW1hZ2VVUkkgdXJsIG9mIHRoZSBpbWFnZSB0byBiZSBpbnNlcnRlZFxyXG4gICAqL1xyXG4gIGluc2VydEltYWdlKGltYWdlVVJJOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XHJcbiAgICAgIGlmIChpbWFnZVVSSSkge1xyXG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcclxuICAgICAgICBpZiAocmVzdG9yZWQpIHtcclxuICAgICAgICAgIC8vIGNvbnN0IGluc2VydGVkID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydEltYWdlJywgZmFsc2UsIGltYWdlVVJJKTtcclxuICAgICAgICAgIGNvbnN0IGluc2VydGVkID0gdGhpcy5pbnNlcnRIdG1sKGA8YXBwLWltZyBbc3JjXT0ke2ltYWdlVVJJfSBzdHlsZT1cIm1heC13aWR0aDogMTAwJTtcIj48L2FwcC1pbWc+YCk7XHJcbiAgICAgICAgICBpZiAoIWluc2VydGVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBVUkwnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcclxuICAgIH1cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gKiBpbnNlcnRzIGltYWdlIGluIHRoZSBlZGl0b3JcclxuICpcclxuICogQHBhcmFtIHZpZGVQYXJhbXMgdXJsIG9mIHRoZSBpbWFnZSB0byBiZSBpbnNlcnRlZFxyXG4gKi9cclxuICBpbnNlcnRWaWRlbyh2aWRlUGFyYW1zOiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XHJcbiAgICAgIGlmICh2aWRlUGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xyXG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNZb3V0dWJlTGluayh2aWRlUGFyYW1zLnZpZGVvVXJsKSkge1xyXG4gICAgICAgICAgICBjb25zdCB5b3V0dWJlVVJMID0gJzxpZnJhbWUgd2lkdGg9XCInICsgdmlkZVBhcmFtcy53aWR0aCArICdcIiBoZWlnaHQ9XCInICsgdmlkZVBhcmFtcy5oZWlnaHQgKyAnXCInXHJcbiAgICAgICAgICAgICAgKyAnc3JjPVwiJyArIHZpZGVQYXJhbXMudmlkZW9VcmwgKyAnXCI+PC9pZnJhbWU+JztcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKHlvdXR1YmVVUkwpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoZWNrVGFnU3VwcG9ydEluQnJvd3NlcigndmlkZW8nKSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNWYWxpZFVSTCh2aWRlUGFyYW1zLnZpZGVvVXJsKSkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHZpZGVvU3JjID0gJzx2aWRlbyB3aWR0aD1cIicgKyB2aWRlUGFyYW1zLndpZHRoICsgJ1wiIGhlaWdodD1cIicgKyB2aWRlUGFyYW1zLmhlaWdodCArICdcIidcclxuICAgICAgICAgICAgICAgICsgJyBjb250cm9scz1cInRydWVcIj48c291cmNlIHNyYz1cIicgKyB2aWRlUGFyYW1zLnZpZGVvVXJsICsgJ1wiPjwvdmlkZW8+JztcclxuICAgICAgICAgICAgICB0aGlzLmluc2VydEh0bWwodmlkZW9TcmMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2aWRlbyBVUkwnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGluc2VydCB2aWRlbycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2hlY2tzIHRoZSBpbnB1dCB1cmwgaXMgYSB2YWxpZCB5b3V0dWJlIFVSTCBvciBub3RcclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmwgWW91dHVlIFVSTFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaXNZb3V0dWJlTGluayh1cmw6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgeXRSZWdFeHAgPSAvXihodHRwKHMpPzpcXC9cXC8pPygodyl7M30uKT95b3V0dShiZXwuYmUpPyhcXC5jb20pP1xcLy4rLztcclxuICAgIHJldHVybiB5dFJlZ0V4cC50ZXN0KHVybCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjaGVjayB3aGV0aGVyIHRoZSBzdHJpbmcgaXMgYSB2YWxpZCB1cmwgb3Igbm90XHJcbiAgICogQHBhcmFtIHVybCB1cmxcclxuICAgKi9cclxuICBwcml2YXRlIGlzVmFsaWRVUkwodXJsOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHVybFJlZ0V4cCA9IC8oaHR0cHxodHRwcyk6XFwvXFwvKFxcdys6ezAsMX1cXHcqKT8oXFxTKykoOlswLTldKyk/KFxcL3xcXC8oW1xcdyMhOi4/Kz0mJSFcXC1cXC9dKSk/LztcclxuICAgIHJldHVybiB1cmxSZWdFeHAudGVzdCh1cmwpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdXBsb2FkcyBpbWFnZSB0byB0aGUgc2VydmVyXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZmlsZSBmaWxlIHRoYXQgaGFzIHRvIGJlIHVwbG9hZGVkXHJcbiAgICogQHBhcmFtIGVuZFBvaW50IGVucG9pbnQgdG8gd2hpY2ggdGhlIGltYWdlIGhhcyB0byBiZSB1cGxvYWRlZFxyXG4gICAqL1xyXG4gIHVwbG9hZEltYWdlKGZpbGU6IEZpbGUsIGVuZFBvaW50OiBzdHJpbmcpOiBhbnkge1xyXG5cclxuICAgIGlmICghZW5kUG9pbnQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbWFnZSBFbmRwb2ludCBpc25gdCBwcm92aWRlZCBvciBpbnZhbGlkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGE6IEZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcblxyXG4gICAgaWYgKGZpbGUpIHtcclxuXHJcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xyXG5cclxuICAgICAgY29uc3QgcmVxID0gbmV3IEh0dHBSZXF1ZXN0KCdQT1NUJywgZW5kUG9pbnQsIGZvcm1EYXRhLCB7XHJcbiAgICAgICAgcmVwb3J0UHJvZ3Jlc3M6IHRydWVcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5faHR0cC5yZXF1ZXN0KHJlcSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEltYWdlJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBpbnNlcnRzIGxpbmsgaW4gdGhlIGVkaXRvclxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhcmFtcyBwYXJhbWV0ZXJzIHRoYXQgaG9sZHMgdGhlIGluZm9ybWF0aW9uIGZvciB0aGUgbGlua1xyXG4gICAqL1xyXG4gIGNyZWF0ZUxpbmsocGFyYW1zOiBhbnkpOiB2b2lkIHtcclxuXHJcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xyXG4gICAgICAvKipcclxuICAgICAgICogY2hlY2sgd2hldGhlciB0aGUgc2F2ZWQgc2VsZWN0aW9uIGNvbnRhaW5zIGEgcmFuZ2Ugb3IgcGxhaW4gc2VsZWN0aW9uXHJcbiAgICAgICAqL1xyXG4gICAgICBpZiAocGFyYW1zLnVybE5ld1RhYikge1xyXG4gICAgICAgIGNvbnN0IG5ld1VybCA9ICc8YSBocmVmPVwiJyArIHBhcmFtcy51cmxMaW5rICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiPicgKyBwYXJhbXMudXJsVGV4dCArICc8L2E+JztcclxuXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldFNlbGVjdGlvbigpLnR5cGUgIT09ICdSYW5nZScpIHtcclxuICAgICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcclxuICAgICAgICAgIGlmIChyZXN0b3JlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwobmV3VXJsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG5ldyBsaW5rcyBjYW4gYmUgaW5zZXJ0ZWQuIFlvdSBjYW5ub3QgZWRpdCBVUkxgcycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XHJcbiAgICAgICAgaWYgKHJlc3RvcmVkKSB7XHJcbiAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY3JlYXRlTGluaycsIGZhbHNlLCBwYXJhbXMudXJsTGluayk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmdlIG91dCBvZiB0aGUgZWRpdG9yJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogaW5zZXJ0IGNvbG9yIGVpdGhlciBmb250IG9yIGJhY2tncm91bmRcclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb2xvciBjb2xvciB0byBiZSBpbnNlcnRlZFxyXG4gICAqIEBwYXJhbSB3aGVyZSB3aGVyZSB0aGUgY29sb3IgaGFzIHRvIGJlIGluc2VydGVkIGVpdGhlciB0ZXh0L2JhY2tncm91bmRcclxuICAgKi9cclxuICBpbnNlcnRDb2xvcihjb2xvcjogc3RyaW5nLCB3aGVyZTogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24pIHtcclxuICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xyXG4gICAgICBpZiAocmVzdG9yZWQgJiYgdGhpcy5jaGVja1NlbGVjdGlvbigpKSB7XHJcbiAgICAgICAgaWYgKHdoZXJlID09PSAndGV4dENvbG9yJykge1xyXG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2ZvcmVDb2xvcicsIGZhbHNlLCBjb2xvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdoaWxpdGVDb2xvcicsIGZhbHNlLCBjb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHNldCBmb250IHNpemUgZm9yIHRleHRcclxuICAgKlxyXG4gICAqIEBwYXJhbSBmb250U2l6ZSBmb250LXNpemUgdG8gYmUgc2V0XHJcbiAgICovXHJcbiAgc2V0Rm9udFNpemUoZm9udFNpemU6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uICYmIHRoaXMuY2hlY2tTZWxlY3Rpb24oKSkge1xyXG4gICAgICBjb25zdCBkZWxldGVkVmFsdWUgPSB0aGlzLmRlbGV0ZUFuZEdldEVsZW1lbnQoKTtcclxuXHJcbiAgICAgIGlmIChkZWxldGVkVmFsdWUpIHtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xyXG5cclxuICAgICAgICBpZiAocmVzdG9yZWQpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmlzTnVtZXJpYyhmb250U2l6ZSkpIHtcclxuICAgICAgICAgICAgY29uc3QgZm9udFB4ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1zaXplOiAnICsgZm9udFNpemUgKyAncHg7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRQeCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBmb250UHggPSAnPHNwYW4gc3R5bGU9XCJmb250LXNpemU6ICcgKyBmb250U2l6ZSArICc7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRQeCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc2V0IGZvbnQgbmFtZS9mYW1pbHkgZm9yIHRleHRcclxuICAgKlxyXG4gICAqIEBwYXJhbSBmb250TmFtZSBmb250LWZhbWlseSB0byBiZSBzZXRcclxuICAgKi9cclxuICBzZXRGb250TmFtZShmb250TmFtZTogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24gJiYgdGhpcy5jaGVja1NlbGVjdGlvbigpKSB7XHJcbiAgICAgIGNvbnN0IGRlbGV0ZWRWYWx1ZSA9IHRoaXMuZGVsZXRlQW5kR2V0RWxlbWVudCgpO1xyXG5cclxuICAgICAgaWYgKGRlbGV0ZWRWYWx1ZSkge1xyXG5cclxuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XHJcblxyXG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNOdW1lcmljKGZvbnROYW1lKSkge1xyXG4gICAgICAgICAgICBjb25zdCBmb250RmFtaWx5ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1mYW1pbHk6ICcgKyBmb250TmFtZSArICdweDtcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xyXG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoZm9udEZhbWlseSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBmb250RmFtaWx5ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1mYW1pbHk6ICcgKyBmb250TmFtZSArICc7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRGYW1pbHkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBpbnNlcnQgSFRNTCAqL1xyXG4gIHByaXZhdGUgaW5zZXJ0SHRtbChodG1sOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICBjb25zdCBpc0hUTUxJbnNlcnRlZCA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRIVE1MJywgZmFsc2UsIGh0bWwpO1xyXG5cclxuICAgIGlmICghaXNIVE1MSW5zZXJ0ZWQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gcGVyZm9ybSB0aGUgb3BlcmF0aW9uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2hlY2sgd2hldGhlciB0aGUgdmFsdWUgaXMgYSBudW1iZXIgb3Igc3RyaW5nXHJcbiAgICogaWYgbnVtYmVyIHJldHVybiB0cnVlXHJcbiAgICogZWxzZSByZXR1cm4gZmFsc2VcclxuICAgKi9cclxuICBwcml2YXRlIGlzTnVtZXJpYyh2YWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gL14tezAsMX1cXGQrJC8udGVzdCh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICAvKiogZGVsZXRlIHRoZSB0ZXh0IGF0IHNlbGVjdGVkIHJhbmdlIGFuZCByZXR1cm4gdGhlIHZhbHVlICovXHJcbiAgcHJpdmF0ZSBkZWxldGVBbmRHZXRFbGVtZW50KCk6IGFueSB7XHJcblxyXG4gICAgbGV0IHNsZWN0ZWRUZXh0O1xyXG5cclxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XHJcbiAgICAgIHNsZWN0ZWRUZXh0ID0gdGhpcy5zYXZlZFNlbGVjdGlvbi50b1N0cmluZygpO1xyXG4gICAgICB0aGlzLnNhdmVkU2VsZWN0aW9uLmRlbGV0ZUNvbnRlbnRzKCk7XHJcbiAgICAgIHJldHVybiBzbGVjdGVkVGV4dDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqIGNoZWNrIGFueSBzbGVjdGlvbiBpcyBtYWRlIG9yIG5vdCAqL1xyXG4gIHByaXZhdGUgY2hlY2tTZWxlY3Rpb24oKTogYW55IHtcclxuXHJcbiAgICBjb25zdCBzbGVjdGVkVGV4dCA9IHRoaXMuc2F2ZWRTZWxlY3Rpb24udG9TdHJpbmcoKTtcclxuXHJcbiAgICBpZiAoc2xlY3RlZFRleHQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gU2VsZWN0aW9uIE1hZGUnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNoZWNrIHRhZyBpcyBzdXBwb3J0ZWQgYnkgYnJvd3NlciBvciBub3RcclxuICAgKlxyXG4gICAqIEBwYXJhbSB0YWcgSFRNTCB0YWdcclxuICAgKi9cclxuICBwcml2YXRlIGNoZWNrVGFnU3VwcG9ydEluQnJvd3Nlcih0YWc6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICEoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpIGluc3RhbmNlb2YgSFRNTFVua25vd25FbGVtZW50KTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==