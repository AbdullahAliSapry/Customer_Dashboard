# CreateOrEditPriceOfferPage

صفحة إنشاء وتعديل عروض الأسعار مقسمة إلى مكونات صغيرة ومنظمة.

## الهيكل

```
CreateOrEditPriceOfferPage/
├── index.tsx                 # الملف الرئيسي للصفحة
├── components/               # مجلد المكونات الفرعية
│   ├── index.ts             # تصدير جميع المكونات
│   ├── LoadingSpinner.tsx   # مكون شاشة التحميل
│   ├── ErrorMessage.tsx     # مكون رسائل الخطأ
│   ├── ExpiryDateAndNotes.tsx # مكون تاريخ الانتهاء والملاحظات
│   ├── ItemsSection.tsx     # مكون قسم العناصر
│   ├── ItemRow.tsx          # مكون صف العنصر الواحد
│   └── SummarySection.tsx   # مكون قسم الملخص
└── README.md                # هذا الملف
```

## المكونات

### LoadingSpinner
- يعرض شاشة التحميل مع spinner
- يستخدم الترجمة للرسالة

### ErrorMessage
- يعرض رسائل الخطأ بتنسيق جميل
- يقبل رسالة كـ prop

### ExpiryDateAndNotes
- يحتوي على حقول تاريخ الانتهاء والملاحظات
- يدير state الخاص بهذه الحقول

### ItemsSection
- يدير قائمة العناصر
- يحتوي على زر إضافة عنصر جديد
- يعرض قائمة من ItemRow components

### ItemRow
- يمثل صف واحد من العناصر
- يحتوي على حقول: المنتج، الكمية، السعر، الخصم، الإجمالي
- يدير التحقق من صحة البيانات
- يحتوي على زر حذف العنصر

### SummarySection
- يعرض ملخص العرض
- يحتوي على: عدد العناصر، المجموع الفرعي، الضريبة، المجموع الكلي

## المميزات

✅ **كود منظم**: كل مكون له مسؤولية محددة  
✅ **قابلية إعادة الاستخدام**: المكونات يمكن استخدامها في أماكن أخرى  
✅ **سهولة الصيانة**: كل مكون منفصل ويمكن تعديله بسهولة  
✅ **ترجمة كاملة**: جميع النصوص تدعم الترجمة العربية والإنجليزية  
✅ **تحقق من صحة البيانات**: تحقق شامل من جميع الحقول  
✅ **واجهة مستخدم جميلة**: تصميم متجاوب مع animations  

## الاستخدام

```tsx
import CreateOrEditPriceOfferPage from './pages/priceOffers/CreateOrEditPriceOfferPage';

// في React Router
<Route path="/store/:storeId/price-offers/create" element={<CreateOrEditPriceOfferPage />} />
<Route path="/store/:storeId/price-offers/:offerId/edit" element={<CreateOrEditPriceOfferPage />} />
``` 