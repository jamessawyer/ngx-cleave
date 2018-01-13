import { CleaveOptions } from './cleave-options.interface';

export default class CleaveDefaultProps {
static assign(target: any = {}, opts: CleaveOptions = {}): any {

        // 信用卡
        target.creditCard = !!opts.creditCard;
        target.creditCardStrictMode = !!opts.creditCardStrictMode;
        target.creditCardType = '';
        target.onCreditCardTypeChanged = opts.onCreditCardTypeChanged || (() => {});

        // 手机 暂时不用
        /* target.phone = !!opts.phone;
        target.phoneRegionCode = opts.phoneRegionCode || 'CH';
        target.phoneFormatter = {}; */

        // 日期时间
        target.date = !!opts.date;
        target.datePattern = opts.datePattern || ['Y', 'm', 'd'];
        target.dateFormatter = {};

        // 数值类型
        target.numeral = !!opts.numeral;
        target.numeralIntegerScale = opts.numeralIntegerScale > 0 ? opts.numeralIntegerScale : 0;
        target.numericOnly = opts.numericOnly;
        if (!!opts.numericOnly) {
            target.numeralDecimalScale = 0;      // 小数位数
        } else {
            target.numeralDecimalScale = opts.numeralDecimalScale >= 0 ? opts.numeralDecimalScale : 2;      // 小数位数
            target.numeralDecimalMark = opts.numeralDecimalMark || '.';
        }
        target.numeralThousandsGroupStyle = opts.numeralThousandsGroupStyle || 'thousand';             // 千位数样式
        target.numeralPositiveOnly = !!opts.numeralPositiveOnly;
        target.stripLeadingZeroes = !!opts.stripLeadingZeroes ? true : opts.stripLeadingZeroes;

        // 其他配置
        target.numericOnly = target.creditCard || target.date || !!opts.numericOnly;

        target.uppercase = !!opts.uppercase;
        target.lowercase = !!opts.lowercase;

        target.prefix = (target.creditCard || target.date) ? '' : (opts.prefix || '');
        target.noImmediatePrefix = !!opts.noImmediatePrefix;
        target.prefixLength = target.prefix.length;
        target.rawValueTrimPrefix = !!opts.rawValueTrimPrefix;
        target.copyDelimiter = !!opts.copyDelimiter;

        target.initValue = (opts.initValue !== undefined && opts.initValue !== null) ? opts.initValue.toString() : '';

        /* target.delimiter =
            (opts.delimiter || opts.delimiter === '')
                ? opts.delimiter
                : (opts.date ? '/' :
                    (opts.numeral ? ',' :
                        (opts.phone ? ' ' :
                            ' ')
                    )
                ); */

        target.delimiter =
            (opts.delimiter || opts.delimiter === '') ? opts.delimiter :
                (opts.date ? '/' :
                    (opts.numeral ? ',' : ' ')
                );
        console.log('目标target.initValue。。。', target.initValue);
        target.delimiterLength = target.delimiter.length;
        target.delimiters = opts.delimiters || [];
        target.blocks = opts.blocks || [];
        target.blocksLength = target.blocks.length;

        // target.root = (typeof global === 'object' && global) ? global : window;
        target.root = window;

        target.maxLength = 0;

        target.backspace = false;
        target.result = '';

        return target;
    }
}
