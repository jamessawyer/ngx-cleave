export interface CleaveOptions {
    creditCard?: boolean;
    creditCardStrictMode?: boolean;    // 用来取消16位限制 支持19位银行卡
    creditCardType?: string;
    onCreditCardTypeChanged?: Function;

    // phone?: boolean;                // 暂时不用phone 因为它依赖google外部库 可以使用numeral模拟
    // phoneRegionCode?: string;
    // phoneFormatter?: any;

    date?: boolean;
    datePattern?: string[];
    dateFormatter?: any;

    numeral?: boolean;
    numeralIntegerScale?: number;          // 数字位数
    numeralDecimalScale?: number;
    numeralDecimalMark?: string;
    numeralThousandsGroupStyle?: string;
    numeralPositiveOnly?: boolean;
    stripLeadingZeroes?: boolean;         // 是否去掉数字最前面的 0

    numericOnly?: boolean;

    noImmediatePrefix?: boolean;

    uppercase?: boolean;
    lowercase?: boolean;

    prefix?: string;
    prefixLength?: number;

    rawValueTrimPrefix?: boolean;
    copyDelimiter?: boolean;

    initValue?: string;

    delimiter?: string;
    delimiters?: string[];

    blocks?: number[];
    blocksLength?: number;

    maxLength?: number;

    backspace?: boolean;

    result?: string;
}
