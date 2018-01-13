export default class CleaveUtil {
    static noop() {}

    static strip(value: string, re: RegExp): string {
        return value.replace(re, '');
    }

    static isDelimiter(letter: string, delimiter: string, delimiters: string[]): boolean {
        // 单一分隔符
        if (delimiters.length === 0) {
            return letter === delimiter;
        }

        // 多个分隔符
        return delimiters.some((current) => letter === current);
    }

    /**
     * 生成正则表达式
     * @param delimiter {string} 分隔符
     */
    static getDelimiterREByDelimiter(delimiter: string): RegExp {
        return new RegExp(delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g');
    }

    /**
     * 去掉分隔符
     * @example stripDelimiters('123 12/3', ' ', [' ', '/']) => '123123'
     * @example stripDelimiters('123 123', ' ', []) => '123123'
     */
    static stripDelimiters(value: string, delimiter: string, delimiters: string[]): string {
        // 单一分隔符
        if (delimiters.length === 0) {
            const delimiterRE = delimiter ? this.getDelimiterREByDelimiter(delimiter) : '';
            return value.replace(delimiterRE, '');
        }

        // 多个分隔符
        delimiters.forEach(current => {
            value = value.replace(this.getDelimiterREByDelimiter(current), '');
        });

        return value;
    }

    static headStr(str: string, length: number): string {
        return str.slice(0, length);
    }

    /**
     * 根据blocks获取输入字符的最大长度
     * @param blocks {number[]} 字符串的组成形式，比如 [3, 4, 4] 形式
     */
    static getMaxLength(blocks: number[]): number {
        return blocks.reduce((prev, curr) => prev + curr, 0);
    }

    /**
     * 获取2个字符串第一次出现差异的地方
     * @param prev {string} 前一个位置
     * @param current {string} 当前位置
     */
    static getFirstDiffIndex(prev: string, current: string): number {
        let index = 0;
        while (prev.charAt(index) === current.charAt(index)) {
            if (prev.charAt(index++) === '') {
                return -1;
            }
        }
        return index;
    }

    /**
     * 去掉前缀 如果有的话
     * @param value {string} 字符串的值
     * @param prefix {string} 前缀
     * @param prefixLength {number} 前缀的长度
     * @example (PR123, 3) -> 23 this happens when user hits backspace in front of "PRE"
     * @example (PRE123, 3) -> 123
     */
    static getPrefixStrippedValue(value: string, prefix: string, prefixLength: number): string {
        if (value.slice(0, prefixLength) !== prefix) {
            const diffIndex = this.getFirstDiffIndex(prefix, value.slice(0, prefixLength));
            value = prefix + value.slice(diffIndex, diffIndex + 1) + value.slice(prefixLength + 1);
        }

        return value.slice(prefixLength);
    }

    /**
     * 获取格式化之后的value
     * @param value {string} 输入框的值
     * @param blocks {number[]} 分组形式
     * @param blockLength {number} 组的长度
     * @param delimiter {string} 单一分隔符
     * @param delimiters {string[]} 多个分隔符
     * @returns {string}
     * @example getFormattedValue('abcdefghijkl', [3, 4, 5], 3, '/', ['-', '@']) => abc-defg@hijkl
     */
    static getFormattedValue(value: string, blocks: number[], blockLength: number, delimiter: string, delimiters: string[]): string {
        let result = '',
            currentDelimiter;
        const multipleDelimiters = delimiters.length > 0;

        // 没有配置项 则是普通的input
        if (blockLength === 0) {
            return value;
        }

        blocks.forEach((length, index) => {
            if (value.length > 0) {
                const sub = value.slice(0, length),
                    rest = value.slice(length);

                result += sub;

                currentDelimiter = multipleDelimiters ? (delimiters[index] || currentDelimiter) : delimiter;

                if (sub.length === length && index < blockLength - 1) {
                    result += currentDelimiter;
                }

                value = rest; // 更新剩下的字符
            }
        });

        return result;
    }

    /**
     * 判断是否是安卓
     */
    static isAndroid(): boolean {
        return navigator && /android/i.test(navigator.userAgent);
    }

    // On Android chrome, the keyup and keydown events
    // always return key code 229 as a composition that
    // buffers the user’s keystrokes
    // see https://github.com/nosir/cleave.js/issues/147
    static isAndroidBackspaceKeydown(lastInputValue: string, currentInputValue: string): boolean {
        if (!this.isAndroid || !lastInputValue || !currentInputValue) {
            return false;
        }

        return currentInputValue === lastInputValue.slice(0, -1);
    }
}
