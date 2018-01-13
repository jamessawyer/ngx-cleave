export class DateFormatter {
    date: number[] = [];
    blocks: number[] = [];
    datePattern: string[];            // 比如 ['Y', 'm', 'd'] ['m', 'y']

    constructor(datePattern: string[]) {
        this.datePattern = datePattern;
        this.initBlocks();
    }

    /**
     * 初始化blocks
     * 'Y' 表示长度为 4
     * @example ['Y', 'm', 'd'] => [4, 2, 2]
     */
    initBlocks(): void {
        this.datePattern.forEach(value => {
            if (value === 'Y') {
                this.blocks.push(4);
            } else {
                this.blocks.push(2);
            }
        });
    }

    getISOFormatDate(): string {
        return this.date[2] ? (
            this.date[2] + '-' + this.addLeadingZero(this.date[1]) + '-' + this.addLeadingZero(this.date[0])
        ) : '';
    }

    getBlocks(): number[] {
        return this.blocks;
    }

    /**
     * 获取有效的时间
     * @param value {string}
     */
    getValidatedDate(value: string): string {
        let result = '';

        value = value.replace(/[^\d]/g, '');

        this.blocks.forEach((length, index) => {
            if (value.length > 0) {
                let sub = value.slice(0, length);
                const sub0 = sub.slice(0, 1);
                const rest = value.slice(length);

                switch (this.datePattern[index]) {
                    case 'd':
                        if (sub === '00') {
                            sub = '01';
                        } else if (parseInt(sub0, 10) > 3) {
                            sub = '0' + sub0;
                        } else if (parseInt(sub, 10) > 31) {
                            sub = '31';
                        }
                        break;

                   case 'm':
                        if (sub === '00') {
                            sub = '01';
                        } else if (parseInt(sub0, 10) > 3) {
                            sub = '0' + sub0;
                        } else if (parseInt(sub, 10) > 12) {
                            sub = '12';
                        }
                        break;
                }

                result += sub;

                value = rest;  // 更新余下的字符串
            }
        });

        console.log('有效时间。。。', result);

        return this.getFixedDateString(result);
    }

    /**
     * 获取格式化之后的日期字符串
     * @param value {string}
     */
    getFixedDateString(value: string): string {
        const datePattern = this.datePattern;
        let date: number[] = [],
            dayIndex = 0,
            monthIndex = 0,
            yearIndex = 0,
            dayStartIndex = 0,
            monthStartIndex = 0,
            yearStartIndex = 0,
            day: number,
            month: number,
            year: number;

        // mm-dd || dd-mm 格式
        if (value.length === 4 && datePattern[0].toLowerCase() !== 'y' && datePattern[1].toLowerCase() !== 'y') {
            dayStartIndex = datePattern[0] === 'd' ? 0 : 2;
            monthStartIndex = 2 - dayStartIndex;
            day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
            month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);

            date = this.getFixedDate(day, month, 0);
        }

        // yyyy-mm-dd || yyyy-dd-mm || mm-dd-yyyy || dd-mm-yyyy || dd-yyyy-mm || mm-yyyy-dd
        if (value.length === 8) {
            datePattern.forEach((type, index) => {
                switch (type) {
                    case 'd':
                        dayIndex = index;
                        break;
                    case 'm':
                        monthIndex = index;
                        break;
                    default:
                        yearIndex = index;
                        break;
                }
            });

            yearStartIndex = yearIndex * 2;
            dayStartIndex = (dayIndex <= yearIndex) ? dayIndex * 2 : (dayIndex * 2 + 2);
            monthStartIndex = (monthIndex <= yearIndex) ? monthIndex * 2 : (monthIndex * 2 + 2);

            day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
            month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
            year = parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10);

            date = this.getFixedDate(day, month, year);
        }

        this.date = date;

        return date.length === 0 ? value : datePattern.reduce((prev, curr) => {
            switch (curr) {
                case 'd':
                    return prev + this.addLeadingZero(date[0]);
                case 'm':
                    return prev + this.addLeadingZero(date[1]);
                default:
                    return prev + '' + (date[2] || '');
            }
        }, '');
    }

    /**
     * 返回日月年
     * @param day {number} 天
     * @param month {number} 月
     * @param year {number} 年
     */
    getFixedDate(day: number, month: number, year: number): number[] {
        day = Math.min(day, 31);
        month = Math.min(month, 12);
        year = parseInt(String(year || 0), 10);

        // 处理大月小月 和 二月的问题
        if ((month < 7 && month % 2 === 0) || (month  > 8 && month % 2) === 1) {
            day = Math.min(day, month === 2 ? (this.isLeapYear(year) ? 29 : 28) : 30);
        }
        console.log('年月日。。。', [day, month, year]);
        return [day, month, year];
    }

    private isLeapYear(year: number): boolean {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    private addLeadingZero(num: number): string {
        return (num < 10 ? '0' : '') + num;
    }
}
