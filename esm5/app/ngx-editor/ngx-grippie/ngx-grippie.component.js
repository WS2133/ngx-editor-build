/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, HostListener } from '@angular/core';
import { NgxEditorComponent } from '../ngx-editor.component';
var NgxGrippieComponent = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param _editorComponent Editor component
     */
    function NgxGrippieComponent(_editorComponent) {
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
     * @param event Mouseevent
     *
     * Update the height of the editor when the grabber is dragged
     */
    /**
     *
     * @param {?} event Mouseevent
     *
     * Update the height of the editor when the grabber is dragged
     * @return {?}
     */
    NgxGrippieComponent.prototype.onMouseMove = /**
     *
     * @param {?} event Mouseevent
     *
     * Update the height of the editor when the grabber is dragged
     * @return {?}
     */
    function (event) {
        if (!this.grabber) {
            return;
        }
        this._editorComponent.resizeTextArea(event.clientY - this.oldY);
        this.oldY = event.clientY;
    };
    /**
     *
     * @param event Mouseevent
     *
     * set the grabber to false on mouse up action
     */
    /**
     *
     * @param {?} event Mouseevent
     *
     * set the grabber to false on mouse up action
     * @return {?}
     */
    NgxGrippieComponent.prototype.onMouseUp = /**
     *
     * @param {?} event Mouseevent
     *
     * set the grabber to false on mouse up action
     * @return {?}
     */
    function (event) {
        this.grabber = false;
    };
    /**
     * @param {?} event
     * @param {?=} resizer
     * @return {?}
     */
    NgxGrippieComponent.prototype.onResize = /**
     * @param {?} event
     * @param {?=} resizer
     * @return {?}
     */
    function (event, resizer) {
        this.grabber = true;
        this.oldY = event.clientY;
        event.preventDefault();
    };
    NgxGrippieComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-ngx-grippie',
                    template: "<div class=\"ngx-editor-grippie\">\r\n  <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"isolation:isolate\" viewBox=\"651.6 235 26 5\"\r\n    width=\"26\" height=\"5\">\r\n    <g id=\"sprites\">\r\n      <path d=\" M 651.6 235 L 653.6 235 L 653.6 237 L 651.6 237 M 654.6 238 L 656.6 238 L 656.6 240 L 654.6 240 M 660.6 238 L 662.6 238 L 662.6 240 L 660.6 240 M 666.6 238 L 668.6 238 L 668.6 240 L 666.6 240 M 672.6 238 L 674.6 238 L 674.6 240 L 672.6 240 M 657.6 235 L 659.6 235 L 659.6 237 L 657.6 237 M 663.6 235 L 665.6 235 L 665.6 237 L 663.6 237 M 669.6 235 L 671.6 235 L 671.6 237 L 669.6 237 M 675.6 235 L 677.6 235 L 677.6 237 L 675.6 237\"\r\n        fill=\"rgb(147,153,159)\" />\r\n    </g>\r\n  </svg>\r\n</div>\r\n",
                    styles: [".ngx-editor-grippie{height:9px;background-color:#f1f1f1;position:relative;text-align:center;cursor:s-resize;border:1px solid #ddd;border-top:transparent}.ngx-editor-grippie svg{position:absolute;top:1.5px;width:50%;right:25%}"]
                }] }
    ];
    /** @nocollapse */
    NgxGrippieComponent.ctorParameters = function () { return [
        { type: NgxEditorComponent }
    ]; };
    NgxGrippieComponent.propDecorators = {
        onMouseMove: [{ type: HostListener, args: ['document:mousemove', ['$event'],] }],
        onMouseUp: [{ type: HostListener, args: ['document:mouseup', ['$event'],] }],
        onResize: [{ type: HostListener, args: ['mousedown', ['$event'],] }]
    };
    return NgxGrippieComponent;
}());
export { NgxGrippieComponent };
if (false) {
    /**
     * height of the editor
     * @type {?}
     */
    NgxGrippieComponent.prototype.height;
    /**
     * previous value befor resizing the editor
     * @type {?}
     */
    NgxGrippieComponent.prototype.oldY;
    /**
     * set to true on mousedown event
     * @type {?}
     */
    NgxGrippieComponent.prototype.grabber;
    /** @type {?} */
    NgxGrippieComponent.prototype._editorComponent;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdyaXBwaWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtZWRpdG9yL25neC1ncmlwcGllL25neC1ncmlwcGllLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seUJBQXlCLENBQUM7O0lBaUIzRDs7OztPQUlHO0lBQ0gsNkJBQW9CLGdCQUFvQztRQUFwQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW9COzs7O29CQVRqRCxDQUFDOzs7O3VCQUVFLEtBQUs7S0FPOEM7SUFFN0Q7Ozs7O09BS0c7Ozs7Ozs7O0lBQzZDLHlDQUFXOzs7Ozs7O0lBQTNELFVBQTRELEtBQWlCO1FBRTNFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO0tBQzNCO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7O0lBQzJDLHVDQUFTOzs7Ozs7O0lBQXZELFVBQXdELEtBQWlCO1FBQ3ZFLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0tBQ3RCOzs7Ozs7SUFFc0Msc0NBQVE7Ozs7O0lBQS9DLFVBQWdELEtBQWlCLEVBQUUsT0FBa0I7UUFDbkYsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzFCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUN4Qjs7Z0JBcERGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixpeEJBQTJDOztpQkFFNUM7Ozs7Z0JBTlEsa0JBQWtCOzs7OEJBOEJ4QixZQUFZLFNBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLENBQUM7NEJBZ0I3QyxZQUFZLFNBQUMsa0JBQWtCLEVBQUUsQ0FBQyxRQUFRLENBQUM7MkJBSTNDLFlBQVksU0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7OzhCQW5EdkM7O1NBU2EsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTmd4RWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi4vbmd4LWVkaXRvci5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbmd4LWdyaXBwaWUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ3JpcHBpZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdyaXBwaWUuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIE5neEdyaXBwaWVDb21wb25lbnQge1xyXG5cclxuICAvKiogaGVpZ2h0IG9mIHRoZSBlZGl0b3IgKi9cclxuICBoZWlnaHQ6IG51bWJlcjtcclxuICAvKiogcHJldmlvdXMgdmFsdWUgYmVmb3IgcmVzaXppbmcgdGhlIGVkaXRvciAqL1xyXG4gIG9sZFkgPSAwO1xyXG4gIC8qKiBzZXQgdG8gdHJ1ZSBvbiBtb3VzZWRvd24gZXZlbnQgKi9cclxuICBncmFiYmVyID0gZmFsc2U7XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbnN0cnVjdG9yXHJcbiAgICpcclxuICAgKiBAcGFyYW0gX2VkaXRvckNvbXBvbmVudCBFZGl0b3IgY29tcG9uZW50XHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWRpdG9yQ29tcG9uZW50OiBOZ3hFZGl0b3JDb21wb25lbnQpIHsgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSBldmVudCBNb3VzZWV2ZW50XHJcbiAgICpcclxuICAgKiBVcGRhdGUgdGhlIGhlaWdodCBvZiB0aGUgZWRpdG9yIHdoZW4gdGhlIGdyYWJiZXIgaXMgZHJhZ2dlZFxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNlbW92ZScsIFsnJGV2ZW50J10pIG9uTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcblxyXG4gICAgaWYgKCF0aGlzLmdyYWJiZXIpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2VkaXRvckNvbXBvbmVudC5yZXNpemVUZXh0QXJlYShldmVudC5jbGllbnRZIC0gdGhpcy5vbGRZKTtcclxuICAgIHRoaXMub2xkWSA9IGV2ZW50LmNsaWVudFk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSBldmVudCBNb3VzZWV2ZW50XHJcbiAgICpcclxuICAgKiBzZXQgdGhlIGdyYWJiZXIgdG8gZmFsc2Ugb24gbW91c2UgdXAgYWN0aW9uXHJcbiAgICovXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2V1cCcsIFsnJGV2ZW50J10pIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgdGhpcy5ncmFiYmVyID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nLCBbJyRldmVudCddKSBvblJlc2l6ZShldmVudDogTW91c2VFdmVudCwgcmVzaXplcj86IEZ1bmN0aW9uKSB7XHJcbiAgICB0aGlzLmdyYWJiZXIgPSB0cnVlO1xyXG4gICAgdGhpcy5vbGRZID0gZXZlbnQuY2xpZW50WTtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=