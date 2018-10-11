/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, HostListener } from '@angular/core';
import { NgxEditorComponent } from '../ngx-editor.component';
export class NgxGrippieComponent {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdyaXBwaWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtZWRpdG9yL25neC1ncmlwcGllL25neC1ncmlwcGllLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFRN0QsTUFBTTs7Ozs7O0lBY0osWUFBb0IsZ0JBQW9DO1FBQXBDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBb0I7Ozs7b0JBVGpELENBQUM7Ozs7dUJBRUUsS0FBSztLQU84Qzs7Ozs7Ozs7SUFRYixXQUFXLENBQUMsS0FBaUI7UUFFM0UsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7S0FDM0I7Ozs7Ozs7O0lBUTZDLFNBQVMsQ0FBQyxLQUFpQjtRQUN2RSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztLQUN0Qjs7Ozs7O0lBRXNDLFFBQVEsQ0FBQyxLQUFpQixFQUFFLE9BQWtCO1FBQ25GLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUMxQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDeEI7OztZQXBERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsaXhCQUEyQzs7YUFFNUM7Ozs7WUFOUSxrQkFBa0I7OzswQkE4QnhCLFlBQVksU0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzt3QkFnQjdDLFlBQVksU0FBQyxrQkFBa0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzt1QkFJM0MsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5neEVkaXRvckNvbXBvbmVudCB9IGZyb20gJy4uL25neC1lZGl0b3IuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5neC1ncmlwcGllJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWdyaXBwaWUuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL25neC1ncmlwcGllLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBOZ3hHcmlwcGllQ29tcG9uZW50IHtcclxuXHJcbiAgLyoqIGhlaWdodCBvZiB0aGUgZWRpdG9yICovXHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgLyoqIHByZXZpb3VzIHZhbHVlIGJlZm9yIHJlc2l6aW5nIHRoZSBlZGl0b3IgKi9cclxuICBvbGRZID0gMDtcclxuICAvKiogc2V0IHRvIHRydWUgb24gbW91c2Vkb3duIGV2ZW50ICovXHJcbiAgZ3JhYmJlciA9IGZhbHNlO1xyXG5cclxuICAvKipcclxuICAgKiBDb25zdHJ1Y3RvclxyXG4gICAqXHJcbiAgICogQHBhcmFtIF9lZGl0b3JDb21wb25lbnQgRWRpdG9yIGNvbXBvbmVudFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VkaXRvckNvbXBvbmVudDogTmd4RWRpdG9yQ29tcG9uZW50KSB7IH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZXZlbnQgTW91c2VldmVudFxyXG4gICAqXHJcbiAgICogVXBkYXRlIHRoZSBoZWlnaHQgb2YgdGhlIGVkaXRvciB3aGVuIHRoZSBncmFiYmVyIGlzIGRyYWdnZWRcclxuICAgKi9cclxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZW1vdmUnLCBbJyRldmVudCddKSBvbk1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCkge1xyXG5cclxuICAgIGlmICghdGhpcy5ncmFiYmVyKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9lZGl0b3JDb21wb25lbnQucmVzaXplVGV4dEFyZWEoZXZlbnQuY2xpZW50WSAtIHRoaXMub2xkWSk7XHJcbiAgICB0aGlzLm9sZFkgPSBldmVudC5jbGllbnRZO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZXZlbnQgTW91c2VldmVudFxyXG4gICAqXHJcbiAgICogc2V0IHRoZSBncmFiYmVyIHRvIGZhbHNlIG9uIG1vdXNlIHVwIGFjdGlvblxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNldXAnLCBbJyRldmVudCddKSBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgIHRoaXMuZ3JhYmJlciA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnXSkgb25SZXNpemUoZXZlbnQ6IE1vdXNlRXZlbnQsIHJlc2l6ZXI/OiBGdW5jdGlvbikge1xyXG4gICAgdGhpcy5ncmFiYmVyID0gdHJ1ZTtcclxuICAgIHRoaXMub2xkWSA9IGV2ZW50LmNsaWVudFk7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19