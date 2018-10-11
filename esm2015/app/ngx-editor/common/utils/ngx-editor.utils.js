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
export function canEnableToolbarOptions(value, toolbar) {
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
export function getEditorConfiguration(value, ngxEditorConfig, input) {
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
export function canResize(resizer) {
    if (resizer === 'basic') {
        return 'vertical';
    }
    return false;
}
/**
 * save selection when the editor is focussed out
 * @return {?}
 */
export function saveSelection() {
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
export function restoreSelection(range) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci51dGlscy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lZGl0b3IvIiwic291cmNlcyI6WyJhcHAvbmd4LWVkaXRvci9jb21tb24vdXRpbHMvbmd4LWVkaXRvci51dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU1BLE1BQU0sa0NBQWtDLEtBQWEsRUFBRSxPQUFZO0lBRWpFLElBQUksS0FBSyxFQUFFO1FBRVQsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzNCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7YUFBTTs7WUFFTCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNuQyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDcEMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUNwQztLQUNGO1NBQU07UUFDTCxPQUFPLEtBQUssQ0FBQztLQUNkO0NBQ0Y7Ozs7Ozs7OztBQVNELE1BQU0saUNBQWlDLEtBQVUsRUFBRSxlQUFvQixFQUFFLEtBQVU7SUFFakYsS0FBSyxNQUFNLENBQUMsSUFBSSxlQUFlLEVBQUU7UUFDL0IsSUFBSSxDQUFDLEVBQUU7WUFFTCxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQzFCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDckI7WUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDNUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMvQjtTQUNGO0tBQ0Y7SUFFRCxPQUFPLEtBQUssQ0FBQztDQUNkOzs7Ozs7O0FBT0QsTUFBTSxvQkFBb0IsT0FBZTtJQUN2QyxJQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUU7UUFDdkIsT0FBTyxVQUFVLENBQUM7S0FDbkI7SUFDRCxPQUFPLEtBQUssQ0FBQztDQUNkOzs7OztBQUtELE1BQU07SUFDSixJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUU7O1FBQ3ZCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNsQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLFVBQVUsRUFBRTtZQUNwQyxPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDMUI7S0FDRjtTQUFNLElBQUksUUFBUSxDQUFDLFlBQVksSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3hELE9BQU8sUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQy9CO0lBQ0QsT0FBTyxJQUFJLENBQUM7Q0FDYjs7Ozs7OztBQU9ELE1BQU0sMkJBQTJCLEtBQUs7SUFDcEMsSUFBSSxLQUFLLEVBQUU7UUFDVCxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUU7O1lBQ3ZCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNsQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixPQUFPLElBQUksQ0FBQztTQUNiO2FBQU0sSUFBSSxRQUFRLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDaEQsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2YsT0FBTyxJQUFJLENBQUM7U0FDYjtLQUNGO1NBQU07UUFDTCxPQUFPLEtBQUssQ0FBQztLQUNkO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogZW5hYmxlIG9yIGRpc2FibGUgdG9vbGJhciBiYXNlZCBvbiBjb25maWd1cmF0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSB0b29sYmFyIGl0ZW1cclxuICogQHBhcmFtIHRvb2xiYXIgdG9vbGJhciBjb25maWd1cmF0aW9uIG9iamVjdFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNhbkVuYWJsZVRvb2xiYXJPcHRpb25zKHZhbHVlOiBzdHJpbmcsIHRvb2xiYXI6IGFueSk6IGJvb2xlYW4ge1xyXG5cclxuICBpZiAodmFsdWUpIHtcclxuXHJcbiAgICBpZiAodG9vbGJhclsnbGVuZ3RoJ10gPT09IDApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgY29uc3QgZm91bmQgPSB0b29sYmFyLmZpbHRlcihhcnJheSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YodmFsdWUpICE9PSAtMTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gZm91bmQubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogc2V0IGVkaXRvciBjb25maWd1cmF0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBjb25maWd1cmF0aW9uIHZpYSBbY29uZmlnXSBwcm9wZXJ0eVxyXG4gKiBAcGFyYW0gbmd4RWRpdG9yQ29uZmlnIGRlZmF1bHQgZWRpdG9yIGNvbmZpZ3VyYXRpb25cclxuICogQHBhcmFtIGlucHV0IGRpcmVjdCBjb25maWd1cmF0aW9uIGlucHV0cyB2aWEgZGlyZWN0aXZlc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEVkaXRvckNvbmZpZ3VyYXRpb24odmFsdWU6IGFueSwgbmd4RWRpdG9yQ29uZmlnOiBhbnksIGlucHV0OiBhbnkpOiBhbnkge1xyXG5cclxuICBmb3IgKGNvbnN0IGkgaW4gbmd4RWRpdG9yQ29uZmlnKSB7XHJcbiAgICBpZiAoaSkge1xyXG5cclxuICAgICAgaWYgKGlucHV0W2ldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB2YWx1ZVtpXSA9IGlucHV0W2ldO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXZhbHVlLmhhc093blByb3BlcnR5KGkpKSB7XHJcbiAgICAgICAgdmFsdWVbaV0gPSBuZ3hFZGl0b3JDb25maWdbaV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIHJldHVybiB2ZXJ0aWNhbCBpZiB0aGUgZWxlbWVudCBpcyB0aGUgcmVzaXplciBwcm9wZXJ0eSBpcyBzZXQgdG8gYmFzaWNcclxuICpcclxuICogQHBhcmFtIHJlc2l6ZXIgdHlwZSBvZiByZXNpemVyLCBlaXRoZXIgYmFzaWMgb3Igc3RhY2tcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjYW5SZXNpemUocmVzaXplcjogc3RyaW5nKTogYW55IHtcclxuICBpZiAocmVzaXplciA9PT0gJ2Jhc2ljJykge1xyXG4gICAgcmV0dXJuICd2ZXJ0aWNhbCc7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIHNhdmUgc2VsZWN0aW9uIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCBvdXRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlU2VsZWN0aW9uKCk6IGFueSB7XHJcbiAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcclxuICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcclxuICAgIGlmIChzZWwuZ2V0UmFuZ2VBdCAmJiBzZWwucmFuZ2VDb3VudCkge1xyXG4gICAgICByZXR1cm4gc2VsLmdldFJhbmdlQXQoMCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmIChkb2N1bWVudC5nZXRTZWxlY3Rpb24gJiYgZG9jdW1lbnQuY3JlYXRlUmFuZ2UpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIHJlc3RvcmUgc2VsZWN0aW9uIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCBpblxyXG4gKlxyXG4gKiBAcGFyYW0gcmFuZ2Ugc2F2ZWQgc2VsZWN0aW9uIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCBvdXRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZXN0b3JlU2VsZWN0aW9uKHJhbmdlKTogYm9vbGVhbiB7XHJcbiAgaWYgKHJhbmdlKSB7XHJcbiAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xyXG4gICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcclxuICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmdldFNlbGVjdGlvbiAmJiByYW5nZS5zZWxlY3QpIHtcclxuICAgICAgcmFuZ2Uuc2VsZWN0KCk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcbiJdfQ==