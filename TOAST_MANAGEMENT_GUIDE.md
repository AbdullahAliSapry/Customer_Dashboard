# Toast Management Guide

## المشكلة (The Problem)
كانت المشكلة أن التطبيق يعرض أكثر من toast notification في نفس الوقت، مما يسبب تجربة مستخدم سيئة.

## الحل (The Solution)
تم تحديث `ApiRepository` لإضافة خيارات للتحكم في عرض toast notifications.

## الطرق الجديدة (New Methods)

### 1. استخدام ApiManager (Recommended)
```typescript
import { ApiManager } from '../Api/ApiRepository';

// استخدام instance واحد فقط
const apiRepository = ApiManager.getApiRepository();

// أو إنشاء instance جديد بدون toasts
const apiRepository = ApiManager.createApiRepository(false);
```

### 2. التحكم في Toasts لكل استدعاء
```typescript
// عرض toast (افتراضي)
await apiRepository.create(endpoint, data, successAction);

// عدم عرض toast
await apiRepository.create(endpoint, data, successAction, undefined, false);

// عرض toast
await apiRepository.create(endpoint, data, successAction, undefined, true);
```

### 3. استخدام React Hook
```typescript
import { useApiRepository } from '../Api/ApiRepository';

const MyComponent = () => {
  const apiRepository = useApiRepository(); // مع toasts
  // أو
  const apiRepository = useApiRepository(false); // بدون toasts
  
  // استخدام apiRepository...
};
```

### 4. Batch API Calls مع toast واحد فقط
```typescript
import { ApiManager } from '../Api/ApiRepository';

// تنفيذ عدة API calls مع toast واحد فقط
await ApiManager.batchApiCalls([
  () => apiRepository.create(endpoint1, data1, action1, undefined, false),
  () => apiRepository.update(endpoint2, id2, data2, action2, undefined, false),
  () => apiRepository.delete(endpoint3, id3, action3, undefined, false)
], "تم حفظ جميع البيانات بنجاح");
```

## أمثلة عملية (Practical Examples)

### مثال 1: تحديث ملف PriceOffersPage
```typescript
// قبل التحديث (يسبب multiple toasts)
useEffect(() => {
  const apiRepository = new ApiRepository();
  apiRepository.getAll(endpoint, setPriceOffers);
}, []);

const handleDelete = async (id: string) => {
  const apiRepository = new ApiRepository();
  await apiRepository.delete(endpoint, id, deleteAction);
};

// بعد التحديث (toast واحد فقط)
useEffect(() => {
  const apiRepository = ApiManager.getApiRepository();
  apiRepository.getAll(endpoint, setPriceOffers);
}, []);

const handleDelete = async (id: string) => {
  const apiRepository = ApiManager.getApiRepository();
  await apiRepository.delete(endpoint, id, deleteAction);
};
```

### مثال 2: عمليات متعددة مع toast واحد
```typescript
const handleSaveAll = async () => {
  await ApiManager.batchApiCalls([
    () => apiRepository.create(productsEndpoint, productData, setProducts, undefined, false),
    () => apiRepository.create(categoriesEndpoint, categoryData, setCategories, undefined, false),
    () => apiRepository.update(storeEndpoint, storeId, storeData, setStore, undefined, false)
  ], "تم حفظ جميع البيانات بنجاح");
};
```

## نصائح (Tips)

1. **استخدم ApiManager.getApiRepository()** بدلاً من `new ApiRepository()`
2. **استخدم showToast: false** للعمليات التي لا تحتاج toast
3. **استخدم batchApiCalls** للعمليات المتعددة
4. **استخدم useApiRepository hook** في React components

## الفوائد (Benefits)

- ✅ منع multiple toasts
- ✅ تحكم أفضل في تجربة المستخدم
- ✅ كود أكثر تنظيماً
- ✅ سهولة الصيانة
- ✅ أداء أفضل 