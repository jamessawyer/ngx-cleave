// tslint:disable:no-inferrable-types max-line-length
import { Directive, ElementRef, Input, OnInit, OnDestroy, Output, EventEmitter, HostListener } from '@angular/core';
import { CleaveOptions } from './cleave-options.interface';
import { Cleave } from './cleave';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[cleave]'
})
export class CleaveDirective implements OnInit, OnDestroy {
    cleaveInstance: any;

    @Input() options: CleaveOptions = {};

    @Input() creditCard: boolean = false;
    @Input() creditCardStrictMode = false;
    @Input() creditCardType = '';
    @Output() onCreditCardTypeChanged: EventEmitter<any> = new EventEmitter<any>();
    @Output() onInput: EventEmitter<any> = new EventEmitter<any>();

    // 暂时不支持phone 因为依赖google的库
   /*  @Input() phone = false;
    @Input() phoneRegionCode = '';
    @Input() phoneFormatter: any = {}; */

    @Input() date = false;
    @Input() datePattern = ['Y', 'm', 'd'];
    @Input() dateFormatter: any = {};

    @Input() numeral = false;
    @Input() numeralDecimalScale = 2;
    @Input() numeralDecimalMark = '.';
    @Input() numeralThousandsGroupStyle = 'thousand';
    @Input() numeralPositiveOnly = false;

    @Input() numericOnly = false;

    @Input() uppercase = false;
    @Input() lowercase = false;

    @Input() prefix = '';
    @Input() prefixLength = this.prefix.length;

    @Input() rawValueTrimPrefix = false;
    @Input() copyDelimiter = false;

    @Input() initValue = '';

    @Input() delimiter = ',';
    @Input() delimiters = [];

    @Input() blocks = [];
    @Input() blocksLength = this.blocks.length;

    @Input() maxLength = 0;

    @Input() backspace = false;

    @Input() result = '';

    /**
     * 将delimiter去掉之后的值
     * @param event
     */
    @HostListener('keyup', ['$event'])
    onInputText() {
        if (this.elem.nativeElement !== document.activeElement) { // 如果不是输入框则忽略
            return;
        }
        const value = this.cleaveInstance.getRawValue();
        this.onInput.emit(value);
        console.log('获取原来的值...', value);
    }

    constructor(private elem: ElementRef) {}

    ngOnInit(): void {
        this.init();
    }

    init() {
        console.log('初始化。。。。');

        console.log('options。。。', this.getOptions());

        this.cleaveInstance = new Cleave(this.elem.nativeElement, this.getOptions());
    }

    getOptions(): CleaveOptions {
        return {
            creditCard: this.options.creditCard || this.creditCard,
            creditCardStrictMode: this.options.creditCardStrictMode || this.creditCardStrictMode,
            creditCardType: this.options.creditCardType ? this.options.creditCardType : this.creditCardType,

            // phone: this.options.phone || this.phone,
            // phoneRegionCode: this.options.phoneRegionCode ? this.options.phoneRegionCode : this.phoneRegionCode,
            // phoneFormatter: this.options.phoneFormatter ? this.options.phoneFormatter : this.phoneFormatter,

            date: this.options.date || this.date,
            datePattern: this.options.datePattern ? this.options.datePattern : this.datePattern,
            dateFormatter: this.options.dateFormatter ? this.options.dateFormatter : this.dateFormatter,

            numeral: this.options.numeral || this.numeral,
            numeralDecimalScale: this.options.numeralDecimalScale >= 0 ? this.options.numeralDecimalScale : this.numeralDecimalScale,
            numeralDecimalMark: this.options.numeralDecimalMark ? this.options.numeralDecimalMark : this.numeralDecimalMark,
            numeralThousandsGroupStyle: this.options.numeralThousandsGroupStyle ? this.options.numeralThousandsGroupStyle : this.numeralThousandsGroupStyle,
            numeralPositiveOnly: this.options.numeralPositiveOnly || this.numeralPositiveOnly,
            numericOnly: this.options.numericOnly || this.numericOnly,

            uppercase: this.options.uppercase || this.uppercase,
            lowercase: this.options.lowercase || this.lowercase,

            prefix: this.options.prefix ? this.options.prefix : this.prefix,
            prefixLength: this.options.prefix ? this.options.prefix.length : this.prefixLength,

            rawValueTrimPrefix: this.options.rawValueTrimPrefix || this.rawValueTrimPrefix,
            copyDelimiter: this.options.copyDelimiter || this.copyDelimiter,

            initValue: this.options.initValue ? this.options.initValue : this.initValue,

            delimiter: this.options.delimiter ? this.options.delimiter : this.delimiter,
            delimiters: this.options.delimiters && this.options.delimiters.length ? this.options.delimiters : this.delimiters,

            blocks: this.options.blocks && this.options.blocks.length ? this.options.blocks : this.blocks,
            blocksLength: this.options.blocks && this.options.blocks.length ? this.options.blocks.length : this.blocksLength,

            maxLength: this.options.maxLength ? this.options.maxLength : this.maxLength,

            backspace: this.options.backspace || this.backspace,

            result: this.options.result ? this.options.result : this.result
        };
    }

    ngOnDestroy(): void {
        if (this.cleaveInstance) {
            this.cleaveInstance.destroy();
        }
    }
}



/* const availableTypes = [
    'creditCard',
    // 'phone',
    'date',
    'numeral'
];

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[cleave]',
})
export class CleaveDirective {
    cleaveInstance = null;

    @Input('cleave')
    set cleave(options: any) {
        console.log('我的选项。。。', options);
        let cleaveOpts = null;

        // simple type (see availableTypes)
        if (typeof options === 'string' && availableTypes.indexOf(options) !== -1) {
            cleaveOpts = {};
            cleaveOpts[options] = true;
        }

        // literal options object
        if (typeof options === 'string' && options.match(/^\{/)) {
            try {
                cleaveOpts = JSON.parse(options);
                console.log('xuan想hdhdhd', cleaveOpts, options);
            } catch (e) {
                console.error('Angular4 Cleave : options object could not be parsed. Check that JSON syntax is correct.');
            }
        }

        // handle error if option is not available
        if (typeof options === 'string' && cleaveOpts === null) {
            console.log('xuan想', cleaveOpts);
            console.error('Angular4 Cleave : option is not valid (%s).\n Available options : %s', options, availableTypes.join(', '));
        }

        // Cleave.js options object
        if (typeof options === 'object') {
            console.log('dkdkldklk...', options);
            cleaveOpts = options;
        }

        // 实例化
        if (cleaveOpts !== null) {
            this.initCleave(cleaveOpts);
        }
    }

    // get cleave() {
    //     console.log('haha', this.options);
    //     return this.options;
    // }

    constructor(private elm: ElementRef) {
        this.elm = elm;
    }

    // instanciate Cleave.js
    private initCleave(opts) {
        this.cleaveInstance = new Cleave(this.elm.nativeElement, opts);
        console.log('元素', this.elm.nativeElement, opts);
    }

}
 */
