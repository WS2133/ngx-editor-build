/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { PopoverConfig } from 'ngx-bootstrap';
import { CommandExecutorService } from '../common/services/command-executor.service';
import { MessageService } from '../common/services/message.service';
import * as Utils from '../common/utils/ngx-editor.utils';
export class NgxEditorToolbarComponent {
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
        return Utils.canEnableToolbarOptions(value, this.config['toolbar']);
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
if (false) {
    /**
     * holds values of the insert link form
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.urlForm;
    /**
     * holds values of the insert image form
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.imageForm;
    /**
     * holds values of the insert video form
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.videoForm;
    /**
     * set to false when image is being uploaded
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.uploadComplete;
    /**
     * upload percentage
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.updloadPercentage;
    /**
     * set to true when the image is being uploaded
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.isUploading;
    /**
     * which tab to active for color insetion
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.selectedColorTab;
    /**
     * font family name
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.fontName;
    /**
     * font size
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.fontSize;
    /**
     * hex color code
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.hexColor;
    /**
     * show/hide image uploader
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.isImageUploader;
    /**
     * Editor configuration
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.config;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype.urlPopover;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype.imagePopover;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype.videoPopover;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype.fontSizePopover;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype.colorPopover;
    /**
     * Emits an event when a toolbar button is clicked
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.execute;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype._popOverConfig;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype._formBuilder;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype._messageService;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype._commandExecutorService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci10b29sYmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lZGl0b3IvIiwic291cmNlcyI6WyJhcHAvbmd4LWVkaXRvci9uZ3gtZWRpdG9yLXRvb2xiYXIvbmd4LWVkaXRvci10b29sYmFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBVSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUYsT0FBTyxFQUFFLFdBQVcsRUFBYSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDcEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNyRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDcEUsT0FBTyxLQUFLLEtBQUssTUFBTSxrQ0FBa0MsQ0FBQztBQVMxRCxNQUFNOzs7Ozs7O0lBdUNKLFlBQW9CLGNBQTZCLEVBQ3ZDLGNBQ0EsaUJBQ0E7UUFIVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUN2QyxpQkFBWSxHQUFaLFlBQVk7UUFDWixvQkFBZSxHQUFmLGVBQWU7UUFDZiw0QkFBdUIsR0FBdkIsdUJBQXVCOzs7OzhCQWpDaEIsSUFBSTs7OztpQ0FFRCxDQUFDOzs7OzJCQUVQLEtBQUs7Ozs7Z0NBRUEsV0FBVzs7Ozt3QkFFbkIsRUFBRTs7Ozt3QkFFRixFQUFFOzs7O3dCQUVGLEVBQUU7Ozs7K0JBRUssS0FBSzs7Ozt1QkFjbUIsSUFBSSxZQUFZLEVBQVU7UUFNbEUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxH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QUF3QjtnQkFDbEMsbzFoQkFBa0Q7Z0JBRWxELFNBQVMsRUFBRSxDQUFDLGFBQWEsQ0FBQzs7YUFDM0I7Ozs7WUFWUSxhQUFhO1lBRmIsV0FBVztZQUlYLGNBQWM7WUFEZCxzQkFBc0I7OztxQkF1QzVCLEtBQUs7eUJBQ0wsU0FBUyxTQUFDLFlBQVk7MkJBQ3RCLFNBQVMsU0FBQyxjQUFjOzJCQUN4QixTQUFTLFNBQUMsY0FBYzs4QkFDeEIsU0FBUyxTQUFDLGlCQUFpQjsyQkFDM0IsU0FBUyxTQUFDLGNBQWM7c0JBSXhCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgSHR0cFJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBQb3BvdmVyQ29uZmlnIH0gZnJvbSAnbmd4LWJvb3RzdHJhcCc7XHJcbmltcG9ydCB7IENvbW1hbmRFeGVjdXRvclNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcclxuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vY29tbW9uL3V0aWxzL25neC1lZGl0b3IudXRpbHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbmd4LWVkaXRvci10b29sYmFyJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWVkaXRvci10b29sYmFyLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZWRpdG9yLXRvb2xiYXIuY29tcG9uZW50LnNjc3MnXSxcclxuICBwcm92aWRlcnM6IFtQb3BvdmVyQ29uZmlnXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIE5neEVkaXRvclRvb2xiYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICAvKiogaG9sZHMgdmFsdWVzIG9mIHRoZSBpbnNlcnQgbGluayBmb3JtICovXHJcbiAgdXJsRm9ybTogRm9ybUdyb3VwO1xyXG4gIC8qKiBob2xkcyB2YWx1ZXMgb2YgdGhlIGluc2VydCBpbWFnZSBmb3JtICovXHJcbiAgaW1hZ2VGb3JtOiBGb3JtR3JvdXA7XHJcbiAgLyoqIGhvbGRzIHZhbHVlcyBvZiB0aGUgaW5zZXJ0IHZpZGVvIGZvcm0gKi9cclxuICB2aWRlb0Zvcm06IEZvcm1Hcm91cDtcclxuICAvKiogc2V0IHRvIGZhbHNlIHdoZW4gaW1hZ2UgaXMgYmVpbmcgdXBsb2FkZWQgKi9cclxuICB1cGxvYWRDb21wbGV0ZSA9IHRydWU7XHJcbiAgLyoqIHVwbG9hZCBwZXJjZW50YWdlICovXHJcbiAgdXBkbG9hZFBlcmNlbnRhZ2UgPSAwO1xyXG4gIC8qKiBzZXQgdG8gdHJ1ZSB3aGVuIHRoZSBpbWFnZSBpcyBiZWluZyB1cGxvYWRlZCAqL1xyXG4gIGlzVXBsb2FkaW5nID0gZmFsc2U7XHJcbiAgLyoqIHdoaWNoIHRhYiB0byBhY3RpdmUgZm9yIGNvbG9yIGluc2V0aW9uICovXHJcbiAgc2VsZWN0ZWRDb2xvclRhYiA9ICd0ZXh0Q29sb3InO1xyXG4gIC8qKiBmb250IGZhbWlseSBuYW1lICovXHJcbiAgZm9udE5hbWUgPSAnJztcclxuICAvKiogZm9udCBzaXplICovXHJcbiAgZm9udFNpemUgPSAnJztcclxuICAvKiogaGV4IGNvbG9yIGNvZGUgKi9cclxuICBoZXhDb2xvciA9ICcnO1xyXG4gIC8qKiBzaG93L2hpZGUgaW1hZ2UgdXBsb2FkZXIgKi9cclxuICBpc0ltYWdlVXBsb2FkZXIgPSBmYWxzZTtcclxuXHJcbiAgLyoqXHJcbiAgICogRWRpdG9yIGNvbmZpZ3VyYXRpb25cclxuICAgKi9cclxuICBASW5wdXQoKSBjb25maWc6IGFueTtcclxuICBAVmlld0NoaWxkKCd1cmxQb3BvdmVyJykgdXJsUG9wb3ZlcjtcclxuICBAVmlld0NoaWxkKCdpbWFnZVBvcG92ZXInKSBpbWFnZVBvcG92ZXI7XHJcbiAgQFZpZXdDaGlsZCgndmlkZW9Qb3BvdmVyJykgdmlkZW9Qb3BvdmVyO1xyXG4gIEBWaWV3Q2hpbGQoJ2ZvbnRTaXplUG9wb3ZlcicpIGZvbnRTaXplUG9wb3ZlcjtcclxuICBAVmlld0NoaWxkKCdjb2xvclBvcG92ZXInKSBjb2xvclBvcG92ZXI7XHJcbiAgLyoqXHJcbiAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiBhIHRvb2xiYXIgYnV0dG9uIGlzIGNsaWNrZWRcclxuICAgKi9cclxuICBAT3V0cHV0KCkgZXhlY3V0ZTogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcG9wT3ZlckNvbmZpZzogUG9wb3ZlckNvbmZpZyxcclxuICAgIHByaXZhdGUgX2Zvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcclxuICAgIHByaXZhdGUgX21lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSxcclxuICAgIHByaXZhdGUgX2NvbW1hbmRFeGVjdXRvclNlcnZpY2U6IENvbW1hbmRFeGVjdXRvclNlcnZpY2UpIHtcclxuICAgIHRoaXMuX3BvcE92ZXJDb25maWcub3V0c2lkZUNsaWNrID0gdHJ1ZTtcclxuICAgIHRoaXMuX3BvcE92ZXJDb25maWcucGxhY2VtZW50ID0gJ2JvdHRvbSc7XHJcbiAgICB0aGlzLl9wb3BPdmVyQ29uZmlnLmNvbnRhaW5lciA9ICdib2R5JztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGVuYWJsZSBvciBkaWFibGUgdG9vbGJhciBiYXNlZCBvbiBjb25maWd1cmF0aW9uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdmFsdWUgbmFtZSBvZiB0aGUgdG9vbGJhciBidXR0b25zXHJcbiAgICovXHJcbiAgY2FuRW5hYmxlVG9vbGJhck9wdGlvbnModmFsdWUpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBVdGlscy5jYW5FbmFibGVUb29sYmFyT3B0aW9ucyh2YWx1ZSwgdGhpcy5jb25maWdbJ3Rvb2xiYXInXSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiB0cmlnZ2VycyBjb21tYW5kIGZyb20gdGhlIHRvb2xiYXIgdG8gYmUgZXhlY3V0ZWQgYW5kIGVtaXRzIGFuIGV2ZW50XHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29tbWFuZCBuYW1lIG9mIHRoZSBjb21tYW5kIHRvIGJlIGV4ZWN1dGVkXHJcbiAgICovXHJcbiAgdHJpZ2dlckNvbW1hbmQoY29tbWFuZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLmV4ZWN1dGUuZW1pdChjb21tYW5kKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNyZWF0ZSBVUkwgaW5zZXJ0IGZvcm1cclxuICAgKi9cclxuICBidWlsZFVybEZvcm0oKTogdm9pZCB7XHJcblxyXG4gICAgdGhpcy51cmxGb3JtID0gdGhpcy5fZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICB1cmxMaW5rOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXHJcbiAgICAgIHVybFRleHQ6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWRdXSxcclxuICAgICAgdXJsTmV3VGFiOiBbdHJ1ZV1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGluc2VydHMgbGluayBpbiB0aGUgZWRpdG9yXHJcbiAgICovXHJcbiAgaW5zZXJ0TGluaygpOiB2b2lkIHtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmNyZWF0ZUxpbmsodGhpcy51cmxGb3JtLnZhbHVlKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiByZXNldCBmb3JtIHRvIGRlZmF1bHQgKi9cclxuICAgIHRoaXMuYnVpbGRVcmxGb3JtKCk7XHJcbiAgICAvKiogY2xvc2UgaW5zZXQgVVJMIHBvcCB1cCAqL1xyXG4gICAgdGhpcy51cmxQb3BvdmVyLmhpZGUoKTtcclxuXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjcmVhdGUgaW5zZXJ0IGltYWdlIGZvcm1cclxuICAgKi9cclxuICBidWlsZEltYWdlRm9ybSgpOiB2b2lkIHtcclxuXHJcbiAgICB0aGlzLmltYWdlRm9ybSA9IHRoaXMuX2Zvcm1CdWlsZGVyLmdyb3VwKHtcclxuICAgICAgaW1hZ2VVcmw6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWRdXVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY3JlYXRlIGluc2VydCBpbWFnZSBmb3JtXHJcbiAgICovXHJcbiAgYnVpbGRWaWRlb0Zvcm0oKTogdm9pZCB7XHJcblxyXG4gICAgdGhpcy52aWRlb0Zvcm0gPSB0aGlzLl9mb3JtQnVpbGRlci5ncm91cCh7XHJcbiAgICAgIHZpZGVvVXJsOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXHJcbiAgICAgIGhlaWdodDogWycnXSxcclxuICAgICAgd2lkdGg6IFsnJ11cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4ZWN1dGVkIHdoZW4gZmlsZSBpcyBzZWxlY3RlZFxyXG4gICAqXHJcbiAgICogQHBhcmFtIGUgb25DaGFuZ2UgZXZlbnRcclxuICAgKi9cclxuICBvbkZpbGVDaGFuZ2UoZSk6IHZvaWQge1xyXG5cclxuICAgIHRoaXMudXBsb2FkQ29tcGxldGUgPSBmYWxzZTtcclxuICAgIHRoaXMuaXNVcGxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgIGlmIChlLnRhcmdldC5maWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGNvbnN0IGZpbGUgPSBlLnRhcmdldC5maWxlc1swXTtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS51cGxvYWRJbWFnZShmaWxlLCB0aGlzLmNvbmZpZy5pbWFnZUVuZFBvaW50KS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xyXG5cclxuICAgICAgICAgIGlmIChldmVudC50eXBlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkbG9hZFBlcmNlbnRhZ2UgPSBNYXRoLnJvdW5kKDEwMCAqIGV2ZW50LmxvYWRlZCAvIGV2ZW50LnRvdGFsKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBIdHRwUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmluc2VydEltYWdlKGV2ZW50LmJvZHkudXJsKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnVwbG9hZENvbXBsZXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5pc1VwbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMudXBsb2FkQ29tcGxldGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvKiogaW5zZXJ0IGltYWdlIGluIHRoZSBlZGl0b3IgKi9cclxuICBpbnNlcnRJbWFnZSgpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0SW1hZ2UodGhpcy5pbWFnZUZvcm0udmFsdWUuaW1hZ2VVcmwpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHJlc2V0IGZvcm0gdG8gZGVmYXVsdCAqL1xyXG4gICAgdGhpcy5idWlsZEltYWdlRm9ybSgpO1xyXG4gICAgLyoqIGNsb3NlIGluc2V0IFVSTCBwb3AgdXAgKi9cclxuICAgIHRoaXMuaW1hZ2VQb3BvdmVyLmhpZGUoKTtcclxuXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvKiogaW5zZXJ0IGltYWdlIGluIHRoZSBlZGl0b3IgKi9cclxuICBpbnNlcnRWaWRlbygpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0VmlkZW8odGhpcy52aWRlb0Zvcm0udmFsdWUpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHJlc2V0IGZvcm0gdG8gZGVmYXVsdCAqL1xyXG4gICAgdGhpcy5idWlsZFZpZGVvRm9ybSgpO1xyXG4gICAgLyoqIGNsb3NlIGluc2V0IFVSTCBwb3AgdXAgKi9cclxuICAgIHRoaXMudmlkZW9Qb3BvdmVyLmhpZGUoKTtcclxuXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvKiogaW5zZXIgdGV4dC9iYWNrZ3JvdW5kIGNvbG9yICovXHJcbiAgaW5zZXJ0Q29sb3IoY29sb3I6IHN0cmluZywgd2hlcmU6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0Q29sb3IoY29sb3IsIHdoZXJlKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29sb3JQb3BvdmVyLmhpZGUoKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qKiBzZXQgZm9udCBzaXplICovXHJcbiAgc2V0Rm9udFNpemUoZm9udFNpemU6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2Uuc2V0Rm9udFNpemUoZm9udFNpemUpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5mb250U2l6ZVBvcG92ZXIuaGlkZSgpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqIHNldCBmb250IE5hbWUvZmFtaWx5ICovXHJcbiAgc2V0Rm9udE5hbWUoZm9udE5hbWU6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2Uuc2V0Rm9udE5hbWUoZm9udE5hbWUpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5mb250U2l6ZVBvcG92ZXIuaGlkZSgpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmJ1aWxkVXJsRm9ybSgpO1xyXG4gICAgdGhpcy5idWlsZEltYWdlRm9ybSgpO1xyXG4gICAgdGhpcy5idWlsZFZpZGVvRm9ybSgpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19