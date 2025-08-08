# تنفيذ نظام عروض الأسعار

## ما تم إنجازه:

### 1. إنشاء الـ Interface
- تم إنشاء `StorePriceOffers.ts` مع:
  - `PriceOfferStatus` enum (Pending, Accepted, Rejected)
  - `StorePriceOffer` interface مع جميع الحقول المطلوبة
  - `PriceOfferItem` interface للمنتجات في العرض

### 2. إنشاء Redux Slice
- تم إنشاء `PriceOffersSlice.ts` مع الـ actions التالية:
  - `setPriceOffers` - تعيين قائمة عروض الأسعار
  - `setCurrentPriceOffer` - تعيين عرض السعر الحالي
  - `updatePriceOffer` - تحديث عرض سعر
  - `deletePriceOffer` - حذف عرض سعر
  - `addPriceOffer` - إضافة عرض سعر جديد

### 3. إضافة الـ Slice إلى Store
- تم إضافة `PriceOffersReducer` إلى الـ store الرئيسي

### 4. إنشاء الصفحات
- **PriceOffersPage.tsx**: صفحة قائمة عروض الأسعار مع:
  - جدول يعرض جميع العروض
  - أزرار إنشاء، تعديل، حذف، وعرض التفاصيل
  - عرض الحالة مع ألوان مختلفة
  - حساب الإجمالي لكل عرض

- **PriceOfferDetailsPage.tsx**: صفحة تفاصيل عرض السعر مع:
  - عرض تفصيلي لجميع المنتجات
  - معلومات التواريخ والحالة
  - الملاحظات وتعليقات العميل
  - إجمالي المبلغ

### 5. إنشاء Modal
- **PriceOfferModal.tsx**: modal لإنشاء وتعديل عروض الأسعار مع:
  - نموذج لإدخال بيانات العرض
  - إمكانية إضافة/حذف منتجات
  - حساب تلقائي للإجمالي
  - اختيار تاريخ انتهاء الصلاحية

### 6. إضافة API Endpoints
- تم إضافة endpoints في `EndPoints.ts`:
  - `priceOffers(storeId)` - للحصول على عروض متجر معين
  - `priceOffer` - للعمليات على عرض سعر واحد

### 7. إضافة الترجمات
- تم إضافة ترجمات عربية وإنجليزية لجميع النصوص المستخدمة
- تم إضافة `currency` إلى `common` في الترجمات

## الميزات المطبوعة:

1. **إدارة عروض الأسعار**: إنشاء، تعديل، حذف، وعرض العروض
2. **حساب تلقائي**: حساب الإجمالي مع الخصومات
3. **إدارة الحالة**: عرض حالات مختلفة (معلق، مقبول، مرفوض)
4. **تاريخ انتهاء الصلاحية**: تتبع صلاحية العروض
5. **ملاحظات وتعليقات**: إمكانية إضافة ملاحظات وتعليقات العميل
6. **واجهة مستخدم متجاوبة**: تصميم متجاوب يعمل على جميع الأجهزة
7. **دعم متعدد اللغات**: ترجمات عربية وإنجليزية
8. **إحصائيات تفاعلية**: عرض إحصائيات العروض في بطاقات جذابة
9. **بحث متقدم**: إمكانية البحث في العروض
10. **تصميم عصري**: واجهة مستخدم حديثة وجذابة
11. **حالات فارغة**: رسائل واضحة عندما لا توجد عروض
12. **تحميل محسن**: شاشات تحميل جميلة ومعلوماتية

## كيفية الاستخدام:

1. **الوصول للصفحة**: انتقل إلى متجر معين ثم اختر "عروض الأسعار" من الـ sidebar
2. **عرض قائمة العروض**: ستظهر صفحة عروض الأسعار مع جميع العروض
3. **إنشاء عرض جديد**: اضغط على "إنشاء عرض سعر"
4. **تعديل عرض**: اضغط على أيقونة التعديل في الجدول
5. **عرض التفاصيل**: اضغط على أيقونة العين لرؤية التفاصيل الكاملة
6. **حذف عرض**: اضغط على أيقونة الحذف

## الـ Routes المضافة:

- `/store/:storeId/price-offers` - صفحة قائمة عروض الأسعار
- `/store/:storeId/price-offers/:offerId` - صفحة تفاصيل عرض السعر

## الملفات المضافة/المعدلة:

### ملفات جديدة:
- `src/Store/StoreSlice/PriceOffersSlice.ts`
- `src/pages/priceOffers/PriceOffersPage.tsx`
- `src/pages/priceOffers/details/PriceOfferDetailsPage.tsx`
- `src/components/forms/modals/PriceOfferModal.tsx`

### مكونات صفحة القائمة:
- `src/pages/priceOffers/components/StatsCards.tsx` - بطاقات الإحصائيات
- `src/pages/priceOffers/components/SearchAndFilters.tsx` - البحث والتصفية
- `src/pages/priceOffers/components/EmptyState.tsx` - الحالة الفارغة
- `src/pages/priceOffers/components/OfferTableRow.tsx` - صف الجدول
- `src/pages/priceOffers/components/StatusBadge.tsx` - شارة الحالة
- `src/pages/priceOffers/components/OffersTable.tsx` - الجدول الرئيسي
- `src/pages/priceOffers/components/PageHeader.tsx` - هيدر الصفحة

### مكونات صفحة التفاصيل:
- `src/pages/priceOffers/details/components/DetailsHeader.tsx` - هيدر التفاصيل
- `src/pages/priceOffers/details/components/ItemsList.tsx` - قائمة المنتجات
- `src/pages/priceOffers/details/components/ItemDetails.tsx` - تفاصيل المنتج
- `src/pages/priceOffers/details/components/NotesSection.tsx` - قسم الملاحظات
- `src/pages/priceOffers/details/components/FeedbackSection.tsx` - قسم التعليقات
- `src/pages/priceOffers/details/components/SummaryCard.tsx` - بطاقة الملخص
- `src/pages/priceOffers/details/components/DatesCard.tsx` - بطاقة التواريخ
- `src/pages/priceOffers/details/components/ActionsCard.tsx` - بطاقة الإجراءات
- `src/pages/priceOffers/details/components/LoadingState.tsx` - حالة التحميل
- `src/pages/priceOffers/details/components/NotFoundState.tsx` - حالة عدم العثور

### ملفات معدلة:
- `src/Store/Store.ts` - إضافة reducer
- `src/Api/EndPoints.ts` - إضافة endpoints
- `src/i18n/translations/ar.ts` - إضافة ترجمات عربية
- `src/i18n/translations/en.ts` - إضافة ترجمات إنجليزية
- `src/App.tsx` - إضافة routes لعروض الأسعار
- `src/components/layout/UnifiedSidebar.tsx` - إضافة رابط عروض الأسعار في الـ sidebar

## إعادة هيكلة المكونات:

تم تقسيم صفحات عروض الأسعار إلى مكونات صغيرة ومنظمة لتحسين:
- **قابلية الصيانة**: كل مكون له مسؤولية محددة
- **إعادة الاستخدام**: يمكن استخدام المكونات في أماكن أخرى
- **سهولة الاختبار**: كل مكون يمكن اختباره بشكل منفصل
- **تنظيم الكود**: هيكل واضح ومنظم للملفات

### هيكل المجلدات:
```
src/pages/priceOffers/
├── PriceOffersPage.tsx
├── components/
│   ├── StatsCards.tsx
│   ├── SearchAndFilters.tsx
│   ├── EmptyState.tsx
│   ├── OfferTableRow.tsx
│   ├── StatusBadge.tsx
│   ├── OffersTable.tsx
│   ├── PageHeader.tsx
│   └── index.ts
└── details/
    ├── PriceOfferDetailsPage.tsx
    └── components/
        ├── DetailsHeader.tsx
        ├── ItemsList.tsx
        ├── ItemDetails.tsx
        ├── NotesSection.tsx
        ├── FeedbackSection.tsx
        ├── SummaryCard.tsx
        ├── DatesCard.tsx
        ├── ActionsCard.tsx
        ├── LoadingState.tsx
        ├── NotFoundState.tsx
        └── index.ts
```

## ملاحظات تقنية:

- تم استخدام Redux Toolkit للـ state management
- تم استخدام React Hook Form للتحقق من صحة البيانات
- تم استخدام Tailwind CSS للتصميم
- تم استخدام Lucide React للأيقونات
- تم استخدام React i18next للترجمة
- تم تطبيق دعم كامل للغتين العربية والإنجليزية
- تم تطبيق اتجاه النص (RTL/LTR) حسب اللغة المختارة
- تم ترجمة جميع النصوص والرسائل في النظام
- تم تطبيق مبادئ Component-Based Architecture
- تم استخدام TypeScript للتحقق من الأنواع 