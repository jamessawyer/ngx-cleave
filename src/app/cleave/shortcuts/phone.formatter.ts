export class PhoneFormatter {
    delimiterRE: RegExp | string;
    delimiter: string;
    formatter: any;

    constructor(delimiter, formatter) {
        this.formatter = formatter;
        this.delimiter = (delimiter || delimiter === '') ? delimiter : ' ';
        this.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';
    }

    setFormatter(formatter): void {
        this.formatter = formatter;
    }

    format(phoneNumber: string) {
        this.formatter.clear();           // 暂时不知道其含义

        // 只保留数值和加号(+)
        phoneNumber = phoneNumber.replace(/[^\d+]/g, '');

        // 去掉 分隔符
        phoneNumber = phoneNumber.replace(this.delimiterRE, '');

        let result = '',
            current: string,
            validated = false;

        for (let i = 0, iMax = phoneNumber.length; i < iMax; i++) {
            current = this.formatter.inputDigit(phoneNumber.charAt(i)); // 暂时不知道其含义

            if (/[\s()-]/g.test(current)) {
                result = current;

                validated = true;
            } else {
                if (!validated) {
                    result = current;
                }
            }
        }

        // strip() eg: US: 7161234567 returns (716) 123-4567
        result = result.replace(/[()]/g, '');

        // 使用自定义分隔符替换为库自身的分隔符
        result = result.replace(/[\s-]/g, this.delimiter);

        return result;
    }
}
