import { Injectable, Component, Input, Output, ViewChild, EventEmitter, Renderer2, forwardRef, HostListener, NgModule } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { NG_VALUE_ACCESSOR, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopoverConfig, PopoverModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * enable or disable toolbar based on configuration
 *
 * @param {?} value toolbar item
 * @param {?} toolbar toolbar configuration object
 * @return {?}
 */
function canEnableToolbarOptions(value, toolbar) {
    if (value) {
        if (toolbar['length'] === 0) {
            return true;
        }
        else {
            /** @type {?} */
            const found = toolbar.filter(array => {
                return array.indexOf(value) !== -1;
            });
            return found.length ? true : false;
        }
    }
    else {
        return false;
    }
}
/**
 * set editor configuration
 *
 * @param {?} value configuration via [config] property
 * @param {?} ngxEditorConfig default editor configuration
 * @param {?} input direct configuration inputs via directives
 * @return {?}
 */
function getEditorConfiguration(value, ngxEditorConfig, input) {
    for (const i in ngxEditorConfig) {
        if (i) {
            if (input[i] !== undefined) {
                value[i] = input[i];
            }
            if (!value.hasOwnProperty(i)) {
                value[i] = ngxEditorConfig[i];
            }
        }
    }
    return value;
}
/**
 * return vertical if the element is the resizer property is set to basic
 *
 * @param {?} resizer type of resizer, either basic or stack
 * @return {?}
 */
function canResize(resizer) {
    if (resizer === 'basic') {
        return 'vertical';
    }
    return false;
}
/**
 * save selection when the editor is focussed out
 * @return {?}
 */
function saveSelection() {
    if (window.getSelection) {
        /** @type {?} */
        const sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    }
    else if (document.getSelection && document.createRange) {
        return document.createRange();
    }
    return null;
}
/**
 * restore selection when the editor is focussed in
 *
 * @param {?} range saved selection when the editor is focussed out
 * @return {?}
 */
function restoreSelection(range) {
    if (range) {
        if (window.getSelection) {
            /** @type {?} */
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            return true;
        }
        else if (document.getSelection && range.select) {
            range.select();
            return true;
        }
    }
    else {
        return false;
    }
}

var Utils = /*#__PURE__*/Object.freeze({
    canEnableToolbarOptions: canEnableToolbarOptions,
    getEditorConfiguration: getEditorConfiguration,
    canResize: canResize,
    saveSelection: saveSelection,
    restoreSelection: restoreSelection
});

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class CommandExecutorService {
    /**
     *
     * @param {?} _http HTTP Client for making http requests
     */
    constructor(_http) {
        this._http = _http;
        /**
         * saves the selection from the editor when focussed out
         */
        this.savedSelection = undefined;
    }
    /**
     * executes command from the toolbar
     *
     * @param {?} command command to be executed
     * @return {?}
     */
    execute(command) {
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
    }
    /**
     * inserts image in the editor
     *
     * @param {?} imageURI url of the image to be inserted
     * @return {?}
     */
    insertImage(imageURI) {
        if (this.savedSelection) {
            if (imageURI) {
                /** @type {?} */
                const restored = restoreSelection(this.savedSelection);
                if (restored) {
                    /** @type {?} */
                    const inserted = this.insertHtml(`<app-img [src]=${imageURI} style="max-width: 100%;"></app-img>`);
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
    }
    /**
     * inserts image in the editor
     *
     * @param {?} videParams url of the image to be inserted
     * @return {?}
     */
    insertVideo(videParams) {
        if (this.savedSelection) {
            if (videParams) {
                /** @type {?} */
                const restored = restoreSelection(this.savedSelection);
                if (restored) {
                    if (this.isYoutubeLink(videParams.videoUrl)) {
                        /** @type {?} */
                        const youtubeURL = '<iframe width="' + videParams.width + '" height="' + videParams.height + '"'
                            + 'src="' + videParams.videoUrl + '"></iframe>';
                        this.insertHtml(youtubeURL);
                    }
                    else if (this.checkTagSupportInBrowser('video')) {
                        if (this.isValidURL(videParams.videoUrl)) {
                            /** @type {?} */
                            const videoSrc = '<video width="' + videParams.width + '" height="' + videParams.height + '"'
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
    }
    /**
     * checks the input url is a valid youtube URL or not
     *
     * @param {?} url Youtue URL
     * @return {?}
     */
    isYoutubeLink(url) {
        /** @type {?} */
        const ytRegExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
        return ytRegExp.test(url);
    }
    /**
     * check whether the string is a valid url or not
     * @param {?} url url
     * @return {?}
     */
    isValidURL(url) {
        /** @type {?} */
        const urlRegExp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        return urlRegExp.test(url);
    }
    /**
     * uploads image to the server
     *
     * @param {?} file file that has to be uploaded
     * @param {?} endPoint enpoint to which the image has to be uploaded
     * @return {?}
     */
    uploadImage(file, endPoint) {
        if (!endPoint) {
            throw new Error('Image Endpoint isn`t provided or invalid');
        }
        /** @type {?} */
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
            /** @type {?} */
            const req = new HttpRequest('POST', endPoint, formData, {
                reportProgress: true
            });
            return this._http.request(req);
        }
        else {
            throw new Error('Invalid Image');
        }
    }
    /**
     * inserts link in the editor
     *
     * @param {?} params parameters that holds the information for the link
     * @return {?}
     */
    createLink(params) {
        if (this.savedSelection) {
            /**
                   * check whether the saved selection contains a range or plain selection
                   */
            if (params.urlNewTab) {
                /** @type {?} */
                const newUrl = '<a href="' + params.urlLink + '" target="_blank">' + params.urlText + '</a>';
                if (document.getSelection().type !== 'Range') {
                    /** @type {?} */
                    const restored = restoreSelection(this.savedSelection);
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
                const restored = restoreSelection(this.savedSelection);
                if (restored) {
                    document.execCommand('createLink', false, params.urlLink);
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
        return;
    }
    /**
     * insert color either font or background
     *
     * @param {?} color color to be inserted
     * @param {?} where where the color has to be inserted either text/background
     * @return {?}
     */
    insertColor(color, where) {
        if (this.savedSelection) {
            /** @type {?} */
            const restored = restoreSelection(this.savedSelection);
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
    }
    /**
     * set font size for text
     *
     * @param {?} fontSize font-size to be set
     * @return {?}
     */
    setFontSize(fontSize) {
        if (this.savedSelection && this.checkSelection()) {
            /** @type {?} */
            const deletedValue = this.deleteAndGetElement();
            if (deletedValue) {
                /** @type {?} */
                const restored = restoreSelection(this.savedSelection);
                if (restored) {
                    if (this.isNumeric(fontSize)) {
                        /** @type {?} */
                        const fontPx = '<span style="font-size: ' + fontSize + 'px;">' + deletedValue + '</span>';
                        this.insertHtml(fontPx);
                    }
                    else {
                        /** @type {?} */
                        const fontPx = '<span style="font-size: ' + fontSize + ';">' + deletedValue + '</span>';
                        this.insertHtml(fontPx);
                    }
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
    }
    /**
     * set font name/family for text
     *
     * @param {?} fontName font-family to be set
     * @return {?}
     */
    setFontName(fontName) {
        if (this.savedSelection && this.checkSelection()) {
            /** @type {?} */
            const deletedValue = this.deleteAndGetElement();
            if (deletedValue) {
                /** @type {?} */
                const restored = restoreSelection(this.savedSelection);
                if (restored) {
                    if (this.isNumeric(fontName)) {
                        /** @type {?} */
                        const fontFamily = '<span style="font-family: ' + fontName + 'px;">' + deletedValue + '</span>';
                        this.insertHtml(fontFamily);
                    }
                    else {
                        /** @type {?} */
                        const fontFamily = '<span style="font-family: ' + fontName + ';">' + deletedValue + '</span>';
                        this.insertHtml(fontFamily);
                    }
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
    }
    /**
     * insert HTML
     * @param {?} html
     * @return {?}
     */
    insertHtml(html) {
        /** @type {?} */
        const isHTMLInserted = document.execCommand('insertHTML', false, html);
        if (!isHTMLInserted) {
            throw new Error('Unable to perform the operation');
        }
        return;
    }
    /**
     * check whether the value is a number or string
     * if number return true
     * else return false
     * @param {?} value
     * @return {?}
     */
    isNumeric(value) {
        return /^-{0,1}\d+$/.test(value);
    }
    /**
     * delete the text at selected range and return the value
     * @return {?}
     */
    deleteAndGetElement() {
        /** @type {?} */
        let slectedText;
        if (this.savedSelection) {
            slectedText = this.savedSelection.toString();
            this.savedSelection.deleteContents();
            return slectedText;
        }
        return false;
    }
    /**
     * check any slection is made or not
     * @return {?}
     */
    checkSelection() {
        /** @type {?} */
        const slectedText = this.savedSelection.toString();
        if (slectedText.length === 0) {
            throw new Error('No Selection Made');
        }
        return true;
    }
    /**
     * check tag is supported by browser or not
     *
     * @param {?} tag HTML tag
     * @return {?}
     */
    checkTagSupportInBrowser(tag) {
        return !(document.createElement(tag) instanceof HTMLUnknownElement);
    }
}
CommandExecutorService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CommandExecutorService.ctorParameters = () => [
    { type: HttpClient }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * time in which the message has to be cleared
  @type {?} */
const DURATION = 7000;
class MessageService {
    constructor() {
        /**
         * variable to hold the user message
         */
        this.message = new Subject();
    }
    /**
     * returns the message sent by the editor
     * @return {?}
     */
    getMessage() {
        return this.message.asObservable();
    }
    /**
     * sends message to the editor
     *
     * @param {?} message message to be sent
     * @return {?}
     */
    sendMessage(message) {
        this.message.next(message);
        this.clearMessageIn(DURATION);
        return;
    }
    /**
     * a short interval to clear message
     *
     * @param {?} milliseconds time in seconds in which the message has to be cleared
     * @return {?}
     */
    clearMessageIn(milliseconds) {
        setTimeout(() => {
            this.message.next(undefined);
        }, milliseconds);
        return;
    }
}
MessageService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MessageService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * toolbar default configuration
  @type {?} */
const ngxEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    imageEndPoint: '',
    toolbar: [
        ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'],
        ['fontName', 'fontSize', 'color'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
        ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
        ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
        ['link', 'unlink', 'image', 'video']
    ]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxEditorComponent {
    /**
     * @param {?} _messageService service to send message to the editor message component
     * @param {?} _commandExecutor executes command from the toolbar
     * @param {?} _renderer access and manipulate the dom element
     */
    constructor(_messageService, _commandExecutor, _renderer) {
        this._messageService = _messageService;
        this._commandExecutor = _commandExecutor;
        this._renderer = _renderer;
        /**
         * The editor can be resized vertically.
         *
         * `basic` resizer enables the html5 reszier. Check here https://www.w3schools.com/cssref/css3_pr_resize.asp
         *
         * `stack` resizer enable a resizer that looks like as if in https://stackoverflow.com
         */
        this.resizer = 'stack';
        /**
         * The config property is a JSON object
         *
         * All avaibale inputs inputs can be provided in the configuration as JSON
         * inputs provided directly are considered as top priority
         */
        this.config = ngxEditorConfig;
        /**
         * emits `blur` event when focused out from the textarea
         */
        this.blur = new EventEmitter();
        /**
         * emits `focus` event when focused in to the textarea
         */
        this.focus = new EventEmitter();
        this.Utils = Utils;
    }
    /**
     * events
     * @return {?}
     */
    onTextAreaFocus() {
        this.focus.emit('focus');
        return;
    }
    /**
     * focus the text area when the editor is focussed
     * @return {?}
     */
    onEditorFocus() {
        this.textArea.nativeElement.focus();
    }
    /**
     * Executed from the contenteditable section while the input property changes
     * @param {?} html html string from contenteditable
     * @return {?}
     */
    onContentChange(html) {
        if (typeof this.onChange === 'function') {
            this.onChange(html);
            this.togglePlaceholder(html);
        }
        return;
    }
    /**
     * @return {?}
     */
    onTextAreaBlur() {
        /** save selection if focussed out */
        this._commandExecutor.savedSelection = saveSelection();
        if (typeof this.onTouched === 'function') {
            this.onTouched();
        }
        this.blur.emit('blur');
        return;
    }
    /**
     * resizing text area
     *
     * @param {?} offsetY vertical height of the eidtable portion of the editor
     * @return {?}
     */
    resizeTextArea(offsetY) {
        /** @type {?} */
        let newHeight = parseInt(this.height, 10);
        newHeight += offsetY;
        this.height = newHeight + 'px';
        this.textArea.nativeElement.style.height = this.height;
        return;
    }
    /**
     * editor actions, i.e., executes command from toolbar
     *
     * @param {?} commandName name of the command to be executed
     * @return {?}
     */
    executeCommand(commandName) {
        try {
            this._commandExecutor.execute(commandName);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        return;
    }
    /**
     * Write a new value to the element.
     *
     * @param {?} value value to be executed when there is a change in contenteditable
     * @return {?}
     */
    writeValue(value) {
        this.togglePlaceholder(value);
        if (value === null || value === undefined || value === '' || value === '<br>') {
            value = null;
        }
        this.refreshView(value);
    }
    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * refresh view/HTML of the editor
     *
     * @param {?} value html string from the editor
     * @return {?}
     */
    refreshView(value) {
        /** @type {?} */
        const normalizedValue = value === null ? '' : value;
        this._renderer.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);
        return;
    }
    /**
     * toggles placeholder based on input string
     *
     * @param {?} value A HTML string from the editor
     * @return {?}
     */
    togglePlaceholder(value) {
        if (!value || value === '<br>' || value === '') {
            this._renderer.addClass(this.ngxWrapper.nativeElement, 'show-placeholder');
        }
        else {
            this._renderer.removeClass(this.ngxWrapper.nativeElement, 'show-placeholder');
        }
        return;
    }
    /**
     * returns a json containing input params
     * @return {?}
     */
    getCollectiveParams() {
        return {
            editable: this.editable,
            spellcheck: this.spellcheck,
            placeholder: this.placeholder,
            translate: this.translate,
            height: this.height,
            minHeight: this.minHeight,
            width: this.width,
            minWidth: this.minWidth,
            enableToolbar: this.enableToolbar,
            showToolbar: this.showToolbar,
            imageEndPoint: this.imageEndPoint,
            toolbar: this.toolbar
        };
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        /**
             * set configuartion
             */
        this.config = this.Utils.getEditorConfiguration(this.config, ngxEditorConfig, this.getCollectiveParams());
        this.height = this.height || this.textArea.nativeElement.offsetHeight;
        this.executeCommand('enableObjectResizing');
    }
}
NgxEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-ngx-editor',
                template: "<div class=\"ngx-editor\" id=\"ngxEditor\" [style.width]=\"config['width']\" [style.minWidth]=\"config['minWidth']\" tabindex=\"0\"\r\n  (focus)=\"onEditorFocus()\">\r\n\r\n  <app-ngx-editor-toolbar [config]=\"config\" (execute)=\"executeCommand($event)\"></app-ngx-editor-toolbar>\r\n\r\n  <!-- text area -->\r\n  <div class=\"ngx-wrapper\" #ngxWrapper>\r\n    <div class=\"ngx-editor-textarea\" [attr.contenteditable]=\"config['editable']\" (input)=\"onContentChange($event.target.innerHTML)\"\r\n      [attr.translate]=\"config['translate']\" [attr.spellcheck]=\"config['spellcheck']\" [style.height]=\"config['height']\"\r\n      [style.minHeight]=\"config['minHeight']\" [style.resize]=\"Utils?.canResize(resizer)\" (focus)=\"onTextAreaFocus()\"\r\n      (blur)=\"onTextAreaBlur()\" #ngxTextArea></div>\r\n\r\n    <span class=\"ngx-editor-placeholder\">{{ placeholder || config['placeholder'] }}</span>\r\n  </div>\r\n\r\n  <app-ngx-editor-message></app-ngx-editor-message>\r\n  <app-ngx-grippie *ngIf=\"resizer === 'stack'\"></app-ngx-grippie>\r\n\r\n</div>\r\n",
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NgxEditorComponent),
                        multi: true
                    }
                ],
                styles: [".ngx-editor{position:relative}.ngx-editor ::ng-deep [contenteditable=true]:empty:before{content:attr(placeholder);display:block;color:#868e96;opacity:1}.ngx-editor .ngx-wrapper{position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea{min-height:5rem;padding:.5rem .8rem 1rem;border:1px solid #ddd;background-color:transparent;overflow-x:hidden;overflow-y:auto;z-index:2;position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea.focus,.ngx-editor .ngx-wrapper .ngx-editor-textarea:focus{outline:0}.ngx-editor .ngx-wrapper .ngx-editor-textarea ::ng-deep blockquote{margin-left:1rem;border-left:.2em solid #dfe2e5;padding-left:.5rem}.ngx-editor .ngx-wrapper ::ng-deep p{margin-bottom:0}.ngx-editor .ngx-wrapper .ngx-editor-placeholder{display:none;position:absolute;top:0;padding:.5rem .8rem 1rem .9rem;z-index:1;color:#6c757d;opacity:1}.ngx-editor .ngx-wrapper.show-placeholder .ngx-editor-placeholder{display:block}"]
            }] }
];
/** @nocollapse */
NgxEditorComponent.ctorParameters = () => [
    { type: MessageService },
    { type: CommandExecutorService },
    { type: Renderer2 }
];
NgxEditorComponent.propDecorators = {
    editable: [{ type: Input }],
    spellcheck: [{ type: Input }],
    placeholder: [{ type: Input }],
    translate: [{ type: Input }],
    height: [{ type: Input }],
    minHeight: [{ type: Input }],
    width: [{ type: Input }],
    minWidth: [{ type: Input }],
    toolbar: [{ type: Input }],
    resizer: [{ type: Input }],
    config: [{ type: Input }],
    showToolbar: [{ type: Input }],
    enableToolbar: [{ type: Input }],
    imageEndPoint: [{ type: Input }],
    blur: [{ type: Output }],
    focus: [{ type: Output }],
    textArea: [{ type: ViewChild, args: ['ngxTextArea',] }],
    ngxWrapper: [{ type: ViewChild, args: ['ngxWrapper',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxGrippieComponent {
    /**
     * Constructor
     *
     * @param {?} _editorComponent Editor component
     */
    constructor(_editorComponent) {
        this._editorComponent = _editorComponent;
        /**
         * previous value befor resizing the editor
         */
        this.oldY = 0;
        /**
         * set to true on mousedown event
         */
        this.grabber = false;
    }
    /**
     *
     * @param {?} event Mouseevent
     *
     * Update the height of the editor when the grabber is dragged
     * @return {?}
     */
    onMouseMove(event) {
        if (!this.grabber) {
            return;
        }
        this._editorComponent.resizeTextArea(event.clientY - this.oldY);
        this.oldY = event.clientY;
    }
    /**
     *
     * @param {?} event Mouseevent
     *
     * set the grabber to false on mouse up action
     * @return {?}
     */
    onMouseUp(event) {
        this.grabber = false;
    }
    /**
     * @param {?} event
     * @param {?=} resizer
     * @return {?}
     */
    onResize(event, resizer) {
        this.grabber = true;
        this.oldY = event.clientY;
        event.preventDefault();
    }
}
NgxGrippieComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-ngx-grippie',
                template: "<div class=\"ngx-editor-grippie\">\r\n  <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"isolation:isolate\" viewBox=\"651.6 235 26 5\"\r\n    width=\"26\" height=\"5\">\r\n    <g id=\"sprites\">\r\n      <path d=\" M 651.6 235 L 653.6 235 L 653.6 237 L 651.6 237 M 654.6 238 L 656.6 238 L 656.6 240 L 654.6 240 M 660.6 238 L 662.6 238 L 662.6 240 L 660.6 240 M 666.6 238 L 668.6 238 L 668.6 240 L 666.6 240 M 672.6 238 L 674.6 238 L 674.6 240 L 672.6 240 M 657.6 235 L 659.6 235 L 659.6 237 L 657.6 237 M 663.6 235 L 665.6 235 L 665.6 237 L 663.6 237 M 669.6 235 L 671.6 235 L 671.6 237 L 669.6 237 M 675.6 235 L 677.6 235 L 677.6 237 L 675.6 237\"\r\n        fill=\"rgb(147,153,159)\" />\r\n    </g>\r\n  </svg>\r\n</div>\r\n",
                styles: [".ngx-editor-grippie{height:9px;background-color:#f1f1f1;position:relative;text-align:center;cursor:s-resize;border:1px solid #ddd;border-top:transparent}.ngx-editor-grippie svg{position:absolute;top:1.5px;width:50%;right:25%}"]
            }] }
];
/** @nocollapse */
NgxGrippieComponent.ctorParameters = () => [
    { type: NgxEditorComponent }
];
NgxGrippieComponent.propDecorators = {
    onMouseMove: [{ type: HostListener, args: ['document:mousemove', ['$event'],] }],
    onMouseUp: [{ type: HostListener, args: ['document:mouseup', ['$event'],] }],
    onResize: [{ type: HostListener, args: ['mousedown', ['$event'],] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxEditorMessageComponent {
    /**
     * @param {?} _messageService service to send message to the editor
     */
    constructor(_messageService) {
        this._messageService = _messageService;
        /**
         * property that holds the message to be displayed on the editor
         */
        this.ngxMessage = undefined;
        this._messageService.getMessage().subscribe((message) => this.ngxMessage = message);
    }
    /**
     * clears editor message
     * @return {?}
     */
    clearMessage() {
        this.ngxMessage = undefined;
        return;
    }
}
NgxEditorMessageComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-ngx-editor-message',
                template: "<div class=\"ngx-editor-message\" *ngIf=\"ngxMessage\" (dblclick)=\"clearMessage()\">\r\n  {{ ngxMessage }}\r\n</div>\r\n",
                styles: [".ngx-editor-message{font-size:80%;background-color:#f1f1f1;border:1px solid #ddd;border-top:transparent;padding:0 .5rem .1rem;transition:.5s ease-in}"]
            }] }
];
/** @nocollapse */
NgxEditorMessageComponent.ctorParameters = () => [
    { type: MessageService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxEditorToolbarComponent {
    /**
     * @param {?} _popOverConfig
     * @param {?} _formBuilder
     * @param {?} _messageService
     * @param {?} _commandExecutorService
     */
    constructor(_popOverConfig, _formBuilder, _messageService, _commandExecutorService) {
        this._popOverConfig = _popOverConfig;
        this._formBuilder = _formBuilder;
        this._messageService = _messageService;
        this._commandExecutorService = _commandExecutorService;
        /**
         * set to false when image is being uploaded
         */
        this.uploadComplete = true;
        /**
         * upload percentage
         */
        this.updloadPercentage = 0;
        /**
         * set to true when the image is being uploaded
         */
        this.isUploading = false;
        /**
         * which tab to active for color insetion
         */
        this.selectedColorTab = 'textColor';
        /**
         * font family name
         */
        this.fontName = '';
        /**
         * font size
         */
        this.fontSize = '';
        /**
         * hex color code
         */
        this.hexColor = '';
        /**
         * show/hide image uploader
         */
        this.isImageUploader = false;
        /**
         * Emits an event when a toolbar button is clicked
         */
        this.execute = new EventEmitter();
        this._popOverConfig.outsideClick = true;
        this._popOverConfig.placement = 'bottom';
        this._popOverConfig.container = 'body';
    }
    /**
     * enable or diable toolbar based on configuration
     *
     * @param {?} value name of the toolbar buttons
     * @return {?}
     */
    canEnableToolbarOptions(value) {
        return canEnableToolbarOptions(value, this.config['toolbar']);
    }
    /**
     * triggers command from the toolbar to be executed and emits an event
     *
     * @param {?} command name of the command to be executed
     * @return {?}
     */
    triggerCommand(command) {
        this.execute.emit(command);
    }
    /**
     * create URL insert form
     * @return {?}
     */
    buildUrlForm() {
        this.urlForm = this._formBuilder.group({
            urlLink: ['', [Validators.required]],
            urlText: ['', [Validators.required]],
            urlNewTab: [true]
        });
        return;
    }
    /**
     * inserts link in the editor
     * @return {?}
     */
    insertLink() {
        try {
            this._commandExecutorService.createLink(this.urlForm.value);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        /** reset form to default */
        this.buildUrlForm();
        /** close inset URL pop up */
        this.urlPopover.hide();
        return;
    }
    /**
     * create insert image form
     * @return {?}
     */
    buildImageForm() {
        this.imageForm = this._formBuilder.group({
            imageUrl: ['', [Validators.required]]
        });
        return;
    }
    /**
     * create insert image form
     * @return {?}
     */
    buildVideoForm() {
        this.videoForm = this._formBuilder.group({
            videoUrl: ['', [Validators.required]],
            height: [''],
            width: ['']
        });
        return;
    }
    /**
     * Executed when file is selected
     *
     * @param {?} e onChange event
     * @return {?}
     */
    onFileChange(e) {
        this.uploadComplete = false;
        this.isUploading = true;
        if (e.target.files.length > 0) {
            /** @type {?} */
            const file = e.target.files[0];
            try {
                this._commandExecutorService.uploadImage(file, this.config.imageEndPoint).subscribe(event => {
                    if (event.type) {
                        this.updloadPercentage = Math.round(100 * event.loaded / event.total);
                    }
                    if (event instanceof HttpResponse) {
                        try {
                            this._commandExecutorService.insertImage(event.body.url);
                        }
                        catch (error) {
                            this._messageService.sendMessage(error.message);
                        }
                        this.uploadComplete = true;
                        this.isUploading = false;
                    }
                });
            }
            catch (error) {
                this._messageService.sendMessage(error.message);
                this.uploadComplete = true;
                this.isUploading = false;
            }
        }
        return;
    }
    /**
     * insert image in the editor
     * @return {?}
     */
    insertImage() {
        try {
            this._commandExecutorService.insertImage(this.imageForm.value.imageUrl);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        /** reset form to default */
        this.buildImageForm();
        /** close inset URL pop up */
        this.imagePopover.hide();
        return;
    }
    /**
     * insert image in the editor
     * @return {?}
     */
    insertVideo() {
        try {
            this._commandExecutorService.insertVideo(this.videoForm.value);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        /** reset form to default */
        this.buildVideoForm();
        /** close inset URL pop up */
        this.videoPopover.hide();
        return;
    }
    /**
     * inser text/background color
     * @param {?} color
     * @param {?} where
     * @return {?}
     */
    insertColor(color, where) {
        try {
            this._commandExecutorService.insertColor(color, where);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        this.colorPopover.hide();
        return;
    }
    /**
     * set font size
     * @param {?} fontSize
     * @return {?}
     */
    setFontSize(fontSize) {
        try {
            this._commandExecutorService.setFontSize(fontSize);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        this.fontSizePopover.hide();
        return;
    }
    /**
     * set font Name/family
     * @param {?} fontName
     * @return {?}
     */
    setFontName(fontName) {
        try {
            this._commandExecutorService.setFontName(fontName);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        this.fontSizePopover.hide();
        return;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.buildUrlForm();
        this.buildImageForm();
        this.buildVideoForm();
    }
}
NgxEditorToolbarComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-ngx-editor-toolbar',
                template: "<div class=\"ngx-toolbar\" *ngIf=\"config['showToolbar']\">\r\n  <div class=\"ngx-toolbar-set\">\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('bold')\" (click)=\"triggerCommand('bold')\"\r\n      title=\"Bold\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-bold\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('italic')\" (click)=\"triggerCommand('italic')\"\r\n      title=\"Italic\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-italic\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('underline')\" (click)=\"triggerCommand('underline')\"\r\n      title=\"Underline\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-underline\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('strikeThrough')\" (click)=\"triggerCommand('strikeThrough')\"\r\n      title=\"Strikethrough\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-strikethrough\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('superscript')\" (click)=\"triggerCommand('superscript')\"\r\n      title=\"Superscript\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-superscript\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('subscript')\" (click)=\"triggerCommand('subscript')\"\r\n      title=\"Subscript\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-subscript\" aria-hidden=\"true\"></i>\r\n    </button>\r\n  </div>\r\n  <div class=\"ngx-toolbar-set\">\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontName')\" (click)=\"fontName = ''\"\r\n      title=\"Font Family\" [popover]=\"fontNameTemplate\" #fontNamePopover=\"bs-popover\" containerClass=\"ngxePopover\"\r\n      [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-font\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontSize')\" (click)=\"fontSize = ''\"\r\n      title=\"Font Size\" [popover]=\"fontSizeTemplate\" #fontSizePopover=\"bs-popover\" containerClass=\"ngxePopover\"\r\n      [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-text-height\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('color')\" (click)=\"hexColor = ''\"\r\n      title=\"Color Picker\" [popover]=\"insertColorTemplate\" #colorPopover=\"bs-popover\" containerClass=\"ngxePopover\"\r\n      [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-tint\" aria-hidden=\"true\"></i>\r\n    </button>\r\n  </div>\r\n  <div class=\"ngx-toolbar-set\">\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyLeft')\" (click)=\"triggerCommand('justifyLeft')\"\r\n      title=\"Justify Left\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-align-left\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyCenter')\" (click)=\"triggerCommand('justifyCenter')\"\r\n      title=\"Justify Center\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-align-center\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyRight')\" (click)=\"triggerCommand('justifyRight')\"\r\n      title=\"Justify Right\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-align-right\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyFull')\" (click)=\"triggerCommand('justifyFull')\"\r\n      title=\"Justify\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-align-justify\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('indent')\" (click)=\"triggerCommand('indent')\"\r\n      title=\"Indent\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-indent\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('outdent')\" (click)=\"triggerCommand('outdent')\"\r\n      title=\"Outdent\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-outdent\" aria-hidden=\"true\"></i>\r\n    </button>\r\n  </div>\r\n  <div class=\"ngx-toolbar-set\">\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('cut')\" (click)=\"triggerCommand('cut')\"\r\n      title=\"Cut\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-scissors\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('copy')\" (click)=\"triggerCommand('copy')\"\r\n      title=\"Copy\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-files-o\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('delete')\" (click)=\"triggerCommand('delete')\"\r\n      title=\"Delete\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-trash\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeFormat')\" (click)=\"triggerCommand('removeFormat')\"\r\n      title=\"Clear Formatting\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-eraser\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('undo')\" (click)=\"triggerCommand('undo')\"\r\n      title=\"Undo\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-undo\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('redo')\" (click)=\"triggerCommand('redo')\"\r\n      title=\"Redo\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-repeat\" aria-hidden=\"true\"></i>\r\n    </button>\r\n  </div>\r\n  <div class=\"ngx-toolbar-set\">\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('paragraph')\" (click)=\"triggerCommand('insertParagraph')\"\r\n      title=\"Paragraph\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-paragraph\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('blockquote')\" (click)=\"triggerCommand('blockquote')\"\r\n      title=\"Blockquote\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-quote-left\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeBlockquote')\" (click)=\"triggerCommand('removeBlockquote')\"\r\n      title=\"Remove Blockquote\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-quote-right\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('horizontalLine')\" (click)=\"triggerCommand('insertHorizontalRule')\"\r\n      title=\"Horizontal Line\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-minus\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unorderedList')\" (click)=\"triggerCommand('insertUnorderedList')\"\r\n      title=\"Unordered List\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-list-ul\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('orderedList')\" (click)=\"triggerCommand('insertOrderedList')\"\r\n      title=\"Ordered List\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-list-ol\" aria-hidden=\"true\"></i>\r\n    </button>\r\n  </div>\r\n  <div class=\"ngx-toolbar-set\">\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('link')\" (click)=\"buildUrlForm()\"\r\n      [popover]=\"insertLinkTemplate\" title=\"Insert Link\" #urlPopover=\"bs-popover\" containerClass=\"ngxePopover\"\r\n      [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-link\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unlink')\" (click)=\"triggerCommand('unlink')\"\r\n      title=\"Unlink\" [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-chain-broken\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('image')\" (click)=\"buildImageForm()\"\r\n      title=\"Insert Image\" [popover]=\"insertImageTemplate\" #imagePopover=\"bs-popover\" containerClass=\"ngxePopover\"\r\n      [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i>\r\n    </button>\r\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('video')\" (click)=\"buildVideoForm()\"\r\n      title=\"Insert Video\" [popover]=\"insertVideoTemplate\" #videoPopover=\"bs-popover\" containerClass=\"ngxePopover\"\r\n      [disabled]=\"!config['enableToolbar']\">\r\n      <i class=\"fa fa-youtube-play\" aria-hidden=\"true\"></i>\r\n    </button>\r\n  </div>\r\n</div>\r\n\r\n<!-- URL Popover template -->\r\n<ng-template #insertLinkTemplate>\r\n  <div class=\"ngxe-popover extra-gt\">\r\n    <form [formGroup]=\"urlForm\" (ngSubmit)=\"urlForm.valid && insertLink()\" autocomplete=\"off\">\r\n      <div class=\"form-group\">\r\n        <label for=\"urlInput\" class=\"small\">URL</label>\r\n        <input type=\"text\" class=\"form-control-sm\" id=\"URLInput\" placeholder=\"URL\" formControlName=\"urlLink\" required>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label for=\"urlTextInput\" class=\"small\">Text</label>\r\n        <input type=\"text\" class=\"form-control-sm\" id=\"urlTextInput\" placeholder=\"Text\" formControlName=\"urlText\"\r\n          required>\r\n      </div>\r\n      <div class=\"form-check\">\r\n        <input type=\"checkbox\" class=\"form-check-input\" id=\"urlNewTab\" formControlName=\"urlNewTab\">\r\n        <label class=\"form-check-label\" for=\"urlNewTab\">Open in new tab</label>\r\n      </div>\r\n      <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\r\n    </form>\r\n  </div>\r\n</ng-template>\r\n\r\n<!-- Image Uploader Popover template -->\r\n<ng-template #insertImageTemplate>\r\n  <div class=\"ngxe-popover imgc-ctnr\">\r\n    <div class=\"imgc-topbar btn-ctnr\">\r\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: isImageUploader}\" (click)=\"isImageUploader = true\">\r\n        <i class=\"fa fa-upload\"></i>\r\n      </button>\r\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: !isImageUploader}\" (click)=\"isImageUploader = false\">\r\n        <i class=\"fa fa-link\"></i>\r\n      </button>\r\n    </div>\r\n    <div class=\"imgc-ctnt is-image\">\r\n      <div *ngIf=\"isImageUploader; else insertImageLink\"> </div>\r\n      <div *ngIf=\"!isImageUploader; else imageUploder\"> </div>\r\n      <ng-template #imageUploder>\r\n        <div class=\"ngx-insert-img-ph\">\r\n          <p *ngIf=\"uploadComplete\">Choose Image</p>\r\n          <p *ngIf=\"!uploadComplete\">\r\n            <span>Uploading Image</span>\r\n            <br>\r\n            <span>{{ updloadPercentage }} %</span>\r\n          </p>\r\n          <div class=\"ngxe-img-upl-frm\">\r\n            <input type=\"file\" (change)=\"onFileChange($event)\" accept=\"image/*\" [disabled]=\"isUploading\" [style.cursor]=\"isUploading ? 'not-allowed': 'allowed'\">\r\n          </div>\r\n        </div>\r\n      </ng-template>\r\n      <ng-template #insertImageLink>\r\n        <form class=\"extra-gt\" [formGroup]=\"imageForm\" (ngSubmit)=\"imageForm.valid && insertImage()\" autocomplete=\"off\">\r\n          <div class=\"form-group\">\r\n            <label for=\"imageURLInput\" class=\"small\">URL</label>\r\n            <input type=\"text\" class=\"form-control-sm\" id=\"imageURLInput\" placeholder=\"URL\" formControlName=\"imageUrl\"\r\n              required>\r\n          </div>\r\n          <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\r\n        </form>\r\n      </ng-template>\r\n      <div class=\"progress\" *ngIf=\"!uploadComplete\">\r\n        <div class=\"progress-bar progress-bar-striped progress-bar-animated bg-success\" [ngClass]=\"{'bg-danger': updloadPercentage<20, 'bg-warning': updloadPercentage<50, 'bg-success': updloadPercentage>=100}\"\r\n          [style.width.%]=\"updloadPercentage\"></div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</ng-template>\r\n\r\n\r\n<!-- Insert Video Popover template -->\r\n<ng-template #insertVideoTemplate>\r\n  <div class=\"ngxe-popover imgc-ctnr\">\r\n    <div class=\"imgc-topbar btn-ctnr\">\r\n      <button type=\"button\" class=\"btn active\">\r\n        <i class=\"fa fa-link\"></i>\r\n      </button>\r\n    </div>\r\n    <div class=\"imgc-ctnt is-image\">\r\n      <form class=\"extra-gt\" [formGroup]=\"videoForm\" (ngSubmit)=\"videoForm.valid && insertVideo()\" autocomplete=\"off\">\r\n        <div class=\"form-group\">\r\n          <label for=\"videoURLInput\" class=\"small\">URL</label>\r\n          <input type=\"text\" class=\"form-control-sm\" id=\"videoURLInput\" placeholder=\"URL\" formControlName=\"videoUrl\"\r\n            required>\r\n        </div>\r\n        <div class=\"row form-group\">\r\n          <div class=\"col\">\r\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"height\" placeholder=\"height (px)\" pattern=\"[0-9]\">\r\n          </div>\r\n          <div class=\"col\">\r\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"width\" placeholder=\"width (px)\" pattern=\"[0-9]\">\r\n          </div>\r\n          <label class=\"small\">Height/Width</label>\r\n        </div>\r\n        <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\r\n      </form>\r\n    </div>\r\n  </div>\r\n</ng-template>\r\n\r\n<!-- Insert color template -->\r\n<ng-template #insertColorTemplate>\r\n  <div class=\"ngxe-popover imgc-ctnr\">\r\n    <div class=\"imgc-topbar two-tabs\">\r\n      <span (click)=\"selectedColorTab ='textColor'\" [ngClass]=\"{active: selectedColorTab ==='textColor'}\">Text</span>\r\n      <span (click)=\"selectedColorTab ='backgroundColor'\" [ngClass]=\"{active: selectedColorTab ==='backgroundColor'}\">Background</span>\r\n    </div>\r\n    <div class=\"imgc-ctnt is-color extra-gt1\">\r\n      <form autocomplete=\"off\">\r\n        <div class=\"form-group\">\r\n          <label for=\"hexInput\" class=\"small\">Hex Color</label>\r\n          <input type=\"text\" class=\"form-control-sm\" id=\"hexInput\" name=\"hexInput\" maxlength=\"7\" placeholder=\"HEX Color\"\r\n            [(ngModel)]=\"hexColor\" required>\r\n        </div>\r\n        <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"insertColor(hexColor, selectedColorTab)\">Submit</button>\r\n      </form>\r\n    </div>\r\n  </div>\r\n</ng-template>\r\n\r\n<!-- font size template -->\r\n<ng-template #fontSizeTemplate>\r\n  <div class=\"ngxe-popover extra-gt1\">\r\n    <form autocomplete=\"off\">\r\n      <div class=\"form-group\">\r\n        <label for=\"fontSize\" class=\"small\">Font Size</label>\r\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontSize\" placeholder=\"Font size in px/rem\"\r\n          [(ngModel)]=\"fontSize\" required>\r\n      </div>\r\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontSize(fontSize)\">Submit</button>\r\n    </form>\r\n  </div>\r\n</ng-template>\r\n\r\n<!-- font family/name template -->\r\n<ng-template #fontNameTemplate>\r\n  <div class=\"ngxe-popover extra-gt1\">\r\n    <form autocomplete=\"off\">\r\n      <div class=\"form-group\">\r\n        <label for=\"fontSize\" class=\"small\">Font Size</label>\r\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontName\" placeholder=\"Ex: 'Times New Roman', Times, serif\"\r\n          [(ngModel)]=\"fontName\" required>\r\n      </div>\r\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontName(fontName)\">Submit</button>\r\n    </form>\r\n  </div>\r\n</ng-template>\r\n",
                providers: [PopoverConfig],
                styles: ["::ng-deep .ngxePopover.popover{position:absolute;top:0;left:0;z-index:1060;display:block;max-width:276px;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";font-style:normal;font-weight:400;line-height:1.5;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;white-space:normal;line-break:auto;font-size:.875rem;word-wrap:break-word;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.2);border-radius:.3rem}::ng-deep .ngxePopover.popover .arrow{position:absolute;display:block;width:1rem;height:.5rem;margin:0 .3rem}::ng-deep .ngxePopover.popover .arrow::after,::ng-deep .ngxePopover.popover .arrow::before{position:absolute;display:block;content:\"\";border-color:transparent;border-style:solid}::ng-deep .ngxePopover.popover .popover-header{padding:.5rem .75rem;margin-bottom:0;font-size:1rem;color:inherit;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-top-left-radius:calc(.3rem - 1px);border-top-right-radius:calc(.3rem - 1px)}::ng-deep .ngxePopover.popover .popover-header:empty{display:none}::ng-deep .ngxePopover.popover .popover-body{padding:.5rem .75rem;color:#212529}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top],::ng-deep .ngxePopover.popover.bs-popover-top{margin-bottom:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow,::ng-deep .ngxePopover.popover.bs-popover-top .arrow{bottom:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{border-width:.5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{bottom:0;border-top-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after{bottom:1px;border-top-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right],::ng-deep .ngxePopover.popover.bs-popover-right{margin-left:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow,::ng-deep .ngxePopover.popover.bs-popover-right .arrow{left:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{border-width:.5rem .5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{left:0;border-right-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after{left:1px;border-right-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom],::ng-deep .ngxePopover.popover.bs-popover-bottom{margin-top:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow{left:45%!important;top:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{border-width:0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{top:0;border-bottom-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after{top:1px;border-bottom-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .popover-header::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .popover-header::before{position:absolute;top:0;left:50%;display:block;width:1rem;margin-left:-.5rem;content:\"\";border-bottom:1px solid #f7f7f7}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left],::ng-deep .ngxePopover.popover.bs-popover-left{margin-right:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow,::ng-deep .ngxePopover.popover.bs-popover-left .arrow{right:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{border-width:.5rem 0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{right:0;border-left-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after{right:1px;border-left-color:#fff}::ng-deep .ngxePopover .btn{display:inline-block;font-weight:400;text-align:center;white-space:nowrap;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}::ng-deep .ngxePopover .btn.btn-sm{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}::ng-deep .ngxePopover .btn:active,::ng-deep .ngxePopover .btn:focus{outline:0;box-shadow:none}::ng-deep .ngxePopover .btn.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}::ng-deep .ngxePopover .btn.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}::ng-deep .ngxePopover .btn:not(:disabled):not(.disabled){cursor:pointer}::ng-deep .ngxePopover form .form-group{margin-bottom:1rem}::ng-deep .ngxePopover form .form-group input{overflow:visible}::ng-deep .ngxePopover form .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding:.25rem .5rem;font-size:.875rem;line-height:1.5}::ng-deep .ngxePopover form .form-group.row{display:flex;flex-wrap:wrap;margin-left:0;margin-right:0}::ng-deep .ngxePopover form .form-group.row .col{flex-basis:0;flex-grow:1;max-width:100%;padding:0}::ng-deep .ngxePopover form .form-group.row .col:first-child{padding-right:15px}::ng-deep .ngxePopover form .form-check{position:relative;display:block;padding-left:1.25rem}::ng-deep .ngxePopover form .form-check .form-check-input{position:absolute;margin-top:.3rem;margin-left:-1.25rem}.ngx-toolbar{background-color:#f5f5f5;font-size:.8rem;padding:.2rem;border:1px solid #ddd}.ngx-toolbar .ngx-toolbar-set{display:inline-block;border-radius:5px;background-color:#fff}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button{background-color:transparent;padding:.4rem;min-width:2.5rem;float:left;border:1px solid #ddd;border-right:transparent}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button.focus,.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:focus{outline:0}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:last-child{border-right:1px solid #ddd;border-top-right-radius:5px;border-bottom-right-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:first-child{border-top-left-radius:5px;border-bottom-left-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:disabled{background-color:#f5f5f5;pointer-events:none;cursor:not-allowed}::ng-deep .popover{border-top-right-radius:0;border-top-left-radius:0}::ng-deep .ngxe-popover{min-width:15rem;white-space:nowrap}::ng-deep .ngxe-popover .extra-gt,::ng-deep .ngxe-popover.extra-gt{padding-top:.5rem!important}::ng-deep .ngxe-popover .extra-gt1,::ng-deep .ngxe-popover.extra-gt1{padding-top:.75rem!important}::ng-deep .ngxe-popover .extra-gt2,::ng-deep .ngxe-popover.extra-gt2{padding-top:1rem!important}::ng-deep .ngxe-popover .form-group label{display:none;margin:0}::ng-deep .ngxe-popover .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding-left:0;padding-right:0}::ng-deep .ngxe-popover .form-group .form-control-sm:active,::ng-deep .ngxe-popover .form-group .form-control-sm:focus{border-bottom:2px solid #1e88e5;box-shadow:none;margin-bottom:0}::ng-deep .ngxe-popover .form-group .form-control-sm.ng-dirty.ng-invalid:not(.ng-pristine){border-bottom:2px solid red}::ng-deep .ngxe-popover .form-check{margin-bottom:1rem}::ng-deep .ngxe-popover .btn:focus{box-shadow:none!important}::ng-deep .ngxe-popover.imgc-ctnr{margin:-.5rem -.75rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar{box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 1px 1px rgba(0,0,0,.16);border-bottom:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button{background-color:transparent;border-radius:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button.active{color:#007bff;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span{width:50%;text-align:center;display:inline-block;padding:.4rem 0;margin:0 -1px 2px}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span:hover{cursor:pointer}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span.active{margin-bottom:-2px;border-bottom:2px solid #007bff;color:#007bff}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt{padding:.5rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .progress{height:.5rem;margin:.5rem -.5rem -.6rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image p{margin:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph{border:2px dashed #bdbdbd;padding:1.8rem 0;position:relative;letter-spacing:1px;text-align:center}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph:hover{background:#ebebeb}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm{opacity:0;position:absolute;top:0;bottom:0;left:0;right:0;z-index:2147483640;overflow:hidden;margin:0;padding:0;width:100%}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm input{cursor:pointer;position:absolute;right:0;top:0;bottom:0;margin:0}"]
            }] }
];
/** @nocollapse */
NgxEditorToolbarComponent.ctorParameters = () => [
    { type: PopoverConfig },
    { type: FormBuilder },
    { type: MessageService },
    { type: CommandExecutorService }
];
NgxEditorToolbarComponent.propDecorators = {
    config: [{ type: Input }],
    urlPopover: [{ type: ViewChild, args: ['urlPopover',] }],
    imagePopover: [{ type: ViewChild, args: ['imagePopover',] }],
    videoPopover: [{ type: ViewChild, args: ['videoPopover',] }],
    fontSizePopover: [{ type: ViewChild, args: ['fontSizePopover',] }],
    colorPopover: [{ type: ViewChild, args: ['colorPopover',] }],
    execute: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxEditorModule {
}
NgxEditorModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule, ReactiveFormsModule, PopoverModule.forRoot()],
                declarations: [NgxEditorComponent, NgxGrippieComponent, NgxEditorMessageComponent, NgxEditorToolbarComponent],
                exports: [NgxEditorComponent, PopoverModule],
                providers: [CommandExecutorService, MessageService]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgxEditorModule, CommandExecutorService as ɵc, MessageService as ɵb, NgxEditorMessageComponent as ɵe, NgxEditorToolbarComponent as ɵf, NgxEditorComponent as ɵa, NgxGrippieComponent as ɵd };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9jb21tb24vdXRpbHMvbmd4LWVkaXRvci51dGlscy50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9jb21tb24vc2VydmljZXMvY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlLnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3IvY29tbW9uL25neC1lZGl0b3IuZGVmYXVsdHMudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3Ivbmd4LWVkaXRvci5jb21wb25lbnQudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3Ivbmd4LWdyaXBwaWUvbmd4LWdyaXBwaWUuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1lZGl0b3ItbWVzc2FnZS9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1lZGl0b3ItdG9vbGJhci9uZ3gtZWRpdG9yLXRvb2xiYXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1lZGl0b3IubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBlbmFibGUgb3IgZGlzYWJsZSB0b29sYmFyIGJhc2VkIG9uIGNvbmZpZ3VyYXRpb25cclxuICpcclxuICogQHBhcmFtIHZhbHVlIHRvb2xiYXIgaXRlbVxyXG4gKiBAcGFyYW0gdG9vbGJhciB0b29sYmFyIGNvbmZpZ3VyYXRpb24gb2JqZWN0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY2FuRW5hYmxlVG9vbGJhck9wdGlvbnModmFsdWU6IHN0cmluZywgdG9vbGJhcjogYW55KTogYm9vbGVhbiB7XHJcblxyXG4gIGlmICh2YWx1ZSkge1xyXG5cclxuICAgIGlmICh0b29sYmFyWydsZW5ndGgnXSA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICBjb25zdCBmb3VuZCA9IHRvb2xiYXIuZmlsdGVyKGFycmF5ID0+IHtcclxuICAgICAgICByZXR1cm4gYXJyYXkuaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBmb3VuZC5sZW5ndGggPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBzZXQgZWRpdG9yIGNvbmZpZ3VyYXRpb25cclxuICpcclxuICogQHBhcmFtIHZhbHVlIGNvbmZpZ3VyYXRpb24gdmlhIFtjb25maWddIHByb3BlcnR5XHJcbiAqIEBwYXJhbSBuZ3hFZGl0b3JDb25maWcgZGVmYXVsdCBlZGl0b3IgY29uZmlndXJhdGlvblxyXG4gKiBAcGFyYW0gaW5wdXQgZGlyZWN0IGNvbmZpZ3VyYXRpb24gaW5wdXRzIHZpYSBkaXJlY3RpdmVzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWRpdG9yQ29uZmlndXJhdGlvbih2YWx1ZTogYW55LCBuZ3hFZGl0b3JDb25maWc6IGFueSwgaW5wdXQ6IGFueSk6IGFueSB7XHJcblxyXG4gIGZvciAoY29uc3QgaSBpbiBuZ3hFZGl0b3JDb25maWcpIHtcclxuICAgIGlmIChpKSB7XHJcblxyXG4gICAgICBpZiAoaW5wdXRbaV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHZhbHVlW2ldID0gaW5wdXRbaV07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdmFsdWUuaGFzT3duUHJvcGVydHkoaSkpIHtcclxuICAgICAgICB2YWx1ZVtpXSA9IG5neEVkaXRvckNvbmZpZ1tpXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG4vKipcclxuICogcmV0dXJuIHZlcnRpY2FsIGlmIHRoZSBlbGVtZW50IGlzIHRoZSByZXNpemVyIHByb3BlcnR5IGlzIHNldCB0byBiYXNpY1xyXG4gKlxyXG4gKiBAcGFyYW0gcmVzaXplciB0eXBlIG9mIHJlc2l6ZXIsIGVpdGhlciBiYXNpYyBvciBzdGFja1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNhblJlc2l6ZShyZXNpemVyOiBzdHJpbmcpOiBhbnkge1xyXG4gIGlmIChyZXNpemVyID09PSAnYmFzaWMnKSB7XHJcbiAgICByZXR1cm4gJ3ZlcnRpY2FsJztcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogc2F2ZSBzZWxlY3Rpb24gd2hlbiB0aGUgZWRpdG9yIGlzIGZvY3Vzc2VkIG91dFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVTZWxlY3Rpb24oKTogYW55IHtcclxuICBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xyXG4gICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xyXG4gICAgaWYgKHNlbC5nZXRSYW5nZUF0ICYmIHNlbC5yYW5nZUNvdW50KSB7XHJcbiAgICAgIHJldHVybiBzZWwuZ2V0UmFuZ2VBdCgwKTtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKGRvY3VtZW50LmdldFNlbGVjdGlvbiAmJiBkb2N1bWVudC5jcmVhdGVSYW5nZSkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogcmVzdG9yZSBzZWxlY3Rpb24gd2hlbiB0aGUgZWRpdG9yIGlzIGZvY3Vzc2VkIGluXHJcbiAqXHJcbiAqIEBwYXJhbSByYW5nZSBzYXZlZCBzZWxlY3Rpb24gd2hlbiB0aGUgZWRpdG9yIGlzIGZvY3Vzc2VkIG91dFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc3RvcmVTZWxlY3Rpb24ocmFuZ2UpOiBib29sZWFuIHtcclxuICBpZiAocmFuZ2UpIHtcclxuICAgIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKSB7XHJcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xyXG4gICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuZ2V0U2VsZWN0aW9uICYmIHJhbmdlLnNlbGVjdCkge1xyXG4gICAgICByYW5nZS5zZWxlY3QoKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUmVxdWVzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vdXRpbHMvbmd4LWVkaXRvci51dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlIHtcclxuXHJcbiAgLyoqIHNhdmVzIHRoZSBzZWxlY3Rpb24gZnJvbSB0aGUgZWRpdG9yIHdoZW4gZm9jdXNzZWQgb3V0ICovXHJcbiAgc2F2ZWRTZWxlY3Rpb246IGFueSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gX2h0dHAgSFRUUCBDbGllbnQgZm9yIG1ha2luZyBodHRwIHJlcXVlc3RzXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaHR0cDogSHR0cENsaWVudCkgeyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGV4ZWN1dGVzIGNvbW1hbmQgZnJvbSB0aGUgdG9vbGJhclxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvbW1hbmQgY29tbWFuZCB0byBiZSBleGVjdXRlZFxyXG4gICAqL1xyXG4gIGV4ZWN1dGUoY29tbWFuZDogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgaWYgKCF0aGlzLnNhdmVkU2VsZWN0aW9uICYmIGNvbW1hbmQgIT09ICdlbmFibGVPYmplY3RSZXNpemluZycpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgRWRpdG9yJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbW1hbmQgPT09ICdlbmFibGVPYmplY3RSZXNpemluZycpIHtcclxuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2VuYWJsZU9iamVjdFJlc2l6aW5nJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY29tbWFuZCA9PT0gJ2Jsb2NrcXVvdGUnKSB7XHJcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdmb3JtYXRCbG9jaycsIGZhbHNlLCAnYmxvY2txdW90ZScpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbW1hbmQgPT09ICdyZW1vdmVCbG9ja3F1b3RlJykge1xyXG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ2RpdicpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoY29tbWFuZCwgZmFsc2UsIG51bGwpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogaW5zZXJ0cyBpbWFnZSBpbiB0aGUgZWRpdG9yXHJcbiAgICpcclxuICAgKiBAcGFyYW0gaW1hZ2VVUkkgdXJsIG9mIHRoZSBpbWFnZSB0byBiZSBpbnNlcnRlZFxyXG4gICAqL1xyXG4gIGluc2VydEltYWdlKGltYWdlVVJJOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XHJcbiAgICAgIGlmIChpbWFnZVVSSSkge1xyXG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcclxuICAgICAgICBpZiAocmVzdG9yZWQpIHtcclxuICAgICAgICAgIC8vIGNvbnN0IGluc2VydGVkID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydEltYWdlJywgZmFsc2UsIGltYWdlVVJJKTtcclxuICAgICAgICAgIGNvbnN0IGluc2VydGVkID0gdGhpcy5pbnNlcnRIdG1sKGA8YXBwLWltZyBbc3JjXT0ke2ltYWdlVVJJfSBzdHlsZT1cIm1heC13aWR0aDogMTAwJTtcIj48L2FwcC1pbWc+YCk7XHJcbiAgICAgICAgICBpZiAoIWluc2VydGVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBVUkwnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcclxuICAgIH1cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gKiBpbnNlcnRzIGltYWdlIGluIHRoZSBlZGl0b3JcclxuICpcclxuICogQHBhcmFtIHZpZGVQYXJhbXMgdXJsIG9mIHRoZSBpbWFnZSB0byBiZSBpbnNlcnRlZFxyXG4gKi9cclxuICBpbnNlcnRWaWRlbyh2aWRlUGFyYW1zOiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XHJcbiAgICAgIGlmICh2aWRlUGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xyXG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNZb3V0dWJlTGluayh2aWRlUGFyYW1zLnZpZGVvVXJsKSkge1xyXG4gICAgICAgICAgICBjb25zdCB5b3V0dWJlVVJMID0gJzxpZnJhbWUgd2lkdGg9XCInICsgdmlkZVBhcmFtcy53aWR0aCArICdcIiBoZWlnaHQ9XCInICsgdmlkZVBhcmFtcy5oZWlnaHQgKyAnXCInXHJcbiAgICAgICAgICAgICAgKyAnc3JjPVwiJyArIHZpZGVQYXJhbXMudmlkZW9VcmwgKyAnXCI+PC9pZnJhbWU+JztcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKHlvdXR1YmVVUkwpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoZWNrVGFnU3VwcG9ydEluQnJvd3NlcigndmlkZW8nKSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNWYWxpZFVSTCh2aWRlUGFyYW1zLnZpZGVvVXJsKSkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHZpZGVvU3JjID0gJzx2aWRlbyB3aWR0aD1cIicgKyB2aWRlUGFyYW1zLndpZHRoICsgJ1wiIGhlaWdodD1cIicgKyB2aWRlUGFyYW1zLmhlaWdodCArICdcIidcclxuICAgICAgICAgICAgICAgICsgJyBjb250cm9scz1cInRydWVcIj48c291cmNlIHNyYz1cIicgKyB2aWRlUGFyYW1zLnZpZGVvVXJsICsgJ1wiPjwvdmlkZW8+JztcclxuICAgICAgICAgICAgICB0aGlzLmluc2VydEh0bWwodmlkZW9TcmMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2aWRlbyBVUkwnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGluc2VydCB2aWRlbycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2hlY2tzIHRoZSBpbnB1dCB1cmwgaXMgYSB2YWxpZCB5b3V0dWJlIFVSTCBvciBub3RcclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmwgWW91dHVlIFVSTFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaXNZb3V0dWJlTGluayh1cmw6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgeXRSZWdFeHAgPSAvXihodHRwKHMpPzpcXC9cXC8pPygodyl7M30uKT95b3V0dShiZXwuYmUpPyhcXC5jb20pP1xcLy4rLztcclxuICAgIHJldHVybiB5dFJlZ0V4cC50ZXN0KHVybCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjaGVjayB3aGV0aGVyIHRoZSBzdHJpbmcgaXMgYSB2YWxpZCB1cmwgb3Igbm90XHJcbiAgICogQHBhcmFtIHVybCB1cmxcclxuICAgKi9cclxuICBwcml2YXRlIGlzVmFsaWRVUkwodXJsOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHVybFJlZ0V4cCA9IC8oaHR0cHxodHRwcyk6XFwvXFwvKFxcdys6ezAsMX1cXHcqKT8oXFxTKykoOlswLTldKyk/KFxcL3xcXC8oW1xcdyMhOi4/Kz0mJSFcXC1cXC9dKSk/LztcclxuICAgIHJldHVybiB1cmxSZWdFeHAudGVzdCh1cmwpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdXBsb2FkcyBpbWFnZSB0byB0aGUgc2VydmVyXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZmlsZSBmaWxlIHRoYXQgaGFzIHRvIGJlIHVwbG9hZGVkXHJcbiAgICogQHBhcmFtIGVuZFBvaW50IGVucG9pbnQgdG8gd2hpY2ggdGhlIGltYWdlIGhhcyB0byBiZSB1cGxvYWRlZFxyXG4gICAqL1xyXG4gIHVwbG9hZEltYWdlKGZpbGU6IEZpbGUsIGVuZFBvaW50OiBzdHJpbmcpOiBhbnkge1xyXG5cclxuICAgIGlmICghZW5kUG9pbnQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbWFnZSBFbmRwb2ludCBpc25gdCBwcm92aWRlZCBvciBpbnZhbGlkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGE6IEZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcblxyXG4gICAgaWYgKGZpbGUpIHtcclxuXHJcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xyXG5cclxuICAgICAgY29uc3QgcmVxID0gbmV3IEh0dHBSZXF1ZXN0KCdQT1NUJywgZW5kUG9pbnQsIGZvcm1EYXRhLCB7XHJcbiAgICAgICAgcmVwb3J0UHJvZ3Jlc3M6IHRydWVcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5faHR0cC5yZXF1ZXN0KHJlcSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEltYWdlJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBpbnNlcnRzIGxpbmsgaW4gdGhlIGVkaXRvclxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhcmFtcyBwYXJhbWV0ZXJzIHRoYXQgaG9sZHMgdGhlIGluZm9ybWF0aW9uIGZvciB0aGUgbGlua1xyXG4gICAqL1xyXG4gIGNyZWF0ZUxpbmsocGFyYW1zOiBhbnkpOiB2b2lkIHtcclxuXHJcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xyXG4gICAgICAvKipcclxuICAgICAgICogY2hlY2sgd2hldGhlciB0aGUgc2F2ZWQgc2VsZWN0aW9uIGNvbnRhaW5zIGEgcmFuZ2Ugb3IgcGxhaW4gc2VsZWN0aW9uXHJcbiAgICAgICAqL1xyXG4gICAgICBpZiAocGFyYW1zLnVybE5ld1RhYikge1xyXG4gICAgICAgIGNvbnN0IG5ld1VybCA9ICc8YSBocmVmPVwiJyArIHBhcmFtcy51cmxMaW5rICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiPicgKyBwYXJhbXMudXJsVGV4dCArICc8L2E+JztcclxuXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldFNlbGVjdGlvbigpLnR5cGUgIT09ICdSYW5nZScpIHtcclxuICAgICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcclxuICAgICAgICAgIGlmIChyZXN0b3JlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwobmV3VXJsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG5ldyBsaW5rcyBjYW4gYmUgaW5zZXJ0ZWQuIFlvdSBjYW5ub3QgZWRpdCBVUkxgcycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XHJcbiAgICAgICAgaWYgKHJlc3RvcmVkKSB7XHJcbiAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY3JlYXRlTGluaycsIGZhbHNlLCBwYXJhbXMudXJsTGluayk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmdlIG91dCBvZiB0aGUgZWRpdG9yJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogaW5zZXJ0IGNvbG9yIGVpdGhlciBmb250IG9yIGJhY2tncm91bmRcclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb2xvciBjb2xvciB0byBiZSBpbnNlcnRlZFxyXG4gICAqIEBwYXJhbSB3aGVyZSB3aGVyZSB0aGUgY29sb3IgaGFzIHRvIGJlIGluc2VydGVkIGVpdGhlciB0ZXh0L2JhY2tncm91bmRcclxuICAgKi9cclxuICBpbnNlcnRDb2xvcihjb2xvcjogc3RyaW5nLCB3aGVyZTogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24pIHtcclxuICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xyXG4gICAgICBpZiAocmVzdG9yZWQgJiYgdGhpcy5jaGVja1NlbGVjdGlvbigpKSB7XHJcbiAgICAgICAgaWYgKHdoZXJlID09PSAndGV4dENvbG9yJykge1xyXG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2ZvcmVDb2xvcicsIGZhbHNlLCBjb2xvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdoaWxpdGVDb2xvcicsIGZhbHNlLCBjb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHNldCBmb250IHNpemUgZm9yIHRleHRcclxuICAgKlxyXG4gICAqIEBwYXJhbSBmb250U2l6ZSBmb250LXNpemUgdG8gYmUgc2V0XHJcbiAgICovXHJcbiAgc2V0Rm9udFNpemUoZm9udFNpemU6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uICYmIHRoaXMuY2hlY2tTZWxlY3Rpb24oKSkge1xyXG4gICAgICBjb25zdCBkZWxldGVkVmFsdWUgPSB0aGlzLmRlbGV0ZUFuZEdldEVsZW1lbnQoKTtcclxuXHJcbiAgICAgIGlmIChkZWxldGVkVmFsdWUpIHtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xyXG5cclxuICAgICAgICBpZiAocmVzdG9yZWQpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmlzTnVtZXJpYyhmb250U2l6ZSkpIHtcclxuICAgICAgICAgICAgY29uc3QgZm9udFB4ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1zaXplOiAnICsgZm9udFNpemUgKyAncHg7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRQeCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBmb250UHggPSAnPHNwYW4gc3R5bGU9XCJmb250LXNpemU6ICcgKyBmb250U2l6ZSArICc7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRQeCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc2V0IGZvbnQgbmFtZS9mYW1pbHkgZm9yIHRleHRcclxuICAgKlxyXG4gICAqIEBwYXJhbSBmb250TmFtZSBmb250LWZhbWlseSB0byBiZSBzZXRcclxuICAgKi9cclxuICBzZXRGb250TmFtZShmb250TmFtZTogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24gJiYgdGhpcy5jaGVja1NlbGVjdGlvbigpKSB7XHJcbiAgICAgIGNvbnN0IGRlbGV0ZWRWYWx1ZSA9IHRoaXMuZGVsZXRlQW5kR2V0RWxlbWVudCgpO1xyXG5cclxuICAgICAgaWYgKGRlbGV0ZWRWYWx1ZSkge1xyXG5cclxuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XHJcblxyXG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNOdW1lcmljKGZvbnROYW1lKSkge1xyXG4gICAgICAgICAgICBjb25zdCBmb250RmFtaWx5ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1mYW1pbHk6ICcgKyBmb250TmFtZSArICdweDtcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xyXG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoZm9udEZhbWlseSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBmb250RmFtaWx5ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1mYW1pbHk6ICcgKyBmb250TmFtZSArICc7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRGYW1pbHkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBpbnNlcnQgSFRNTCAqL1xyXG4gIHByaXZhdGUgaW5zZXJ0SHRtbChodG1sOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICBjb25zdCBpc0hUTUxJbnNlcnRlZCA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRIVE1MJywgZmFsc2UsIGh0bWwpO1xyXG5cclxuICAgIGlmICghaXNIVE1MSW5zZXJ0ZWQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gcGVyZm9ybSB0aGUgb3BlcmF0aW9uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY2hlY2sgd2hldGhlciB0aGUgdmFsdWUgaXMgYSBudW1iZXIgb3Igc3RyaW5nXHJcbiAgICogaWYgbnVtYmVyIHJldHVybiB0cnVlXHJcbiAgICogZWxzZSByZXR1cm4gZmFsc2VcclxuICAgKi9cclxuICBwcml2YXRlIGlzTnVtZXJpYyh2YWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gL14tezAsMX1cXGQrJC8udGVzdCh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICAvKiogZGVsZXRlIHRoZSB0ZXh0IGF0IHNlbGVjdGVkIHJhbmdlIGFuZCByZXR1cm4gdGhlIHZhbHVlICovXHJcbiAgcHJpdmF0ZSBkZWxldGVBbmRHZXRFbGVtZW50KCk6IGFueSB7XHJcblxyXG4gICAgbGV0IHNsZWN0ZWRUZXh0O1xyXG5cclxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XHJcbiAgICAgIHNsZWN0ZWRUZXh0ID0gdGhpcy5zYXZlZFNlbGVjdGlvbi50b1N0cmluZygpO1xyXG4gICAgICB0aGlzLnNhdmVkU2VsZWN0aW9uLmRlbGV0ZUNvbnRlbnRzKCk7XHJcbiAgICAgIHJldHVybiBzbGVjdGVkVGV4dDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqIGNoZWNrIGFueSBzbGVjdGlvbiBpcyBtYWRlIG9yIG5vdCAqL1xyXG4gIHByaXZhdGUgY2hlY2tTZWxlY3Rpb24oKTogYW55IHtcclxuXHJcbiAgICBjb25zdCBzbGVjdGVkVGV4dCA9IHRoaXMuc2F2ZWRTZWxlY3Rpb24udG9TdHJpbmcoKTtcclxuXHJcbiAgICBpZiAoc2xlY3RlZFRleHQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gU2VsZWN0aW9uIE1hZGUnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNoZWNrIHRhZyBpcyBzdXBwb3J0ZWQgYnkgYnJvd3NlciBvciBub3RcclxuICAgKlxyXG4gICAqIEBwYXJhbSB0YWcgSFRNTCB0YWdcclxuICAgKi9cclxuICBwcml2YXRlIGNoZWNrVGFnU3VwcG9ydEluQnJvd3Nlcih0YWc6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICEoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpIGluc3RhbmNlb2YgSFRNTFVua25vd25FbGVtZW50KTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuXHJcbi8qKiB0aW1lIGluIHdoaWNoIHRoZSBtZXNzYWdlIGhhcyB0byBiZSBjbGVhcmVkICovXHJcbmNvbnN0IERVUkFUSU9OID0gNzAwMDtcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VTZXJ2aWNlIHtcclxuXHJcbiAgLyoqIHZhcmlhYmxlIHRvIGhvbGQgdGhlIHVzZXIgbWVzc2FnZSAqL1xyXG4gIHByaXZhdGUgbWVzc2FnZTogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcbiAgLyoqIHJldHVybnMgdGhlIG1lc3NhZ2Ugc2VudCBieSB0aGUgZWRpdG9yICovXHJcbiAgZ2V0TWVzc2FnZSgpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIHRoaXMubWVzc2FnZS5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHNlbmRzIG1lc3NhZ2UgdG8gdGhlIGVkaXRvclxyXG4gICAqXHJcbiAgICogQHBhcmFtIG1lc3NhZ2UgbWVzc2FnZSB0byBiZSBzZW50XHJcbiAgICovXHJcbiAgc2VuZE1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLm1lc3NhZ2UubmV4dChtZXNzYWdlKTtcclxuICAgIHRoaXMuY2xlYXJNZXNzYWdlSW4oRFVSQVRJT04pO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYSBzaG9ydCBpbnRlcnZhbCB0byBjbGVhciBtZXNzYWdlXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbWlsbGlzZWNvbmRzIHRpbWUgaW4gc2Vjb25kcyBpbiB3aGljaCB0aGUgbWVzc2FnZSBoYXMgdG8gYmUgY2xlYXJlZFxyXG4gICAqL1xyXG4gIHByaXZhdGUgY2xlYXJNZXNzYWdlSW4obWlsbGlzZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLm1lc3NhZ2UubmV4dCh1bmRlZmluZWQpO1xyXG4gICAgfSwgbWlsbGlzZWNvbmRzKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG59XHJcbiIsIi8qKlxyXG4gKiB0b29sYmFyIGRlZmF1bHQgY29uZmlndXJhdGlvblxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IG5neEVkaXRvckNvbmZpZyA9IHtcclxuICBlZGl0YWJsZTogdHJ1ZSxcclxuICBzcGVsbGNoZWNrOiB0cnVlLFxyXG4gIGhlaWdodDogJ2F1dG8nLFxyXG4gIG1pbkhlaWdodDogJzAnLFxyXG4gIHdpZHRoOiAnYXV0bycsXHJcbiAgbWluV2lkdGg6ICcwJyxcclxuICB0cmFuc2xhdGU6ICd5ZXMnLFxyXG4gIGVuYWJsZVRvb2xiYXI6IHRydWUsXHJcbiAgc2hvd1Rvb2xiYXI6IHRydWUsXHJcbiAgcGxhY2Vob2xkZXI6ICdFbnRlciB0ZXh0IGhlcmUuLi4nLFxyXG4gIGltYWdlRW5kUG9pbnQ6ICcnLFxyXG4gIHRvb2xiYXI6IFtcclxuICAgIFsnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3VwZXJzY3JpcHQnLCAnc3Vic2NyaXB0J10sXHJcbiAgICBbJ2ZvbnROYW1lJywgJ2ZvbnRTaXplJywgJ2NvbG9yJ10sXHJcbiAgICBbJ2p1c3RpZnlMZWZ0JywgJ2p1c3RpZnlDZW50ZXInLCAnanVzdGlmeVJpZ2h0JywgJ2p1c3RpZnlGdWxsJywgJ2luZGVudCcsICdvdXRkZW50J10sXHJcbiAgICBbJ2N1dCcsICdjb3B5JywgJ2RlbGV0ZScsICdyZW1vdmVGb3JtYXQnLCAndW5kbycsICdyZWRvJ10sXHJcbiAgICBbJ3BhcmFncmFwaCcsICdibG9ja3F1b3RlJywgJ3JlbW92ZUJsb2NrcXVvdGUnLCAnaG9yaXpvbnRhbExpbmUnLCAnb3JkZXJlZExpc3QnLCAndW5vcmRlcmVkTGlzdCddLFxyXG4gICAgWydsaW5rJywgJ3VubGluaycsICdpbWFnZScsICd2aWRlbyddXHJcbiAgXVxyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gIENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBWaWV3Q2hpbGQsXHJcbiAgRXZlbnRFbWl0dGVyLCBSZW5kZXJlcjIsIGZvcndhcmRSZWZcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5cclxuaW1wb3J0IHsgQ29tbWFuZEV4ZWN1dG9yU2VydmljZSB9IGZyb20gJy4vY29tbW9uL3NlcnZpY2VzL2NvbW1hbmQtZXhlY3V0b3Iuc2VydmljZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcclxuXHJcbmltcG9ydCB7IG5neEVkaXRvckNvbmZpZyB9IGZyb20gJy4vY29tbW9uL25neC1lZGl0b3IuZGVmYXVsdHMnO1xyXG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL2NvbW1vbi91dGlscy9uZ3gtZWRpdG9yLnV0aWxzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5neC1lZGl0b3InLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZWRpdG9yLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZWRpdG9yLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ3hFZGl0b3JDb21wb25lbnQpLFxyXG4gICAgICBtdWx0aTogdHJ1ZVxyXG4gICAgfVxyXG4gIF1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBOZ3hFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcclxuXHJcbiAgLyoqIFNwZWNpZmllcyB3ZWF0aGVyIHRoZSB0ZXh0YXJlYSB0byBiZSBlZGl0YWJsZSBvciBub3QgKi9cclxuICBASW5wdXQoKSBlZGl0YWJsZTogYm9vbGVhbjtcclxuICAvKiogVGhlIHNwZWxsY2hlY2sgcHJvcGVydHkgc3BlY2lmaWVzIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgdG8gaGF2ZSBpdHMgc3BlbGxpbmcgYW5kIGdyYW1tYXIgY2hlY2tlZCBvciBub3QuICovXHJcbiAgQElucHV0KCkgc3BlbGxjaGVjazogYm9vbGVhbjtcclxuICAvKiogUGxhY2Vob2xkZXIgZm9yIHRoZSB0ZXh0QXJlYSAqL1xyXG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogVGhlIHRyYW5zbGF0ZSBwcm9wZXJ0eSBzcGVjaWZpZXMgd2hldGhlciB0aGUgY29udGVudCBvZiBhbiBlbGVtZW50IHNob3VsZCBiZSB0cmFuc2xhdGVkIG9yIG5vdC5cclxuICAgKlxyXG4gICAqIENoZWNrIGh0dHBzOi8vd3d3Lnczc2Nob29scy5jb20vdGFncy9hdHRfZ2xvYmFsX3RyYW5zbGF0ZS5hc3AgZm9yIG1vcmUgaW5mb3JtYXRpb24gYW5kIGJyb3dzZXIgc3VwcG9ydFxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIHRyYW5zbGF0ZTogc3RyaW5nO1xyXG4gIC8qKiBTZXRzIGhlaWdodCBvZiB0aGUgZWRpdG9yICovXHJcbiAgQElucHV0KCkgaGVpZ2h0OiBzdHJpbmc7XHJcbiAgLyoqIFNldHMgbWluaW11bSBoZWlnaHQgZm9yIHRoZSBlZGl0b3IgKi9cclxuICBASW5wdXQoKSBtaW5IZWlnaHQ6IHN0cmluZztcclxuICAvKiogU2V0cyBXaWR0aCBvZiB0aGUgZWRpdG9yICovXHJcbiAgQElucHV0KCkgd2lkdGg6IHN0cmluZztcclxuICAvKiogU2V0cyBtaW5pbXVtIHdpZHRoIG9mIHRoZSBlZGl0b3IgKi9cclxuICBASW5wdXQoKSBtaW5XaWR0aDogc3RyaW5nO1xyXG4gIC8qKlxyXG4gICAqIFRvb2xiYXIgYWNjZXB0cyBhbiBhcnJheSB3aGljaCBzcGVjaWZpZXMgdGhlIG9wdGlvbnMgdG8gYmUgZW5hYmxlZCBmb3IgdGhlIHRvb2xiYXJcclxuICAgKlxyXG4gICAqIENoZWNrIG5neEVkaXRvckNvbmZpZyBmb3IgdG9vbGJhciBjb25maWd1cmF0aW9uXHJcbiAgICpcclxuICAgKiBQYXNzaW5nIGFuIGVtcHR5IGFycmF5IHdpbGwgZW5hYmxlIGFsbCB0b29sYmFyXHJcbiAgICovXHJcbiAgQElucHV0KCkgdG9vbGJhcjogT2JqZWN0O1xyXG4gIC8qKlxyXG4gICAqIFRoZSBlZGl0b3IgY2FuIGJlIHJlc2l6ZWQgdmVydGljYWxseS5cclxuICAgKlxyXG4gICAqIGBiYXNpY2AgcmVzaXplciBlbmFibGVzIHRoZSBodG1sNSByZXN6aWVyLiBDaGVjayBoZXJlIGh0dHBzOi8vd3d3Lnczc2Nob29scy5jb20vY3NzcmVmL2NzczNfcHJfcmVzaXplLmFzcFxyXG4gICAqXHJcbiAgICogYHN0YWNrYCByZXNpemVyIGVuYWJsZSBhIHJlc2l6ZXIgdGhhdCBsb29rcyBsaWtlIGFzIGlmIGluIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb21cclxuICAgKi9cclxuICBASW5wdXQoKSByZXNpemVyID0gJ3N0YWNrJztcclxuICAvKipcclxuICAgKiBUaGUgY29uZmlnIHByb3BlcnR5IGlzIGEgSlNPTiBvYmplY3RcclxuICAgKlxyXG4gICAqIEFsbCBhdmFpYmFsZSBpbnB1dHMgaW5wdXRzIGNhbiBiZSBwcm92aWRlZCBpbiB0aGUgY29uZmlndXJhdGlvbiBhcyBKU09OXHJcbiAgICogaW5wdXRzIHByb3ZpZGVkIGRpcmVjdGx5IGFyZSBjb25zaWRlcmVkIGFzIHRvcCBwcmlvcml0eVxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIGNvbmZpZyA9IG5neEVkaXRvckNvbmZpZztcclxuICAvKiogV2VhdGhlciB0byBzaG93IG9yIGhpZGUgdG9vbGJhciAqL1xyXG4gIEBJbnB1dCgpIHNob3dUb29sYmFyOiBib29sZWFuO1xyXG4gIC8qKiBXZWF0aGVyIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSB0b29sYmFyICovXHJcbiAgQElucHV0KCkgZW5hYmxlVG9vbGJhcjogYm9vbGVhbjtcclxuICAvKiogRW5kcG9pbnQgZm9yIHdoaWNoIHRoZSBpbWFnZSB0byBiZSB1cGxvYWRlZCAqL1xyXG4gIEBJbnB1dCgpIGltYWdlRW5kUG9pbnQ6IHN0cmluZztcclxuXHJcbiAgLyoqIGVtaXRzIGBibHVyYCBldmVudCB3aGVuIGZvY3VzZWQgb3V0IGZyb20gdGhlIHRleHRhcmVhICovXHJcbiAgQE91dHB1dCgpIGJsdXI6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcbiAgLyoqIGVtaXRzIGBmb2N1c2AgZXZlbnQgd2hlbiBmb2N1c2VkIGluIHRvIHRoZSB0ZXh0YXJlYSAqL1xyXG4gIEBPdXRwdXQoKSBmb2N1czogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcclxuXHJcbiAgQFZpZXdDaGlsZCgnbmd4VGV4dEFyZWEnKSB0ZXh0QXJlYTogYW55O1xyXG4gIEBWaWV3Q2hpbGQoJ25neFdyYXBwZXInKSBuZ3hXcmFwcGVyOiBhbnk7XHJcblxyXG4gIFV0aWxzOiBhbnkgPSBVdGlscztcclxuXHJcbiAgcHJpdmF0ZSBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ7XHJcbiAgcHJpdmF0ZSBvblRvdWNoZWQ6ICgpID0+IHZvaWQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSBfbWVzc2FnZVNlcnZpY2Ugc2VydmljZSB0byBzZW5kIG1lc3NhZ2UgdG8gdGhlIGVkaXRvciBtZXNzYWdlIGNvbXBvbmVudFxyXG4gICAqIEBwYXJhbSBfY29tbWFuZEV4ZWN1dG9yIGV4ZWN1dGVzIGNvbW1hbmQgZnJvbSB0aGUgdG9vbGJhclxyXG4gICAqIEBwYXJhbSBfcmVuZGVyZXIgYWNjZXNzIGFuZCBtYW5pcHVsYXRlIHRoZSBkb20gZWxlbWVudFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBfbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBfY29tbWFuZEV4ZWN1dG9yOiBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMikgeyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGV2ZW50c1xyXG4gICAqL1xyXG4gIG9uVGV4dEFyZWFGb2N1cygpOiB2b2lkIHtcclxuICAgIHRoaXMuZm9jdXMuZW1pdCgnZm9jdXMnKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qKiBmb2N1cyB0aGUgdGV4dCBhcmVhIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCAqL1xyXG4gIG9uRWRpdG9yRm9jdXMoKSB7XHJcbiAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4ZWN1dGVkIGZyb20gdGhlIGNvbnRlbnRlZGl0YWJsZSBzZWN0aW9uIHdoaWxlIHRoZSBpbnB1dCBwcm9wZXJ0eSBjaGFuZ2VzXHJcbiAgICogQHBhcmFtIGh0bWwgaHRtbCBzdHJpbmcgZnJvbSBjb250ZW50ZWRpdGFibGVcclxuICAgKi9cclxuICBvbkNvbnRlbnRDaGFuZ2UoaHRtbDogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHRoaXMub25DaGFuZ2UoaHRtbCk7XHJcbiAgICAgIHRoaXMudG9nZ2xlUGxhY2Vob2xkZXIoaHRtbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgb25UZXh0QXJlYUJsdXIoKTogdm9pZCB7XHJcblxyXG4gICAgLyoqIHNhdmUgc2VsZWN0aW9uIGlmIGZvY3Vzc2VkIG91dCAqL1xyXG4gICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yLnNhdmVkU2VsZWN0aW9uID0gVXRpbHMuc2F2ZVNlbGVjdGlvbigpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdGhpcy5vblRvdWNoZWQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcclxuICAgIH1cclxuICAgIHRoaXMuYmx1ci5lbWl0KCdibHVyJyk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXNpemluZyB0ZXh0IGFyZWFcclxuICAgKlxyXG4gICAqIEBwYXJhbSBvZmZzZXRZIHZlcnRpY2FsIGhlaWdodCBvZiB0aGUgZWlkdGFibGUgcG9ydGlvbiBvZiB0aGUgZWRpdG9yXHJcbiAgICovXHJcbiAgcmVzaXplVGV4dEFyZWEob2Zmc2V0WTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBsZXQgbmV3SGVpZ2h0ID0gcGFyc2VJbnQodGhpcy5oZWlnaHQsIDEwKTtcclxuICAgIG5ld0hlaWdodCArPSBvZmZzZXRZO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBuZXdIZWlnaHQgKyAncHgnO1xyXG4gICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIGFjdGlvbnMsIGkuZS4sIGV4ZWN1dGVzIGNvbW1hbmQgZnJvbSB0b29sYmFyXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29tbWFuZE5hbWUgbmFtZSBvZiB0aGUgY29tbWFuZCB0byBiZSBleGVjdXRlZFxyXG4gICAqL1xyXG4gIGV4ZWN1dGVDb21tYW5kKGNvbW1hbmROYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3IuZXhlY3V0ZShjb21tYW5kTmFtZSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBXcml0ZSBhIG5ldyB2YWx1ZSB0byB0aGUgZWxlbWVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB2YWx1ZSB2YWx1ZSB0byBiZSBleGVjdXRlZCB3aGVuIHRoZXJlIGlzIGEgY2hhbmdlIGluIGNvbnRlbnRlZGl0YWJsZVxyXG4gICAqL1xyXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xyXG5cclxuICAgIHRoaXMudG9nZ2xlUGxhY2Vob2xkZXIodmFsdWUpO1xyXG5cclxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJzxicj4nKSB7XHJcbiAgICAgIHZhbHVlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlZnJlc2hWaWV3KHZhbHVlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkXHJcbiAgICogd2hlbiB0aGUgY29udHJvbCByZWNlaXZlcyBhIGNoYW5nZSBldmVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmbiBhIGZ1bmN0aW9uXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZFxyXG4gICAqIHdoZW4gdGhlIGNvbnRyb2wgcmVjZWl2ZXMgYSB0b3VjaCBldmVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmbiBhIGZ1bmN0aW9uXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlZnJlc2ggdmlldy9IVE1MIG9mIHRoZSBlZGl0b3JcclxuICAgKlxyXG4gICAqIEBwYXJhbSB2YWx1ZSBodG1sIHN0cmluZyBmcm9tIHRoZSBlZGl0b3JcclxuICAgKi9cclxuICByZWZyZXNoVmlldyh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSB2YWx1ZSA9PT0gbnVsbCA/ICcnIDogdmFsdWU7XHJcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQsICdpbm5lckhUTUwnLCBub3JtYWxpemVkVmFsdWUpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdG9nZ2xlcyBwbGFjZWhvbGRlciBiYXNlZCBvbiBpbnB1dCBzdHJpbmdcclxuICAgKlxyXG4gICAqIEBwYXJhbSB2YWx1ZSBBIEhUTUwgc3RyaW5nIGZyb20gdGhlIGVkaXRvclxyXG4gICAqL1xyXG4gIHRvZ2dsZVBsYWNlaG9sZGVyKHZhbHVlOiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICghdmFsdWUgfHwgdmFsdWUgPT09ICc8YnI+JyB8fCB2YWx1ZSA9PT0gJycpIHtcclxuICAgICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5uZ3hXcmFwcGVyLm5hdGl2ZUVsZW1lbnQsICdzaG93LXBsYWNlaG9sZGVyJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLm5neFdyYXBwZXIubmF0aXZlRWxlbWVudCwgJ3Nob3ctcGxhY2Vob2xkZXInKTtcclxuICAgIH1cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgYSBqc29uIGNvbnRhaW5pbmcgaW5wdXQgcGFyYW1zXHJcbiAgICovXHJcbiAgZ2V0Q29sbGVjdGl2ZVBhcmFtcygpOiBhbnkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZWRpdGFibGU6IHRoaXMuZWRpdGFibGUsXHJcbiAgICAgIHNwZWxsY2hlY2s6IHRoaXMuc3BlbGxjaGVjayxcclxuICAgICAgcGxhY2Vob2xkZXI6IHRoaXMucGxhY2Vob2xkZXIsXHJcbiAgICAgIHRyYW5zbGF0ZTogdGhpcy50cmFuc2xhdGUsXHJcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgIG1pbkhlaWdodDogdGhpcy5taW5IZWlnaHQsXHJcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICBtaW5XaWR0aDogdGhpcy5taW5XaWR0aCxcclxuICAgICAgZW5hYmxlVG9vbGJhcjogdGhpcy5lbmFibGVUb29sYmFyLFxyXG4gICAgICBzaG93VG9vbGJhcjogdGhpcy5zaG93VG9vbGJhcixcclxuICAgICAgaW1hZ2VFbmRQb2ludDogdGhpcy5pbWFnZUVuZFBvaW50LFxyXG4gICAgICB0b29sYmFyOiB0aGlzLnRvb2xiYXJcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8qKlxyXG4gICAgICogc2V0IGNvbmZpZ3VhcnRpb25cclxuICAgICAqL1xyXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLlV0aWxzLmdldEVkaXRvckNvbmZpZ3VyYXRpb24odGhpcy5jb25maWcsIG5neEVkaXRvckNvbmZpZywgdGhpcy5nZXRDb2xsZWN0aXZlUGFyYW1zKCkpO1xyXG5cclxuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgfHwgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuXHJcbiAgICB0aGlzLmV4ZWN1dGVDb21tYW5kKCdlbmFibGVPYmplY3RSZXNpemluZycpO1xyXG5cclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5neEVkaXRvckNvbXBvbmVudCB9IGZyb20gJy4uL25neC1lZGl0b3IuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5neC1ncmlwcGllJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWdyaXBwaWUuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL25neC1ncmlwcGllLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBOZ3hHcmlwcGllQ29tcG9uZW50IHtcclxuXHJcbiAgLyoqIGhlaWdodCBvZiB0aGUgZWRpdG9yICovXHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgLyoqIHByZXZpb3VzIHZhbHVlIGJlZm9yIHJlc2l6aW5nIHRoZSBlZGl0b3IgKi9cclxuICBvbGRZID0gMDtcclxuICAvKiogc2V0IHRvIHRydWUgb24gbW91c2Vkb3duIGV2ZW50ICovXHJcbiAgZ3JhYmJlciA9IGZhbHNlO1xyXG5cclxuICAvKipcclxuICAgKiBDb25zdHJ1Y3RvclxyXG4gICAqXHJcbiAgICogQHBhcmFtIF9lZGl0b3JDb21wb25lbnQgRWRpdG9yIGNvbXBvbmVudFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VkaXRvckNvbXBvbmVudDogTmd4RWRpdG9yQ29tcG9uZW50KSB7IH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZXZlbnQgTW91c2VldmVudFxyXG4gICAqXHJcbiAgICogVXBkYXRlIHRoZSBoZWlnaHQgb2YgdGhlIGVkaXRvciB3aGVuIHRoZSBncmFiYmVyIGlzIGRyYWdnZWRcclxuICAgKi9cclxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZW1vdmUnLCBbJyRldmVudCddKSBvbk1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCkge1xyXG5cclxuICAgIGlmICghdGhpcy5ncmFiYmVyKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9lZGl0b3JDb21wb25lbnQucmVzaXplVGV4dEFyZWEoZXZlbnQuY2xpZW50WSAtIHRoaXMub2xkWSk7XHJcbiAgICB0aGlzLm9sZFkgPSBldmVudC5jbGllbnRZO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZXZlbnQgTW91c2VldmVudFxyXG4gICAqXHJcbiAgICogc2V0IHRoZSBncmFiYmVyIHRvIGZhbHNlIG9uIG1vdXNlIHVwIGFjdGlvblxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNldXAnLCBbJyRldmVudCddKSBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgIHRoaXMuZ3JhYmJlciA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnXSkgb25SZXNpemUoZXZlbnQ6IE1vdXNlRXZlbnQsIHJlc2l6ZXI/OiBGdW5jdGlvbikge1xyXG4gICAgdGhpcy5ncmFiYmVyID0gdHJ1ZTtcclxuICAgIHRoaXMub2xkWSA9IGV2ZW50LmNsaWVudFk7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbmd4LWVkaXRvci1tZXNzYWdlJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIE5neEVkaXRvck1lc3NhZ2VDb21wb25lbnQge1xyXG5cclxuICAvKiogcHJvcGVydHkgdGhhdCBob2xkcyB0aGUgbWVzc2FnZSB0byBiZSBkaXNwbGF5ZWQgb24gdGhlIGVkaXRvciAqL1xyXG4gIG5neE1lc3NhZ2UgPSB1bmRlZmluZWQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSBfbWVzc2FnZVNlcnZpY2Ugc2VydmljZSB0byBzZW5kIG1lc3NhZ2UgdG8gdGhlIGVkaXRvclxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX21lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge1xyXG4gICAgdGhpcy5fbWVzc2FnZVNlcnZpY2UuZ2V0TWVzc2FnZSgpLnN1YnNjcmliZSgobWVzc2FnZTogc3RyaW5nKSA9PiB0aGlzLm5neE1lc3NhZ2UgPSBtZXNzYWdlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNsZWFycyBlZGl0b3IgbWVzc2FnZVxyXG4gICAqL1xyXG4gIGNsZWFyTWVzc2FnZSgpOiB2b2lkIHtcclxuICAgIHRoaXMubmd4TWVzc2FnZSA9IHVuZGVmaW5lZDtcclxuICAgIHJldHVybjtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IEh0dHBSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgUG9wb3ZlckNvbmZpZyB9IGZyb20gJ25neC1ib290c3RyYXAnO1xyXG5pbXBvcnQgeyBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL2NvbW1hbmQtZXhlY3V0b3Iuc2VydmljZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL21lc3NhZ2Uuc2VydmljZSc7XHJcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL2NvbW1vbi91dGlscy9uZ3gtZWRpdG9yLnV0aWxzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5neC1lZGl0b3ItdG9vbGJhcicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1lZGl0b3ItdG9vbGJhci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWVkaXRvci10b29sYmFyLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgcHJvdmlkZXJzOiBbUG9wb3ZlckNvbmZpZ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBOZ3hFZGl0b3JUb29sYmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgLyoqIGhvbGRzIHZhbHVlcyBvZiB0aGUgaW5zZXJ0IGxpbmsgZm9ybSAqL1xyXG4gIHVybEZvcm06IEZvcm1Hcm91cDtcclxuICAvKiogaG9sZHMgdmFsdWVzIG9mIHRoZSBpbnNlcnQgaW1hZ2UgZm9ybSAqL1xyXG4gIGltYWdlRm9ybTogRm9ybUdyb3VwO1xyXG4gIC8qKiBob2xkcyB2YWx1ZXMgb2YgdGhlIGluc2VydCB2aWRlbyBmb3JtICovXHJcbiAgdmlkZW9Gb3JtOiBGb3JtR3JvdXA7XHJcbiAgLyoqIHNldCB0byBmYWxzZSB3aGVuIGltYWdlIGlzIGJlaW5nIHVwbG9hZGVkICovXHJcbiAgdXBsb2FkQ29tcGxldGUgPSB0cnVlO1xyXG4gIC8qKiB1cGxvYWQgcGVyY2VudGFnZSAqL1xyXG4gIHVwZGxvYWRQZXJjZW50YWdlID0gMDtcclxuICAvKiogc2V0IHRvIHRydWUgd2hlbiB0aGUgaW1hZ2UgaXMgYmVpbmcgdXBsb2FkZWQgKi9cclxuICBpc1VwbG9hZGluZyA9IGZhbHNlO1xyXG4gIC8qKiB3aGljaCB0YWIgdG8gYWN0aXZlIGZvciBjb2xvciBpbnNldGlvbiAqL1xyXG4gIHNlbGVjdGVkQ29sb3JUYWIgPSAndGV4dENvbG9yJztcclxuICAvKiogZm9udCBmYW1pbHkgbmFtZSAqL1xyXG4gIGZvbnROYW1lID0gJyc7XHJcbiAgLyoqIGZvbnQgc2l6ZSAqL1xyXG4gIGZvbnRTaXplID0gJyc7XHJcbiAgLyoqIGhleCBjb2xvciBjb2RlICovXHJcbiAgaGV4Q29sb3IgPSAnJztcclxuICAvKiogc2hvdy9oaWRlIGltYWdlIHVwbG9hZGVyICovXHJcbiAgaXNJbWFnZVVwbG9hZGVyID0gZmFsc2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIEVkaXRvciBjb25maWd1cmF0aW9uXHJcbiAgICovXHJcbiAgQElucHV0KCkgY29uZmlnOiBhbnk7XHJcbiAgQFZpZXdDaGlsZCgndXJsUG9wb3ZlcicpIHVybFBvcG92ZXI7XHJcbiAgQFZpZXdDaGlsZCgnaW1hZ2VQb3BvdmVyJykgaW1hZ2VQb3BvdmVyO1xyXG4gIEBWaWV3Q2hpbGQoJ3ZpZGVvUG9wb3ZlcicpIHZpZGVvUG9wb3ZlcjtcclxuICBAVmlld0NoaWxkKCdmb250U2l6ZVBvcG92ZXInKSBmb250U2l6ZVBvcG92ZXI7XHJcbiAgQFZpZXdDaGlsZCgnY29sb3JQb3BvdmVyJykgY29sb3JQb3BvdmVyO1xyXG4gIC8qKlxyXG4gICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gYSB0b29sYmFyIGJ1dHRvbiBpcyBjbGlja2VkXHJcbiAgICovXHJcbiAgQE91dHB1dCgpIGV4ZWN1dGU6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BvcE92ZXJDb25maWc6IFBvcG92ZXJDb25maWcsXHJcbiAgICBwcml2YXRlIF9mb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXHJcbiAgICBwcml2YXRlIF9tZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIF9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlOiBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlKSB7XHJcbiAgICB0aGlzLl9wb3BPdmVyQ29uZmlnLm91dHNpZGVDbGljayA9IHRydWU7XHJcbiAgICB0aGlzLl9wb3BPdmVyQ29uZmlnLnBsYWNlbWVudCA9ICdib3R0b20nO1xyXG4gICAgdGhpcy5fcG9wT3ZlckNvbmZpZy5jb250YWluZXIgPSAnYm9keSc7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBlbmFibGUgb3IgZGlhYmxlIHRvb2xiYXIgYmFzZWQgb24gY29uZmlndXJhdGlvblxyXG4gICAqXHJcbiAgICogQHBhcmFtIHZhbHVlIG5hbWUgb2YgdGhlIHRvb2xiYXIgYnV0dG9uc1xyXG4gICAqL1xyXG4gIGNhbkVuYWJsZVRvb2xiYXJPcHRpb25zKHZhbHVlKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gVXRpbHMuY2FuRW5hYmxlVG9vbGJhck9wdGlvbnModmFsdWUsIHRoaXMuY29uZmlnWyd0b29sYmFyJ10pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdHJpZ2dlcnMgY29tbWFuZCBmcm9tIHRoZSB0b29sYmFyIHRvIGJlIGV4ZWN1dGVkIGFuZCBlbWl0cyBhbiBldmVudFxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvbW1hbmQgbmFtZSBvZiB0aGUgY29tbWFuZCB0byBiZSBleGVjdXRlZFxyXG4gICAqL1xyXG4gIHRyaWdnZXJDb21tYW5kKGNvbW1hbmQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5leGVjdXRlLmVtaXQoY29tbWFuZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjcmVhdGUgVVJMIGluc2VydCBmb3JtXHJcbiAgICovXHJcbiAgYnVpbGRVcmxGb3JtKCk6IHZvaWQge1xyXG5cclxuICAgIHRoaXMudXJsRm9ybSA9IHRoaXMuX2Zvcm1CdWlsZGVyLmdyb3VwKHtcclxuICAgICAgdXJsTGluazogWycnLCBbVmFsaWRhdG9ycy5yZXF1aXJlZF1dLFxyXG4gICAgICB1cmxUZXh0OiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXHJcbiAgICAgIHVybE5ld1RhYjogW3RydWVdXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBpbnNlcnRzIGxpbmsgaW4gdGhlIGVkaXRvclxyXG4gICAqL1xyXG4gIGluc2VydExpbmsoKTogdm9pZCB7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5jcmVhdGVMaW5rKHRoaXMudXJsRm9ybS52YWx1ZSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogcmVzZXQgZm9ybSB0byBkZWZhdWx0ICovXHJcbiAgICB0aGlzLmJ1aWxkVXJsRm9ybSgpO1xyXG4gICAgLyoqIGNsb3NlIGluc2V0IFVSTCBwb3AgdXAgKi9cclxuICAgIHRoaXMudXJsUG9wb3Zlci5oaWRlKCk7XHJcblxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY3JlYXRlIGluc2VydCBpbWFnZSBmb3JtXHJcbiAgICovXHJcbiAgYnVpbGRJbWFnZUZvcm0oKTogdm9pZCB7XHJcblxyXG4gICAgdGhpcy5pbWFnZUZvcm0gPSB0aGlzLl9mb3JtQnVpbGRlci5ncm91cCh7XHJcbiAgICAgIGltYWdlVXJsOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNyZWF0ZSBpbnNlcnQgaW1hZ2UgZm9ybVxyXG4gICAqL1xyXG4gIGJ1aWxkVmlkZW9Gb3JtKCk6IHZvaWQge1xyXG5cclxuICAgIHRoaXMudmlkZW9Gb3JtID0gdGhpcy5fZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICB2aWRlb1VybDogWycnLCBbVmFsaWRhdG9ycy5yZXF1aXJlZF1dLFxyXG4gICAgICBoZWlnaHQ6IFsnJ10sXHJcbiAgICAgIHdpZHRoOiBbJyddXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeGVjdXRlZCB3aGVuIGZpbGUgaXMgc2VsZWN0ZWRcclxuICAgKlxyXG4gICAqIEBwYXJhbSBlIG9uQ2hhbmdlIGV2ZW50XHJcbiAgICovXHJcbiAgb25GaWxlQ2hhbmdlKGUpOiB2b2lkIHtcclxuXHJcbiAgICB0aGlzLnVwbG9hZENvbXBsZXRlID0gZmFsc2U7XHJcbiAgICB0aGlzLmlzVXBsb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoZS50YXJnZXQuZmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICBjb25zdCBmaWxlID0gZS50YXJnZXQuZmlsZXNbMF07XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UudXBsb2FkSW1hZ2UoZmlsZSwgdGhpcy5jb25maWcuaW1hZ2VFbmRQb2ludCkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcclxuXHJcbiAgICAgICAgICBpZiAoZXZlbnQudHlwZSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGxvYWRQZXJjZW50YWdlID0gTWF0aC5yb3VuZCgxMDAgKiBldmVudC5sb2FkZWQgLyBldmVudC50b3RhbCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgSHR0cFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5pbnNlcnRJbWFnZShldmVudC5ib2R5LnVybCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy51cGxvYWRDb21wbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICB0aGlzLnVwbG9hZENvbXBsZXRlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmlzVXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqIGluc2VydCBpbWFnZSBpbiB0aGUgZWRpdG9yICovXHJcbiAgaW5zZXJ0SW1hZ2UoKTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmluc2VydEltYWdlKHRoaXMuaW1hZ2VGb3JtLnZhbHVlLmltYWdlVXJsKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiByZXNldCBmb3JtIHRvIGRlZmF1bHQgKi9cclxuICAgIHRoaXMuYnVpbGRJbWFnZUZvcm0oKTtcclxuICAgIC8qKiBjbG9zZSBpbnNldCBVUkwgcG9wIHVwICovXHJcbiAgICB0aGlzLmltYWdlUG9wb3Zlci5oaWRlKCk7XHJcblxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqIGluc2VydCBpbWFnZSBpbiB0aGUgZWRpdG9yICovXHJcbiAgaW5zZXJ0VmlkZW8oKTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmluc2VydFZpZGVvKHRoaXMudmlkZW9Gb3JtLnZhbHVlKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiByZXNldCBmb3JtIHRvIGRlZmF1bHQgKi9cclxuICAgIHRoaXMuYnVpbGRWaWRlb0Zvcm0oKTtcclxuICAgIC8qKiBjbG9zZSBpbnNldCBVUkwgcG9wIHVwICovXHJcbiAgICB0aGlzLnZpZGVvUG9wb3Zlci5oaWRlKCk7XHJcblxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqIGluc2VyIHRleHQvYmFja2dyb3VuZCBjb2xvciAqL1xyXG4gIGluc2VydENvbG9yKGNvbG9yOiBzdHJpbmcsIHdoZXJlOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmluc2VydENvbG9yKGNvbG9yLCB3aGVyZSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbG9yUG9wb3Zlci5oaWRlKCk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvKiogc2V0IGZvbnQgc2l6ZSAqL1xyXG4gIHNldEZvbnRTaXplKGZvbnRTaXplOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLnNldEZvbnRTaXplKGZvbnRTaXplKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZm9udFNpemVQb3BvdmVyLmhpZGUoKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qKiBzZXQgZm9udCBOYW1lL2ZhbWlseSAqL1xyXG4gIHNldEZvbnROYW1lKGZvbnROYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLnNldEZvbnROYW1lKGZvbnROYW1lKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZm9udFNpemVQb3BvdmVyLmhpZGUoKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5idWlsZFVybEZvcm0oKTtcclxuICAgIHRoaXMuYnVpbGRJbWFnZUZvcm0oKTtcclxuICAgIHRoaXMuYnVpbGRWaWRlb0Zvcm0oKTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBQb3BvdmVyTW9kdWxlIH0gZnJvbSAnbmd4LWJvb3RzdHJhcCc7XHJcbmltcG9ydCB7IE5neEVkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWVkaXRvci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOZ3hHcmlwcGllQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ3JpcHBpZS9uZ3gtZ3JpcHBpZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOZ3hFZGl0b3JNZXNzYWdlQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZWRpdG9yLW1lc3NhZ2Uvbmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5neEVkaXRvclRvb2xiYXJDb21wb25lbnQgfSBmcm9tICcuL25neC1lZGl0b3ItdG9vbGJhci9uZ3gtZWRpdG9yLXRvb2xiYXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlIH0gZnJvbSAnLi9jb21tb24vc2VydmljZXMvY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUsIFBvcG92ZXJNb2R1bGUuZm9yUm9vdCgpXSxcclxuICBkZWNsYXJhdGlvbnM6IFtOZ3hFZGl0b3JDb21wb25lbnQsIE5neEdyaXBwaWVDb21wb25lbnQsIE5neEVkaXRvck1lc3NhZ2VDb21wb25lbnQsIE5neEVkaXRvclRvb2xiYXJDb21wb25lbnRdLFxyXG4gIGV4cG9ydHM6IFtOZ3hFZGl0b3JDb21wb25lbnQsIFBvcG92ZXJNb2R1bGVdLFxyXG4gIHByb3ZpZGVyczogW0NvbW1hbmRFeGVjdXRvclNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIE5neEVkaXRvck1vZHVsZSB7IH1cclxuIl0sIm5hbWVzIjpbIlV0aWxzLnJlc3RvcmVTZWxlY3Rpb24iLCJVdGlscy5zYXZlU2VsZWN0aW9uIiwiVXRpbHMuY2FuRW5hYmxlVG9vbGJhck9wdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLGlDQUF3QyxLQUFhLEVBQUUsT0FBWTtJQUVqRSxJQUFJLEtBQUssRUFBRTtRQUVULElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQztTQUNiO2FBQU07O1lBRUwsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLO2dCQUNoQyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDcEMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7U0FDcEM7S0FDRjtTQUFNO1FBQ0wsT0FBTyxLQUFLLENBQUM7S0FDZDtDQUNGOzs7Ozs7Ozs7QUFTRCxnQ0FBdUMsS0FBVSxFQUFFLGVBQW9CLEVBQUUsS0FBVTtJQUVqRixLQUFLLE1BQU0sQ0FBQyxJQUFJLGVBQWUsRUFBRTtRQUMvQixJQUFJLENBQUMsRUFBRTtZQUVMLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDMUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNyQjtZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUM1QixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFD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