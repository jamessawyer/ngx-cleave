## 可输入属性
参考 **`cleave.directive.ts`**

值得注意的是，可以通过下面3种方式配置：
  - 使用 **`options`**，它是一个对象
  - 使用单一的属性
  - 混合着使用

```
# 方式1
<input cleave [options]="myOptions" />
myOptions = {
  numeral: true,
  delimiter: '|'
}

# 方式2
<input cleave [numeral]="true" [delimiter]="'|'" />
```

## 获取输入框中的值

可以在父级中使用 **`onInput`** Output

```
<input cleave [options]="myOptions" (onInput)="getInputValue($event)" />
```

## credit card

  - **`creditCardStrictMode`**: {boolean} 用来取消银行卡16位限制，可以为19位，默认是16位

## 实现手机号格式

使用 **`numericOnly: true`** 配置


## TODOS
由于格式化还存在下列问题:
  - 当格式化数据达到blocks要求之后，后面按的一个数字会被保存到数据中
  - 无法初始化数据到输入框中 **`initValue`** 存在问题
  - 当输入框使用 **`date` | `creditCard`** 时，需要手动的添加 **`delimiter` && `blocks`** 属性，十分的不方便
