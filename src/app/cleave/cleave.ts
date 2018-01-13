// tslint:disable:prefer-const
import CleaveUtil from './cleave.util';
import * as SHORTCUTS from './shortcuts';
import CleaveDefaultProps from './cleave.default';
import { CleaveOptions } from './cleave-options.interface';


export class Cleave {
    static NumeralFormatter = SHORTCUTS.NumeralFormatter;
    static DateFormatter = SHORTCUTS.DateFormatter;
    static CreditCardDetector = SHORTCUTS.CreditCardDetector;
    // static PhonefORMATTER = SHORTCUTS.PhoneFormatter;   // 电话格式暂时有问题 需要谷歌的库支持
    static Util = CleaveUtil;
    static DefaultProperties = CleaveDefaultProps;

    properties: any;
    isAndroid: boolean;
    lastInputValue: string;
    // element: HTMLElement;
    element: any;

    onChangeListener: Function;
    onKeyDownListener: Function;
    onCutListener: Function;
    onCopyListener: Function;
    onBlurListener: Function;                             // 主要用于带小数点的更新

    constructor(
        elm: any,
        opts: CleaveOptions
    ) {
        opts.initValue = elm.value;

        this.element = elm;

        this.properties = Cleave.DefaultProperties.assign({}, opts);
        console.log('属性。。。', this.properties);

        this.init();
    }

    init() {
        const pps = this.properties;

        if (!pps.numeral && !pps.date && (pps.blocksLength === 0 && !pps.prefix)) {
            this.onInput(pps.initValue);
            return;
        }
       /*  if (!pps.numeral && !pps.phone && !pps.date && (pps.blocksLength === 0 && !pps.prefix)) {
            this.onInput(pps.initValue);
            return;
        } */

        pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
        console.log('最大长度', pps.maxLength);
        this.isAndroid = Cleave.Util.isAndroid();
        this.lastInputValue = '';

        this.onChangeListener = this.onChange.bind(this);
        this.onKeyDownListener = this.onKeyDown.bind(this);
        this.onCutListener = this.onCut.bind(this);
        this.onCopyListener = this.onCopy.bind(this);
        this.onBlurListener = this.onBlur.bind(this);

        this.element.addEventListener('input', this.onChangeListener);
        this.element.addEventListener('keydown', this.onKeyDownListener);
        this.element.addEventListener('cut', this.onCutListener);
        this.element.addEventListener('copy', this.onCopyListener);
        this.element.addEventListener('blur', this.onBlurListener);


        // this.initPhoneFormatter();
        this.initDateFormatter();
        this.initNumeralFormatter();

        console.log('初始值。。。', pps.initValue);
        this.onInput(pps.initValue);
    }

    initNumeralFormatter() {
        let pps = this.properties;

        if (!pps.numeral) {
            return;
        }

        pps.numeralFormatter = new Cleave.NumeralFormatter(
            pps.numeralIntegerScale,
            pps.numeralDecimalScale,
            pps.numeralThousandsGroupStyle,
            pps.numeralPositiveOnly,
            pps.delimiter,
            pps.numeralDecimalMask,
            pps.stripLeadingZeros
        );
    }

    initDateFormatter() {
         let pps = this.properties;

         if (!pps.date) {
             return;
         }

         pps.dateFormatter = new Cleave.DateFormatter(pps.datePattern);
         pps.blocks = pps.dateFormatter.getBlocks();
         pps.blockLength = pps.blocks.length;
         pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
         console.log('格式。。。', pps.dateFormatter);
    }

    /* initPhoneFormatter() {
        // tslint:disable-next-line:prefer-const
        let pps = this.properties;

        if (!pps.phone) {
            return;
        }

        // Cleave.AsYouTypeFormatter should be provided by
        // external google closure lib
        try {
            pps.phoneFormatter = new Cleave.PhoneFormatter(
                new pps.root.Cleave.AsYouTypeFormatter(pps.phoneRegionCode),
                pps.delimiter
            );
        } catch (ex) {
            throw new Error('[cleave.js] Please include phone-type-formatter.{country}.js lib');
        }
    } */

    onKeyDown(event) {
        let pps = this.properties;
        let charCode = event.which || event.keyCode;
        const Util = Cleave.Util;
        let currentValue = this.element.value;

        if (Util.isAndroidBackspaceKeydown(this.lastInputValue, currentValue)) {
            charCode = 8;
        }

        this.lastInputValue = currentValue;

        if (charCode === 8 && Util.isDelimiter(currentValue.slice(-pps.delimiterLength), pps.delimiter, pps.delimiters)) {
            pps.backspace = true;

            return;
        }

        pps.backspace = false;
    }

    onChange() {
        this.onInput(this.element.value);
    }

    onCut(event) {
        this.copyClipboardData(event);
        this.onInput('');
    }

    onCopy(event) {
        this.copyClipboardData(event);
    }

    onBlur(event) {
        let pps = this.properties;

        // 如果是只有数字或者保留的小数点不大于0
        if (pps.numericOnly || pps.numeralDecimalScale <= 0 || !this.element.value) {
            return;
        }
        let currentValue = this.getRawValue();
        const index = currentValue.indexOf('.');

        // 不存在小数点, 则补充'0', 根据pps.numeralDecimalScale的值补充0的位数
        if (index < 0) {
            this.element.value += '.'.padEnd(pps.numeralDecimalScale + 1, '0');
            // this.element.value = currentValue;
        } else {
            let integerPart = this.element.value.split('.')[0];  // 前面整数部分 使用this.element.value为了保留分隔符
            let decimalPart = currentValue.split('.')[1];  // 小数点后面的部分
            let decimalLength = decimalPart.length;        // 长度，一定不大于numeralDecimalScale
            this.element.value = integerPart + '.' + decimalPart.padEnd(pps.numeralDecimalScale, '0');
        }
    }

    copyClipboardData(event) {
        const Util = Cleave.Util;
        let pps = this.properties;
        let inputValue = this.element.value;
        let textToCopy = '';

        if (!pps.copyDelimiter) {
            textToCopy = Util.stripDelimiters(inputValue, pps.delimiter, pps.delimiters);
        } else {
            textToCopy = inputValue;
        }

        try {
            if (event.clipboardData) {
                event.clipboardData.setData('Text', textToCopy);
            } else {
                event.clipboardData.setData('Text', textToCopy);
            }

            event.preventDefault();
        } catch (ex) {
            //  empty
        }
    }

    onInput(value) {
        const Util = Cleave.Util;
        let pps = this.properties;

        // case 1: delete one more character "4"
        // 1234*| -> hit backspace -> 123|
        // case 2: last character is not delimiter which is:
        // 12|34* -> hit backspace -> 1|34*
        // note: no need to apply this for numeral mode
        if (!pps.numeral && pps.backspace && !Util.isDelimiter(value.slice(-pps.delimiterLength), pps.delimiter, pps.delimiters)) {
            value = Util.headStr(value, value.length - pps.delimiterLength);
        }

        // phone formatter 暂时不适用电话
       /*  if (pps.phone) {
            if (pps.prefix && (!pps.noImmediatePrefix || value.length)) {
                pps.result = pps.prefix + pps.phoneFormatter.format(value).slice(pps.prefix.length);
            } else {
                pps.result = pps.phoneFormatter.format(value);
            }
            this.updateValueState();

            return;
        } */

        // numeral formatter
        if (pps.numeral) {
            if (pps.prefix && (!pps.noImmediatePrefix || value.length)) {
                pps.result = pps.prefix + pps.numeralFormatter.format(value);
                console.log('格式化之后',  pps.result);
            } else {
                pps.result = pps.numeralFormatter.format(value);
                console.log('格式化之后444。。。',  pps.result);
            }
            this.updateValueState();

            return;
        }

        // date
        if (pps.date) {
            console.log('日期哈哈哈。。。', pps.date, pps.dateFormatter.getValidatedDate(value));
            value = pps.dateFormatter.getValidatedDate(value);
        }

        // 去掉分隔符
        value = Util.stripDelimiters(value, pps.delimiter, pps.delimiters);

        // 去掉前缀
        value = Util.getPrefixStrippedValue(value, pps.prefix, pps.prefixLength);

        // 是否是纯数字，不包含小数
        value = pps.numericOnly ? Util.strip(value, /[^\d]/g) : value;

        // convert case
        value = pps.uppercase ? value.toUpperCase() : value;
        value = pps.lowercase ? value.toLowerCase() : value;


        // prefix
        if (pps.prefix && (!pps.noImmediatePrefix || value.length)) {
            value = pps.prefix + value;

            // no blocks specified, no need to do formatting
            if (pps.blocksLength === 0) {
                pps.result = value;
                this.updateValueState();

                return;
            }
        }

        // update credit card props
        if (pps.creditCard) {
            this.updateCreditCardPropsByValue(value);
        }

        // strip over length characters
        value = Util.headStr(value, pps.maxLength);

        // 使用blocks对字符进行处理 getFormattedValue('abcdefghijkl', [3, 4, 5], 3, '/', ['-', '@']) => abc-defg@hijkl
        pps.result = Util.getFormattedValue(value, pps.blocks, pps.blocksLength, pps.delimiter, pps.delimiters);

        this.updateValueState();
    }

    updateCreditCardPropsByValue(value) {
        const Util = Cleave.Util;
        let pps = this.properties;
        let creditCardInfo;

        // At least one of the first 4 characters has changed
        if (Util.headStr(pps.result, 4) === Util.headStr(value, 4)) {
            return;
        }

        creditCardInfo = Cleave.CreditCardDetector.getInfo(value, pps.creditCardStrictMode);

        pps.blocks = creditCardInfo.blocks;
        pps.blockLength = pps.blocks.length;
        pps.maxLength = Util.getMaxLength(pps.blocks);

        // 信用卡类型发生变化
        if (pps.creditCardType !== creditCardInfo.type) {
            pps.creditCardType = creditCardInfo.type;

            pps.onCreditCardTypeChanged.call(this, pps.creditCardType);
        }
    }

    setCurrentSelection(endPos, oldValue) {
        let elem = this.element;

        // If cursor was at the end of value, just place it back.
        // Because new value could contain additional chars.
        if (oldValue.length !== endPos && elem === document.activeElement) {
            if (elem.createTextRange) {
                let range = elem.createTextRange();

                range.move('character', endPos);
                range.select();
            } else {
                elem.setSelectionRange(endPos, endPos);
            }
        }
    }

    updateValueState() {
        let endPos = this.element.selectionEnd;
        let oldValue = this.element.value;

        // fix Android browser type="text" input field
        // cursor not jumping issue
        if (this.isAndroid) {
            window.setTimeout(function () {
                this.element.value = this.properties.result;
                this.setCurrentSelection(endPos, oldValue);
            }, 1);
            return;
        }

        this.element.value = this.properties.result;
        console.log('gengxing', this.properties.result, this.element.value, endPos, oldValue  )
        this.setCurrentSelection(endPos, oldValue);
    }

    // 电话格式 暂时不使用
    /* setPhoneRegionCode(phoneRegionCode: string) {
        let pps = this.properties;
        pps.phoneRegionCode = phoneRegionCode;
        this.initPhoneFormatter();
        this.onChange();
    } */

    setRawValue(value: string) {
        let pps = this.properties;
        value = value !== undefined && value !== null ? value.toString() : '';

        if (pps.numeral) {
            value = value.replace('.', pps.numeralDecimalMask);
        }

        pps.backspace = false;

        this.element.value = value;
        this.onInput(value);
    }

    getRawValue() {
        const Util = Cleave.Util;
        let pps = this.properties;
        let rawValue = this.element.value;

        if (pps.rawValueTrimPrefix) {
            rawValue = Util.getPrefixStrippedValue(rawValue, pps.prefix, pps.prefixLength);
        }

        if (pps.numeral) {
            rawValue = pps.numeralFormatter.getRawValue(rawValue);
        } else {
            rawValue = Util.stripDelimiters(rawValue, pps.delimiter, pps.delimiters);
        }

        return rawValue;
    }

    getISOFormatDate() {
        let pps = this.properties;
        return pps.date ? pps.dateFormatter.getISOFormatDate() : '';
    }

    getFormattedValue() {
        return this.element.value;
    }

    destroy() {
        this.element.removeEventListener('input', this.onChangeListener);
        this.element.removeEventListener('keydown', this.onKeyDownListener);
        this.element.removeEventListener('cut', this.onCutListener);
        this.element.removeEventListener('copy', this.onCopyListener);
        this.element.removeEventListener('blur', this.onCopyListener);
    }

    toString() {
        return '[Cleave Object]';
    }
}
