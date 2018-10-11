/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, ViewChild, EventEmitter, Renderer2, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommandExecutorService } from './common/services/command-executor.service';
import { MessageService } from './common/services/message.service';
import { ngxEditorConfig } from './common/ngx-editor.defaults';
import * as Utils from './common/utils/ngx-editor.utils';
var NgxEditorComponent = /** @class */ (function () {
    /**
     * @param _messageService service to send message to the editor message component
     * @param _commandExecutor executes command from the toolbar
     * @param _renderer access and manipulate the dom element
     */
    function NgxEditorComponent(_messageService, _commandExecutor, _renderer) {
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
     */
    /**
     * events
     * @return {?}
     */
    NgxEditorComponent.prototype.onTextAreaFocus = /**
     * events
     * @return {?}
     */
    function () {
        this.focus.emit('focus');
        return;
    };
    /** focus the text area when the editor is focussed */
    /**
     * focus the text area when the editor is focussed
     * @return {?}
     */
    NgxEditorComponent.prototype.onEditorFocus = /**
     * focus the text area when the editor is focussed
     * @return {?}
     */
    function () {
        this.textArea.nativeElement.focus();
    };
    /**
     * Executed from the contenteditable section while the input property changes
     * @param html html string from contenteditable
     */
    /**
     * Executed from the contenteditable section while the input property changes
     * @param {?} html html string from contenteditable
     * @return {?}
     */
    NgxEditorComponent.prototype.onContentChange = /**
     * Executed from the contenteditable section while the input property changes
     * @param {?} html html string from contenteditable
     * @return {?}
     */
    function (html) {
        if (typeof this.onChange === 'function') {
            this.onChange(html);
            this.togglePlaceholder(html);
        }
        return;
    };
    /**
     * @return {?}
     */
    NgxEditorComponent.prototype.onTextAreaBlur = /**
     * @return {?}
     */
    function () {
        /** save selection if focussed out */
        this._commandExecutor.savedSelection = Utils.saveSelection();
        if (typeof this.onTouched === 'function') {
            this.onTouched();
        }
        this.blur.emit('blur');
        return;
    };
    /**
     * resizing text area
     *
     * @param offsetY vertical height of the eidtable portion of the editor
     */
    /**
     * resizing text area
     *
     * @param {?} offsetY vertical height of the eidtable portion of the editor
     * @return {?}
     */
    NgxEditorComponent.prototype.resizeTextArea = /**
     * resizing text area
     *
     * @param {?} offsetY vertical height of the eidtable portion of the editor
     * @return {?}
     */
    function (offsetY) {
        /** @type {?} */
        var newHeight = parseInt(this.height, 10);
        newHeight += offsetY;
        this.height = newHeight + 'px';
        this.textArea.nativeElement.style.height = this.height;
        return;
    };
    /**
     * editor actions, i.e., executes command from toolbar
     *
     * @param commandName name of the command to be executed
     */
    /**
     * editor actions, i.e., executes command from toolbar
     *
     * @param {?} commandName name of the command to be executed
     * @return {?}
     */
    NgxEditorComponent.prototype.executeCommand = /**
     * editor actions, i.e., executes command from toolbar
     *
     * @param {?} commandName name of the command to be executed
     * @return {?}
     */
    function (commandName) {
        try {
            this._commandExecutor.execute(commandName);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        return;
    };
    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    /**
     * Write a new value to the element.
     *
     * @param {?} value value to be executed when there is a change in contenteditable
     * @return {?}
     */
    NgxEditorComponent.prototype.writeValue = /**
     * Write a new value to the element.
     *
     * @param {?} value value to be executed when there is a change in contenteditable
     * @return {?}
     */
    function (value) {
        this.togglePlaceholder(value);
        if (value === null || value === undefined || value === '' || value === '<br>') {
            value = null;
        }
        this.refreshView(value);
    };
    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    NgxEditorComponent.prototype.registerOnChange = /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    function (fn) {
        this.onChange = fn;
    };
    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    NgxEditorComponent.prototype.registerOnTouched = /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    function (fn) {
        this.onTouched = fn;
    };
    /**
     * refresh view/HTML of the editor
     *
     * @param value html string from the editor
     */
    /**
     * refresh view/HTML of the editor
     *
     * @param {?} value html string from the editor
     * @return {?}
     */
    NgxEditorComponent.prototype.refreshView = /**
     * refresh view/HTML of the editor
     *
     * @param {?} value html string from the editor
     * @return {?}
     */
    function (value) {
        /** @type {?} */
        var normalizedValue = value === null ? '' : value;
        this._renderer.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);
        return;
    };
    /**
     * toggles placeholder based on input string
     *
     * @param value A HTML string from the editor
     */
    /**
     * toggles placeholder based on input string
     *
     * @param {?} value A HTML string from the editor
     * @return {?}
     */
    NgxEditorComponent.prototype.togglePlaceholder = /**
     * toggles placeholder based on input string
     *
     * @param {?} value A HTML string from the editor
     * @return {?}
     */
    function (value) {
        if (!value || value === '<br>' || value === '') {
            this._renderer.addClass(this.ngxWrapper.nativeElement, 'show-placeholder');
        }
        else {
            this._renderer.removeClass(this.ngxWrapper.nativeElement, 'show-placeholder');
        }
        return;
    };
    /**
     * returns a json containing input params
     */
    /**
     * returns a json containing input params
     * @return {?}
     */
    NgxEditorComponent.prototype.getCollectiveParams = /**
     * returns a json containing input params
     * @return {?}
     */
    function () {
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
    };
    /**
     * @return {?}
     */
    NgxEditorComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        /**
             * set configuartion
             */
        this.config = this.Utils.getEditorConfiguration(this.config, ngxEditorConfig, this.getCollectiveParams());
        this.height = this.height || this.textArea.nativeElement.offsetHeight;
        this.executeCommand('enableObjectResizing');
    };
    NgxEditorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-ngx-editor',
                    template: "<div class=\"ngx-editor\" id=\"ngxEditor\" [style.width]=\"config['width']\" [style.minWidth]=\"config['minWidth']\" tabindex=\"0\"\r\n  (focus)=\"onEditorFocus()\">\r\n\r\n  <app-ngx-editor-toolbar [config]=\"config\" (execute)=\"executeCommand($event)\"></app-ngx-editor-toolbar>\r\n\r\n  <!-- text area -->\r\n  <div class=\"ngx-wrapper\" #ngxWrapper>\r\n    <div class=\"ngx-editor-textarea\" [attr.contenteditable]=\"config['editable']\" (input)=\"onContentChange($event.target.innerHTML)\"\r\n      [attr.translate]=\"config['translate']\" [attr.spellcheck]=\"config['spellcheck']\" [style.height]=\"config['height']\"\r\n      [style.minHeight]=\"config['minHeight']\" [style.resize]=\"Utils?.canResize(resizer)\" (focus)=\"onTextAreaFocus()\"\r\n      (blur)=\"onTextAreaBlur()\" #ngxTextArea></div>\r\n\r\n    <span class=\"ngx-editor-placeholder\">{{ placeholder || config['placeholder'] }}</span>\r\n  </div>\r\n\r\n  <app-ngx-editor-message></app-ngx-editor-message>\r\n  <app-ngx-grippie *ngIf=\"resizer === 'stack'\"></app-ngx-grippie>\r\n\r\n</div>\r\n",
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return NgxEditorComponent; }),
                            multi: true
                        }
                    ],
                    styles: [".ngx-editor{position:relative}.ngx-editor ::ng-deep [contenteditable=true]:empty:before{content:attr(placeholder);display:block;color:#868e96;opacity:1}.ngx-editor .ngx-wrapper{position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea{min-height:5rem;padding:.5rem .8rem 1rem;border:1px solid #ddd;background-color:transparent;overflow-x:hidden;overflow-y:auto;z-index:2;position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea.focus,.ngx-editor .ngx-wrapper .ngx-editor-textarea:focus{outline:0}.ngx-editor .ngx-wrapper .ngx-editor-textarea ::ng-deep blockquote{margin-left:1rem;border-left:.2em solid #dfe2e5;padding-left:.5rem}.ngx-editor .ngx-wrapper ::ng-deep p{margin-bottom:0}.ngx-editor .ngx-wrapper .ngx-editor-placeholder{display:none;position:absolute;top:0;padding:.5rem .8rem 1rem .9rem;z-index:1;color:#6c757d;opacity:1}.ngx-editor .ngx-wrapper.show-placeholder .ngx-editor-placeholder{display:block}"]
                }] }
    ];
    /** @nocollapse */
    NgxEditorComponent.ctorParameters = function () { return [
        { type: MessageService },
        { type: CommandExecutorService },
        { type: Renderer2 }
    ]; };
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
    return NgxEditorComponent;
}());
export { NgxEditorComponent };
if (false) {
    /**
     * Specifies weather the textarea to be editable or not
     * @type {?}
     */
    NgxEditorComponent.prototype.editable;
    /**
     * The spellcheck property specifies whether the element is to have its spelling and grammar checked or not.
     * @type {?}
     */
    NgxEditorComponent.prototype.spellcheck;
    /**
     * Placeholder for the textArea
     * @type {?}
     */
    NgxEditorComponent.prototype.placeholder;
    /**
     * The translate property specifies whether the content of an element should be translated or not.
     *
     * Check https://www.w3schools.com/tags/att_global_translate.asp for more information and browser support
     * @type {?}
     */
    NgxEditorComponent.prototype.translate;
    /**
     * Sets height of the editor
     * @type {?}
     */
    NgxEditorComponent.prototype.height;
    /**
     * Sets minimum height for the editor
     * @type {?}
     */
    NgxEditorComponent.prototype.minHeight;
    /**
     * Sets Width of the editor
     * @type {?}
     */
    NgxEditorComponent.prototype.width;
    /**
     * Sets minimum width of the editor
     * @type {?}
     */
    NgxEditorComponent.prototype.minWidth;
    /**
     * Toolbar accepts an array which specifies the options to be enabled for the toolbar
     *
     * Check ngxEditorConfig for toolbar configuration
     *
     * Passing an empty array will enable all toolbar
     * @type {?}
     */
    NgxEditorComponent.prototype.toolbar;
    /**
     * The editor can be resized vertically.
     *
     * `basic` resizer enables the html5 reszier. Check here https://www.w3schools.com/cssref/css3_pr_resize.asp
     *
     * `stack` resizer enable a resizer that looks like as if in https://stackoverflow.com
     * @type {?}
     */
    NgxEditorComponent.prototype.resizer;
    /**
     * The config property is a JSON object
     *
     * All avaibale inputs inputs can be provided in the configuration as JSON
     * inputs provided directly are considered as top priority
     * @type {?}
     */
    NgxEditorComponent.prototype.config;
    /**
     * Weather to show or hide toolbar
     * @type {?}
     */
    NgxEditorComponent.prototype.showToolbar;
    /**
     * Weather to enable or disable the toolbar
     * @type {?}
     */
    NgxEditorComponent.prototype.enableToolbar;
    /**
     * Endpoint for which the image to be uploaded
     * @type {?}
     */
    NgxEditorComponent.prototype.imageEndPoint;
    /**
     * emits `blur` event when focused out from the textarea
     * @type {?}
     */
    NgxEditorComponent.prototype.blur;
    /**
     * emits `focus` event when focused in to the textarea
     * @type {?}
     */
    NgxEditorComponent.prototype.focus;
    /** @type {?} */
    NgxEditorComponent.prototype.textArea;
    /** @type {?} */
    NgxEditorComponent.prototype.ngxWrapper;
    /** @type {?} */
    NgxEditorComponent.prototype.Utils;
    /** @type {?} */
    NgxEditorComponent.prototype.onChange;
    /** @type {?} */
    NgxEditorComponent.prototype.onTouched;
    /** @type {?} */
    NgxEditorComponent.prototype._messageService;
    /** @type {?} */
    NgxEditorComponent.prototype._commandExecutor;
    /** @type {?} */
    NgxEditorComponent.prototype._renderer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZWRpdG9yLyIsInNvdXJjZXMiOlsiYXBwL25neC1lZGl0b3Ivbmd4LWVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQzNDLFlBQVksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUNwQyxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFFekUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDcEYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRW5FLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRCxPQUFPLEtBQUssS0FBSyxNQUFNLGlDQUFpQyxDQUFDOztJQWdGdkQ7Ozs7T0FJRztJQUNILDRCQUNVLGlCQUNBLGtCQUNBO1FBRkEsb0JBQWUsR0FBZixlQUFlO1FBQ2YscUJBQWdCLEdBQWhCLGdCQUFnQjtRQUNoQixjQUFTLEdBQVQsU0FBUzs7Ozs7Ozs7dUJBcENBLE9BQU87Ozs7Ozs7c0JBT1IsZUFBZTs7OztvQkFTTSxJQUFJLFlBQVksRUFBVTs7OztxQkFFekIsSUFBSSxZQUFZLEVBQVU7cUJBS3JELEtBQUs7S0FhaUI7SUFFbkM7O09BRUc7Ozs7O0lBQ0gsNENBQWU7Ozs7SUFBZjtRQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pCLE9BQU87S0FDUjtJQUVELHNEQUFzRDs7Ozs7SUFDdEQsMENBQWE7Ozs7SUFBYjtRQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3JDO0lBRUQ7OztPQUdHOzs7Ozs7SUFDSCw0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UyxFQUFFO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxpQkFBaUI7NEJBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLGtCQUFrQixFQUFsQixDQUFrQixDQUFDOzRCQUNqRCxLQUFLLEVBQUUsSUFBSTt5QkFDWjtxQkFDRjs7aUJBQ0Y7Ozs7Z0JBaEJRLGNBQWM7Z0JBRGQsc0JBQXNCO2dCQUpmLFNBQVM7OzsyQkEwQnRCLEtBQUs7NkJBRUwsS0FBSzs4QkFFTCxLQUFLOzRCQU1MLEtBQUs7eUJBRUwsS0FBSzs0QkFFTCxLQUFLO3dCQUVMLEtBQUs7MkJBRUwsS0FBSzswQkFRTCxLQUFLOzBCQVFMLEtBQUs7eUJBT0wsS0FBSzs4QkFFTCxLQUFLO2dDQUVMLEtBQUs7Z0NBRUwsS0FBSzt1QkFHTCxNQUFNO3dCQUVOLE1BQU07MkJBRU4sU0FBUyxTQUFDLGFBQWE7NkJBQ3ZCLFNBQVMsU0FBQyxZQUFZOzs2QkFuRnpCOztTQXlCYSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBWaWV3Q2hpbGQsXHJcbiAgRXZlbnRFbWl0dGVyLCBSZW5kZXJlcjIsIGZvcndhcmRSZWZcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5cclxuaW1wb3J0IHsgQ29tbWFuZEV4ZWN1dG9yU2VydmljZSB9IGZyb20gJy4vY29tbW9uL3NlcnZpY2VzL2NvbW1hbmQtZXhlY3V0b3Iuc2VydmljZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcclxuXHJcbmltcG9ydCB7IG5neEVkaXRvckNvbmZpZyB9IGZyb20gJy4vY29tbW9uL25neC1lZGl0b3IuZGVmYXVsdHMnO1xyXG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL2NvbW1vbi91dGlscy9uZ3gtZWRpdG9yLnV0aWxzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5neC1lZGl0b3InLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZWRpdG9yLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZWRpdG9yLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ3hFZGl0b3JDb21wb25lbnQpLFxyXG4gICAgICBtdWx0aTogdHJ1ZVxyXG4gICAgfVxyXG4gIF1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBOZ3hFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcclxuXHJcbiAgLyoqIFNwZWNpZmllcyB3ZWF0aGVyIHRoZSB0ZXh0YXJlYSB0byBiZSBlZGl0YWJsZSBvciBub3QgKi9cclxuICBASW5wdXQoKSBlZGl0YWJsZTogYm9vbGVhbjtcclxuICAvKiogVGhlIHNwZWxsY2hlY2sgcHJvcGVydHkgc3BlY2lmaWVzIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgdG8gaGF2ZSBpdHMgc3BlbGxpbmcgYW5kIGdyYW1tYXIgY2hlY2tlZCBvciBub3QuICovXHJcbiAgQElucHV0KCkgc3BlbGxjaGVjazogYm9vbGVhbjtcclxuICAvKiogUGxhY2Vob2xkZXIgZm9yIHRoZSB0ZXh0QXJlYSAqL1xyXG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogVGhlIHRyYW5zbGF0ZSBwcm9wZXJ0eSBzcGVjaWZpZXMgd2hldGhlciB0aGUgY29udGVudCBvZiBhbiBlbGVtZW50IHNob3VsZCBiZSB0cmFuc2xhdGVkIG9yIG5vdC5cclxuICAgKlxyXG4gICAqIENoZWNrIGh0dHBzOi8vd3d3Lnczc2Nob29scy5jb20vdGFncy9hdHRfZ2xvYmFsX3RyYW5zbGF0ZS5hc3AgZm9yIG1vcmUgaW5mb3JtYXRpb24gYW5kIGJyb3dzZXIgc3VwcG9ydFxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIHRyYW5zbGF0ZTogc3RyaW5nO1xyXG4gIC8qKiBTZXRzIGhlaWdodCBvZiB0aGUgZWRpdG9yICovXHJcbiAgQElucHV0KCkgaGVpZ2h0OiBzdHJpbmc7XHJcbiAgLyoqIFNldHMgbWluaW11bSBoZWlnaHQgZm9yIHRoZSBlZGl0b3IgKi9cclxuICBASW5wdXQoKSBtaW5IZWlnaHQ6IHN0cmluZztcclxuICAvKiogU2V0cyBXaWR0aCBvZiB0aGUgZWRpdG9yICovXHJcbiAgQElucHV0KCkgd2lkdGg6IHN0cmluZztcclxuICAvKiogU2V0cyBtaW5pbXVtIHdpZHRoIG9mIHRoZSBlZGl0b3IgKi9cclxuICBASW5wdXQoKSBtaW5XaWR0aDogc3RyaW5nO1xyXG4gIC8qKlxyXG4gICAqIFRvb2xiYXIgYWNjZXB0cyBhbiBhcnJheSB3aGljaCBzcGVjaWZpZXMgdGhlIG9wdGlvbnMgdG8gYmUgZW5hYmxlZCBmb3IgdGhlIHRvb2xiYXJcclxuICAgKlxyXG4gICAqIENoZWNrIG5neEVkaXRvckNvbmZpZyBmb3IgdG9vbGJhciBjb25maWd1cmF0aW9uXHJcbiAgICpcclxuICAgKiBQYXNzaW5nIGFuIGVtcHR5IGFycmF5IHdpbGwgZW5hYmxlIGFsbCB0b29sYmFyXHJcbiAgICovXHJcbiAgQElucHV0KCkgdG9vbGJhcjogT2JqZWN0O1xyXG4gIC8qKlxyXG4gICAqIFRoZSBlZGl0b3IgY2FuIGJlIHJlc2l6ZWQgdmVydGljYWxseS5cclxuICAgKlxyXG4gICAqIGBiYXNpY2AgcmVzaXplciBlbmFibGVzIHRoZSBodG1sNSByZXN6aWVyLiBDaGVjayBoZXJlIGh0dHBzOi8vd3d3Lnczc2Nob29scy5jb20vY3NzcmVmL2NzczNfcHJfcmVzaXplLmFzcFxyXG4gICAqXHJcbiAgICogYHN0YWNrYCByZXNpemVyIGVuYWJsZSBhIHJlc2l6ZXIgdGhhdCBsb29rcyBsaWtlIGFzIGlmIGluIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb21cclxuICAgKi9cclxuICBASW5wdXQoKSByZXNpemVyID0gJ3N0YWNrJztcclxuICAvKipcclxuICAgKiBUaGUgY29uZmlnIHByb3BlcnR5IGlzIGEgSlNPTiBvYmplY3RcclxuICAgKlxyXG4gICAqIEFsbCBhdmFpYmFsZSBpbnB1dHMgaW5wdXRzIGNhbiBiZSBwcm92aWRlZCBpbiB0aGUgY29uZmlndXJhdGlvbiBhcyBKU09OXHJcbiAgICogaW5wdXRzIHByb3ZpZGVkIGRpcmVjdGx5IGFyZSBjb25zaWRlcmVkIGFzIHRvcCBwcmlvcml0eVxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIGNvbmZpZyA9IG5neEVkaXRvckNvbmZpZztcclxuICAvKiogV2VhdGhlciB0byBzaG93IG9yIGhpZGUgdG9vbGJhciAqL1xyXG4gIEBJbnB1dCgpIHNob3dUb29sYmFyOiBib29sZWFuO1xyXG4gIC8qKiBXZWF0aGVyIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSB0b29sYmFyICovXHJcbiAgQElucHV0KCkgZW5hYmxlVG9vbGJhcjogYm9vbGVhbjtcclxuICAvKiogRW5kcG9pbnQgZm9yIHdoaWNoIHRoZSBpbWFnZSB0byBiZSB1cGxvYWRlZCAqL1xyXG4gIEBJbnB1dCgpIGltYWdlRW5kUG9pbnQ6IHN0cmluZztcclxuXHJcbiAgLyoqIGVtaXRzIGBibHVyYCBldmVudCB3aGVuIGZvY3VzZWQgb3V0IGZyb20gdGhlIHRleHRhcmVhICovXHJcbiAgQE91dHB1dCgpIGJsdXI6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcbiAgLyoqIGVtaXRzIGBmb2N1c2AgZXZlbnQgd2hlbiBmb2N1c2VkIGluIHRvIHRoZSB0ZXh0YXJlYSAqL1xyXG4gIEBPdXRwdXQoKSBmb2N1czogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcclxuXHJcbiAgQFZpZXdDaGlsZCgnbmd4VGV4dEFyZWEnKSB0ZXh0QXJlYTogYW55O1xyXG4gIEBWaWV3Q2hpbGQoJ25neFdyYXBwZXInKSBuZ3hXcmFwcGVyOiBhbnk7XHJcblxyXG4gIFV0aWxzOiBhbnkgPSBVdGlscztcclxuXHJcbiAgcHJpdmF0ZSBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ7XHJcbiAgcHJpdmF0ZSBvblRvdWNoZWQ6ICgpID0+IHZvaWQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSBfbWVzc2FnZVNlcnZpY2Ugc2VydmljZSB0byBzZW5kIG1lc3NhZ2UgdG8gdGhlIGVkaXRvciBtZXNzYWdlIGNvbXBvbmVudFxyXG4gICAqIEBwYXJhbSBfY29tbWFuZEV4ZWN1dG9yIGV4ZWN1dGVzIGNvbW1hbmQgZnJvbSB0aGUgdG9vbGJhclxyXG4gICAqIEBwYXJhbSBfcmVuZGVyZXIgYWNjZXNzIGFuZCBtYW5pcHVsYXRlIHRoZSBkb20gZWxlbWVudFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBfbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBfY29tbWFuZEV4ZWN1dG9yOiBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMikgeyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGV2ZW50c1xyXG4gICAqL1xyXG4gIG9uVGV4dEFyZWFGb2N1cygpOiB2b2lkIHtcclxuICAgIHRoaXMuZm9jdXMuZW1pdCgnZm9jdXMnKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qKiBmb2N1cyB0aGUgdGV4dCBhcmVhIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCAqL1xyXG4gIG9uRWRpdG9yRm9jdXMoKSB7XHJcbiAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4ZWN1dGVkIGZyb20gdGhlIGNvbnRlbnRlZGl0YWJsZSBzZWN0aW9uIHdoaWxlIHRoZSBpbnB1dCBwcm9wZXJ0eSBjaGFuZ2VzXHJcbiAgICogQHBhcmFtIGh0bWwgaHRtbCBzdHJpbmcgZnJvbSBjb250ZW50ZWRpdGFibGVcclxuICAgKi9cclxuICBvbkNvbnRlbnRDaGFuZ2UoaHRtbDogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHRoaXMub25DaGFuZ2UoaHRtbCk7XHJcbiAgICAgIHRoaXMudG9nZ2xlUGxhY2Vob2xkZXIoaHRtbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgb25UZXh0QXJlYUJsdXIoKTogdm9pZCB7XHJcblxyXG4gICAgLyoqIHNhdmUgc2VsZWN0aW9uIGlmIGZvY3Vzc2VkIG91dCAqL1xyXG4gICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yLnNhdmVkU2VsZWN0aW9uID0gVXRpbHMuc2F2ZVNlbGVjdGlvbigpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdGhpcy5vblRvdWNoZWQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcclxuICAgIH1cclxuICAgIHRoaXMuYmx1ci5lbWl0KCdibHVyJyk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZXNpemluZyB0ZXh0IGFyZWFcclxuICAgKlxyXG4gICAqIEBwYXJhbSBvZmZzZXRZIHZlcnRpY2FsIGhlaWdodCBvZiB0aGUgZWlkdGFibGUgcG9ydGlvbiBvZiB0aGUgZWRpdG9yXHJcbiAgICovXHJcbiAgcmVzaXplVGV4dEFyZWEob2Zmc2V0WTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBsZXQgbmV3SGVpZ2h0ID0gcGFyc2VJbnQodGhpcy5oZWlnaHQsIDEwKTtcclxuICAgIG5ld0hlaWdodCArPSBvZmZzZXRZO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBuZXdIZWlnaHQgKyAncHgnO1xyXG4gICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZWRpdG9yIGFjdGlvbnMsIGkuZS4sIGV4ZWN1dGVzIGNvbW1hbmQgZnJvbSB0b29sYmFyXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29tbWFuZE5hbWUgbmFtZSBvZiB0aGUgY29tbWFuZCB0byBiZSBleGVjdXRlZFxyXG4gICAqL1xyXG4gIGV4ZWN1dGVDb21tYW5kKGNvbW1hbmROYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3IuZXhlY3V0ZShjb21tYW5kTmFtZSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBXcml0ZSBhIG5ldyB2YWx1ZSB0byB0aGUgZWxlbWVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB2YWx1ZSB2YWx1ZSB0byBiZSBleGVjdXRlZCB3aGVuIHRoZXJlIGlzIGEgY2hhbmdlIGluIGNvbnRlbnRlZGl0YWJsZVxyXG4gICAqL1xyXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xyXG5cclxuICAgIHRoaXMudG9nZ2xlUGxhY2Vob2xkZXIodmFsdWUpO1xyXG5cclxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJzxicj4nKSB7XHJcbiAgICAgIHZhbHVlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlZnJlc2hWaWV3KHZhbHVlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkXHJcbiAgICogd2hlbiB0aGUgY29udHJvbCByZWNlaXZlcyBhIGNoYW5nZSBldmVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmbiBhIGZ1bmN0aW9uXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZFxyXG4gICAqIHdoZW4gdGhlIGNvbnRyb2wgcmVjZWl2ZXMgYSB0b3VjaCBldmVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmbiBhIGZ1bmN0aW9uXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlZnJlc2ggdmlldy9IVE1MIG9mIHRoZSBlZGl0b3JcclxuICAgKlxyXG4gICAqIEBwYXJhbSB2YWx1ZSBodG1sIHN0cmluZyBmcm9tIHRoZSBlZGl0b3JcclxuICAgKi9cclxuICByZWZyZXNoVmlldyh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSB2YWx1ZSA9PT0gbnVsbCA/ICcnIDogdmFsdWU7XHJcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQsICdpbm5lckhUTUwnLCBub3JtYWxpemVkVmFsdWUpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdG9nZ2xlcyBwbGFjZWhvbGRlciBiYXNlZCBvbiBpbnB1dCBzdHJpbmdcclxuICAgKlxyXG4gICAqIEBwYXJhbSB2YWx1ZSBBIEhUTUwgc3RyaW5nIGZyb20gdGhlIGVkaXRvclxyXG4gICAqL1xyXG4gIHRvZ2dsZVBsYWNlaG9sZGVyKHZhbHVlOiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICghdmFsdWUgfHwgdmFsdWUgPT09ICc8YnI+JyB8fCB2YWx1ZSA9PT0gJycpIHtcclxuICAgICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5uZ3hXcmFwcGVyLm5hdGl2ZUVsZW1lbnQsICdzaG93LXBsYWNlaG9sZGVyJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLm5neFdyYXBwZXIubmF0aXZlRWxlbWVudCwgJ3Nob3ctcGxhY2Vob2xkZXInKTtcclxuICAgIH1cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgYSBqc29uIGNvbnRhaW5pbmcgaW5wdXQgcGFyYW1zXHJcbiAgICovXHJcbiAgZ2V0Q29sbGVjdGl2ZVBhcmFtcygpOiBhbnkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZWRpdGFibGU6IHRoaXMuZWRpdGFibGUsXHJcbiAgICAgIHNwZWxsY2hlY2s6IHRoaXMuc3BlbGxjaGVjayxcclxuICAgICAgcGxhY2Vob2xkZXI6IHRoaXMucGxhY2Vob2xkZXIsXHJcbiAgICAgIHRyYW5zbGF0ZTogdGhpcy50cmFuc2xhdGUsXHJcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgIG1pbkhlaWdodDogdGhpcy5taW5IZWlnaHQsXHJcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICBtaW5XaWR0aDogdGhpcy5taW5XaWR0aCxcclxuICAgICAgZW5hYmxlVG9vbGJhcjogdGhpcy5lbmFibGVUb29sYmFyLFxyXG4gICAgICBzaG93VG9vbGJhcjogdGhpcy5zaG93VG9vbGJhcixcclxuICAgICAgaW1hZ2VFbmRQb2ludDogdGhpcy5pbWFnZUVuZFBvaW50LFxyXG4gICAgICB0b29sYmFyOiB0aGlzLnRvb2xiYXJcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8qKlxyXG4gICAgICogc2V0IGNvbmZpZ3VhcnRpb25cclxuICAgICAqL1xyXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLlV0aWxzLmdldEVkaXRvckNvbmZpZ3VyYXRpb24odGhpcy5jb25maWcsIG5neEVkaXRvckNvbmZpZywgdGhpcy5nZXRDb2xsZWN0aXZlUGFyYW1zKCkpO1xyXG5cclxuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgfHwgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuXHJcbiAgICB0aGlzLmV4ZWN1dGVDb21tYW5kKCdlbmFibGVPYmplY3RSZXNpemluZycpO1xyXG5cclxuICB9XHJcblxyXG59XHJcbiJdfQ==