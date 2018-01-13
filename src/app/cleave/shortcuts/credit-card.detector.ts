export class CreditCardDetector {
    static blocks = {
        uatp:          [4, 5, 6],
        amex:          [4, 6, 5],
        diners:        [4, 6, 4],
        discover:      [4, 4, 4, 4],
        mastercard:    [4, 4, 4, 4],
        dankort:       [4, 4, 4, 4],
        instapayment:  [4, 4, 4, 4],
        jcb:           [4, 4, 4, 4],
        maestro:       [4, 4, 4, 4],
        visa:          [4, 4, 4, 4],
        mir:           [4, 4, 4, 4],
        general:       [4, 4, 4, 4],
        unionPay:      [4, 4, 4, 4],
        generalStrict: [4, 4, 4, 7],
    };

    static re = {
        // 1开头; 15位, 不以1800开头 (jcb card)
        uatp: /^(?!1800)1\d{0,14}/,

        // 34/37开头; 15位
        amex: /^3[47]\d{0,13}/,

        // 6011/65/644-649开头; 16位
        discover: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,

        // 300-305/309 或者 36/38/39 开头; 14位
        diners: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,

        // 51-55/2221–2720 开头; 16位
        mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,

        // 5019/4175/4571 开头; 16位
        dankort: /^(5019|4175|4571)\d{0,12}/,

        // 637-639 开头; 16位
        instapayment: /^63[7-9]\d{0,13}/,

        // 2131/1800/35 开头; 16位
        jcb: /^(?:2131|1800|35\d{0,2})\d{0,12}/,

        // 50/56-58/6304/67 开头; 16位
        maestro: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,

        // 22 开头; 16位
        mir: /^220[0-4]\d{0,12}/,

        // 4 开头; 16位
        visa: /^4\d{0,15}/,

        // 62 开头; 16位
        unionPay: /^62\d{0,14}/,

    };

    static getInfo(value: string, strictMode: boolean) {
        const blocks = CreditCardDetector.blocks;
        const re = CreditCardDetector.re;

        // In theory, visa credit card can have up to 19 digits number.
        // Set strictMode to true will remove the 16 max-length restrain,
        // however, I never found any website validate card number like
        // this, hence probably you don't need to enable this option.
        strictMode = !!strictMode;

        // tslint:disable-next-line:prefer-const
        for (let key in re) {
            if (re[key].test(value)) {
                let block;

                if (
                    key === 'discover' ||
                    key === 'maestro' ||
                    key === 'visa' ||
                    key === 'mir' ||
                    key === 'unionPay'
                ) {
                    block = strictMode ? blocks.generalStrict : blocks[key];
                } else {
                    block = blocks[key];
                }
                return {
                    type: key,
                    blocks: block
                };
            }
        }

        return {
            type: 'unknown',
            blocks: strictMode ? blocks.generalStrict : blocks.general
        };
    }
}
