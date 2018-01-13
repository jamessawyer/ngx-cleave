import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  num1: number;             // 带小数点的数字
  dec: number;
  num2: number;             // 纯数字
  num3: string;             // 使用blocks 手机号


  // 时间
  date1: string;
  // // money = 1233344;
  // // option1 = JSON.stringify({
  // //   // numeral: true,
  // //   // numeralThousandsGroupStyle: 'thousand',
  // //   // prefix: '$',
  // //   numericOnly: true,
  // //   // numeralDecimalMark: '.',
  // //   // numeralDecimalScale: 2,
  // //   blocks: [3, 4, 4]
  // // });

  // // option2 = {
  // //   date: true,
  // //   datePattern: ['Y', 'm', 'd'],
  // //   // delimiter: '.'
  // // };

  // // creditCardOption = {
  // //   creditCard: true,
  // // };

  // date = '20180108';
  // custom = 'ddssyyy';
  // phone = '131 1436 6169';
  // decimal: number;
  // finalPhone;
  // smallNum: number;
  // options = {
  //   initVal: this.phone
  // }

  // getPhone(event) {
  //   // this.phone = event;
  //   this.finalPhone = event;
  //   console.log('地价款进口大豆进口....', this.finalPhone);
  // }

  ngOnInit() {
  }

}
