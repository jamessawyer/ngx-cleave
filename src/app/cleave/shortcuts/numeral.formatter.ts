export class NumeralFormatter {

    static groupStyle = {
        thousand: 'thousand',
        lakh: 'lakh',             // 可以忽略
        wan: 'wan',
        none: 'none'
    };

    numeralDecimalMark: string;
    numeralIntegerScale: number;                // 保留小数点位数
    numeralDecimalScale: number;
    numeralThousandsGroupStyle: string;
    numeralPositiveOnly: boolean;
    stripLeadingZeros: boolean;
    delimiter: string;
    delimiterRE: RegExp | string;                // 分隔符正则


    constructor(
        numeralIntegerScale: number,
        numeralDecimalScale: number,
        numeralThousandsGroupStyle: string,
        numeralPositiveOnly: boolean,
        delimiter: string,
        numeralDecimalMark: string = '.',
        stripLeadingZeros: boolean = true,
    ) {
        this.numeralIntegerScale = numeralIntegerScale > 0 ? numeralIntegerScale : 0;
        this.numeralDecimalScale = numeralDecimalScale >= 0 ? numeralDecimalScale : 2;
        this.numeralThousandsGroupStyle = numeralThousandsGroupStyle || NumeralFormatter.groupStyle.thousand;
        this.numeralPositiveOnly = !!numeralPositiveOnly;
        this.delimiter = (delimiter || delimiter === '') ? delimiter : '';
        this.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';
        this.numeralDecimalMark = numeralDecimalMark;       // 修复没有小数点的bug
        this.stripLeadingZeros = !stripLeadingZeros ? true : stripLeadingZeros;
    }

    /**
     * 将分隔符和小数点去掉
     * @param value {string} input的值
     */
    getRawValue(value: string): string {
        return value.replace(this.delimiterRE, '').replace(this.numeralDecimalMark, '.');
    }

    /**
     * 格式化字符串
     * @param value {string}
     */
    format(value: string): string {
        let parts: string[],                                           // 分割的部分
            partInteger: string,                                       // 整数部分
            partDecimal = '';                                          // 小数部分 包含金融标记(一般是小数点'.')

        value = value.replace(/[A-Za-z]/g, '')                         // 去掉字母
                    .replace(this.numeralDecimalMark, 'M')             // 将第一个金融标记换成 'M' 标记
                    .replace(/[^\dM-]/g, '')                           // 将非数字和负号(-)以及'M' 去掉
                    .replace(/^\-/, 'N')                               // 将最前面的负号(-) 替换成 'N' (negative) 标记
                    .replace(/\-/g, '')                                // 将其它的负号(-)去掉
                    .replace('N', this.numeralPositiveOnly ? '' : '-') // 如果只允许正数则将'N'去掉，否则替换为 负号'-'
                    .replace('M', this.numeralDecimalMark);            // 替换掉decimal mark

        console.log('数值value。。。',this.numeralDecimalMark, value);
        // 将前面的leading zeros去掉
        if (this.stripLeadingZeros) {
            value = value.replace(/^(-)?0+(?=\d)/, '$1');
        }

        partInteger = value;

        if (value.indexOf(this.numeralDecimalMark) >= 0) {
            parts = value.split(this.numeralDecimalMark);
            partInteger = parts[0];
            partDecimal = this.numeralDecimalMark + parts[1].slice(0, this.numeralDecimalScale);
        }

        if (this.numeralIntegerScale > 0) {
            partInteger = partInteger.slice(0, this.numeralIntegerScale + (value.slice(0, 1) === '=' ? 1 : 0));
        }

        switch (this.numeralThousandsGroupStyle) {
            case NumeralFormatter.groupStyle.lakh:
                partInteger = partInteger.replace(/(\d)(?=(\d\d)+\d$)/g, '$1' + this.delimiter);
                break;

            case NumeralFormatter.groupStyle.wan:
                partInteger = partInteger.replace(/(\d)(?=(\d{4})+$)/g, '$1' + this.delimiter);
                break;

            case NumeralFormatter.groupStyle.thousand:
                partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, '$1' + this.delimiter);
                break;
        }

        return partInteger.toString() + (this.numeralDecimalScale > 0 ? partDecimal.toString() : '');
    }

}
