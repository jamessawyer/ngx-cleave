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

  // 配置
  cardOption1 = {
    creditCard: true,
    blocks: [4, 4, 4, 4],
    delimiter: ' ',
  }
  // card3 = this.cardOption1.initValue;
  ngOnInit() {
  }

}
